#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Ingest JSONL results from scripts/search_scrape.py into data/actors.csv and data/sources.csv.

- Reads JSON lines with keys:
  * SearchResult: {"engine","query","url","title","snippet","rank"}
  * Optional page_signals: {"engine","query","page_signals":{"url","title","emails","phones","links","text_size"}}
- Creates/updates actor rows keyed by website domain (canonical) and stable actor_id derived from name+domain.
- Appends discovery sources to data/sources.csv for traceability.
- Idempotent: will not duplicate actors if same domain already exists.

Usage:
  python scripts/ingest_results.py \
    --input logs/gov_search_1.jsonl \
    --category "Government institutions" \
    --locale fr

Requires:
- CSV files must exist with headers (created by plan bootstrap).
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
from datetime import datetime, timezone
from hashlib import sha1
from typing import Dict, List, Tuple
from urllib.parse import urlparse, parse_qs, unquote

ACTORS_PATH = "data/actors.csv"
SOURCES_PATH = "data/sources.csv"

ID_FIELD = "actor_id"
KEY_FIELDS = [
    "official_name",
    "legal_status",
    "year_founded",
    "category",
    "segments",
    "activities",
    "products_services",
    "technologies",
    "commodities",
    "geographic_scope",
    "regions_covered",
    "address",
    "country",
    "website",
    "email",
    "phone",
    "social_links",
    "leadership",
    "ownership",
    "partnerships",
    "programmes",
    "recognitions",
    "latest_metrics",
    "source_summary",
    "source_count",
    "last_verified_at",
    "notes",
]

LIST_FIELDS = {"segments", "commodities", "social_links"}

PIPE = "|"

def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def normalize_space(s: str) -> str:
    import re
    return re.sub(r"\s+", " ", (s or "").strip())

def to_domain(url: str) -> str:
    if not url:
        return ""
    try:
        u = url.strip()
        if not (u.startswith("http://") or u.startswith("https://")):
            u = "http://" + u
        netloc = urlparse(u).netloc.lower()
        netloc = re.sub(r"^www\.", "", netloc)
        return netloc
    except Exception:
        return ""

def slugify_name(name: str) -> str:
    import unicodedata, re
    name = unicodedata.normalize("NFKD", name)
    name = "".join(c for c in name if not unicodedata.combining(c))
    name = name.lower()
    name = re.sub(r"[^\w\s-]", " ", name)
    name = re.sub(r"\s+", "-", name).strip("-")
    name = re.sub(r"-{2,}", "-", name)
    return name or "entity"

def stable_id(name: str, domain: str) -> str:
    slug = slugify_name(name or domain or "entity")
    digest = sha1(f"{slug}|{domain}".encode("utf-8")).hexdigest()[:10]
    return f"{slug}-{digest}"

def read_csv_rows(path: str) -> List[Dict[str, str]]:
    rows: List[Dict[str, str]] = []
    if not os.path.isfile(path):
        return rows
    with open(path, "r", encoding="utf-8") as f:
        r = csv.DictReader(f)
        for row in r:
            # ensure keys
            for k in [ID_FIELD] + KEY_FIELDS:
                row.setdefault(k, "")
            rows.append(row)
    return rows

def write_csv_rows(path: str, rows: List[Dict[str, str]]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fieldnames = [ID_FIELD] + KEY_FIELDS
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for row in rows:
            filtered = {k: row.get(k, "") for k in fieldnames}
            w.writerow(filtered)

def append_source_row(actor_id: str, field: str, value_excerpt: str, source_url: str, publisher: str, source_type: str, lang: str, pub_date: str, access_date: str) -> None:
    file_exists = os.path.isfile(SOURCES_PATH)
    with open(SOURCES_PATH, "a", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        if not file_exists:
            w.writerow(["actor_id","field","value_excerpt","source_url","source_publisher","source_type","source_language","source_publication_date","access_date"])
        w.writerow([actor_id, field, value_excerpt, source_url, publisher, source_type, lang, pub_date, access_date])

def ensure_headers_exist() -> None:
    # Create CSVs with headers if missing
    if not os.path.isfile(ACTORS_PATH):
        write_csv_rows(ACTORS_PATH, [])
    if not os.path.isfile(SOURCES_PATH):
        append_source_row("", "init", "", "", "", "", "", "", "")

def upsert_actor(actors: List[Dict[str, str]], domain: str, official_name: str, category: str, emails: List[str], phones: List[str], source_summary: str) -> Tuple[Dict[str, str], bool]:
    """
    Returns (actor_row, created_flag)
    """
    domain = domain or ""
    found = None
    for row in actors:
        row_dom = to_domain(row.get("website",""))
        if row_dom and domain and row_dom == domain:
            found = row
            break

    if found:
        # merge minimal signals
        # keep existing official_name if present, else set
        if not normalize_space(found.get("official_name","")) and official_name:
            found["official_name"] = official_name
        # merge emails/phones as pipe lists
        if emails:
            found["email"] = merge_pipe(found.get("email",""), emails)
        if phones:
            found["phone"] = merge_pipe(found.get("phone",""), phones)
        # category: preserve if set, else set
        if not normalize_space(found.get("category","")) and category:
            found["category"] = category
        # website: ensure set to domain if empty
        if not normalize_space(found.get("website","")) and domain:
            found["website"] = domain
        # source summary append
        if source_summary:
            found["source_summary"] = merge_pipe(found.get("source_summary",""), [source_summary])
        # source_count increment (as string int)
        try:
            c = int(found.get("source_count","0") or "0")
            found["source_count"] = str(c + 1)
        except Exception:
            found["source_count"] = "1"
        # timestamp
        found["last_verified_at"] = now_iso()
        return found, False

    # create new
    name_for_id = official_name or domain or "entity"
    actor_id = stable_id(name_for_id, domain)
    row = {k: "" for k in [ID_FIELD] + KEY_FIELDS}
    row[ID_FIELD] = actor_id
    row["official_name"] = official_name
    row["category"] = category
    row["country"] = "Madagascar"  # project scope
    row["website"] = domain
    row["email"] = merge_pipe("", emails)
    row["phone"] = merge_pipe("", phones)
    row["source_summary"] = source_summary
    row["source_count"] = "1" if source_summary else "0"
    row["last_verified_at"] = now_iso()
    actors.append(row)
    return row, True

def merge_pipe(existing: str, new_values: List[str]) -> str:
    items = []
    if existing:
        items.extend([x.strip() for x in existing.split(PIPE) if x.strip()])
    for v in new_values:
        v = normalize_space(v)
        if v and v not in items:
            items.append(v)
    return PIPE.join(items)

def main() -> None:
    ap = argparse.ArgumentParser(description="Ingest JSONL search results into CSVs")
    ap.add_argument("--input", type=str, required=True, help="Path to JSONL produced by search_scrape.py")
    ap.add_argument("--category", type=str, required=True, help="Category label for created/updated actors")
    ap.add_argument("--locale", type=str, default="fr", help="Locale tag for source rows (fr|en|mg)")
    args = ap.parse_args()

    ensure_headers_exist()

    # Load existing actors
    actors = read_csv_rows(ACTORS_PATH)

    # Build fast lookup by domain for performance
    # Not strictly necessary as upsert scans list, but OK for small datasets.

    created = 0
    updated = 0

    # First pass: collect page signals by URL (so we can attach emails/phones if available)
    signals_by_url: Dict[str, Dict] = {}

    with open(args.input, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except Exception:
                continue
            if "page_signals" in obj:
                ps = obj["page_signals"]
                url = ps.get("url","")
                if url:
                    signals_by_url[url] = ps

    # Second pass: process search results and write sources
    with open(args.input, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except Exception:
                continue

            # Skip control lines or errors
            if obj.get("control") or obj.get("error"):
                continue

            # Handle SearchResult
            if all(k in obj for k in ("engine","query","url","title","rank")):
                url = obj.get("url","")
                title = normalize_space(obj.get("title",""))
                snippet = normalize_space(obj.get("snippet",""))
                engine = obj.get("engine","")
                query = obj.get("query","")

                domain = to_domain(url)
                # email/phone enrichment if present
                sig = signals_by_url.get(url, {})
                emails = list(sig.get("emails", [])) if sig else []
                phones = list(sig.get("phones", [])) if sig else []

                source_summary = f"{engine}:{args.locale}"
                actor_row, created_flag = upsert_actor(
                    actors=actors,
                    domain=domain,
                    official_name=title,
                    category=args.category,
                    emails=emails,
                    phones=phones,
                    source_summary=source_summary
                )
                if created_flag:
                    created += 1
                else:
                    updated += 1

                # Write a discovery source entry
                actor_id = actor_row.get(ID_FIELD, "")
                access_date = now_iso()
                append_source_row(
                    actor_id=actor_id,
                    field="discovery",
                    value_excerpt=snippet or title,
                    source_url=url,
                    publisher=domain,
                    source_type="web_search",
                    lang=args.locale,
                    pub_date="",  # unknown for search result; fill later when crawling target
                    access_date=access_date
                )

    # Third pass: ingest standalone page_signals entries (e.g., from seed/domain crawls)
    for url, ps in signals_by_url.items():
        domain = to_domain(url)
        if not domain:
            continue
        official_name = normalize_space(ps.get("title", "")) or domain
        emails = list(ps.get("emails", [])) if isinstance(ps.get("emails", []), list) else []
        phones = list(ps.get("phones", [])) if isinstance(ps.get("phones", []), list) else []
        source_summary = f"seed_crawl:{args.locale}"

        actor_row, created_flag = upsert_actor(
            actors=actors,
            domain=domain,
            official_name=official_name,
            category=args.category,
            emails=emails,
            phones=phones,
            source_summary=source_summary
        )
        if created_flag:
            created += 1
        else:
            updated += 1

        actor_id = actor_row.get(ID_FIELD, "")
        append_source_row(
            actor_id=actor_id,
            field="discovery",
            value_excerpt=official_name,
            source_url=url,
            publisher=domain,
            source_type="seed_crawl",
            lang=args.locale,
            pub_date="",
            access_date=now_iso()
        )

    # Write back actors
    write_csv_rows(ACTORS_PATH, actors)

    print(json.dumps({
        "status":"ok",
        "actors_total": len(actors),
        "created": created,
        "updated": updated,
        "actors_path": ACTORS_PATH,
        "sources_path": SOURCES_PATH
    }))

if __name__ == "__main__":
    main()