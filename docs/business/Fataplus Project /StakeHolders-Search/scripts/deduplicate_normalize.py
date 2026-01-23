#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Deduplicate and normalize data/actors.csv into a clean, merged dataset.

What it does
- Normalizes names (case-fold, remove accents, strip punctuation, collapse spaces)
- Canonicalizes websites to bare domains (drops scheme and www.)
- Detects duplicates through a multi-signal union:
  1) Same website domain OR any shared email OR any shared phone
  2) Fuzzy name similarity (difflib ratio) above threshold within same country
- Merges grouped records:
  - Prefer non-empty scalar values
  - Union list-like fields (pipe-separated)
  - Combine notes and source summaries
  - Recompute source_count as numeric sum when possible
  - Generate a stable actor_id if missing
- Writes the output CSV and emits a JSONL merge report describing groups and chosen values

Usage
  python scripts/deduplicate_normalize.py \
    --input data/actors.csv \
    --output data/actors_deduped.csv \
    --report logs/dedup_report.jsonl \
    --threshold 0.90

Notes
- Only stdlib is required (csv, difflib). No pandas dependency.
- Fuzzy name matching is blocked by country and first-letter bucket to reduce O(n^2).
"""

from __future__ import annotations

import argparse
import csv
import difflib
import json
import os
import re
import sys
import unicodedata
from collections import defaultdict
from dataclasses import dataclass, asdict
from hashlib import sha1
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.parse import urlparse


# ---------------- Schema ----------------

LIST_FIELDS = {"segments", "commodities", "social_links"}
PIPE_SEP = "|"

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


# ---------------- Utilities ----------------

def strip_accents(s: str) -> str:
    if s is None:
        return ""
    return "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))


def normalize_space(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip())


def normalize_name(name: str) -> str:
    s = normalize_space(name)
    s = strip_accents(s).lower()
    s = re.sub(r"[^\w\s]", " ", s)  # remove punctuation
    s = normalize_space(s)
    return s


def to_domain(url: str) -> str:
    if not url:
        return ""
    try:
        u = url.strip()
        if not (u.startswith("http://") or u.startswith("https://")):
            u = "http://" + u
        netloc = urlparse(u).netloc.lower()
        # drop www.
        netloc = re.sub(r"^www\.", "", netloc)
        return netloc
    except Exception:
        return ""


def split_pipe(s: str) -> List[str]:
    if not s:
        return []
    items = [normalize_space(x) for x in s.split(PIPE_SEP)]
    return [x for x in items if x]


def join_pipe(values: Iterable[str]) -> str:
    uniq: List[str] = []
    seen = set()
    for v in values:
        vv = normalize_space(v)
        if vv and vv not in seen:
            seen.add(vv)
            uniq.append(vv)
    return PIPE_SEP.join(uniq)


def ratio(a: str, b: str) -> float:
    return difflib.SequenceMatcher(None, a, b).ratio()


def slugify_name(name: str) -> str:
    base = normalize_name(name)
    base = re.sub(r"\s+", "-", base)
    base = re.sub(r"[^a-z0-9\-]", "", base)
    base = re.sub(r"-{2,}", "-", base).strip("-")
    return base or "entity"


def stable_id(name: str, website_domain: str) -> str:
    """
    Generates a stable ID based on normalized name and website domain.
    """
    slug = slugify_name(name)
    digest = sha1(f"{slug}|{website_domain}".encode("utf-8")).hexdigest()[:10]
    return f"{slug}-{digest}"


# ---------------- Data model ----------------

@dataclass
class Record:
    raw: Dict[str, str]
    id: str
    name_norm: str
    website_domain: str
    emails: List[str]
    phones: List[str]
    country: str
    name_first_letter: str


def parse_record(row: Dict[str, str]) -> Record:
    rid = row.get(ID_FIELD, "").strip()
    name = row.get("official_name", "")
    name_norm = normalize_name(name)
    website_domain = to_domain(row.get("website", ""))
    emails = split_pipe(row.get("email", ""))
    phones = split_pipe(row.get("phone", ""))
    country = normalize_space(row.get("country", "")).lower()
    first_letter = name_norm[:1] if name_norm else ""
    return Record(
        raw=row,
        id=rid or "",
        name_norm=name_norm,
        website_domain=website_domain,
        emails=emails,
        phones=phones,
        country=country,
        name_first_letter=first_letter,
    )


def read_csv(path: str) -> List[Dict[str, str]]:
    rows: List[Dict[str, str]] = []
    if not os.path.isfile(path):
        return rows
    with open(path, "r", encoding="utf-8") as f:
        r = csv.DictReader(f)
        for row in r:
            # Ensure all expected keys exist
            for k in [ID_FIELD] + KEY_FIELDS:
                row.setdefault(k, "")
            rows.append(row)
    return rows


def write_csv(path: str, rows: List[Dict[str, str]]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fieldnames = [ID_FIELD] + KEY_FIELDS
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for row in rows:
            filtered = {k: row.get(k, "") for k in fieldnames}
            w.writerow(filtered)


def merge_values(a: str, b: str, field: str) -> str:
    if field in LIST_FIELDS:
        return join_pipe(split_pipe(a) + split_pipe(b))
    # Prefer non-empty scalar
    return a if a else b


def sum_source_count(values: List[str]) -> str:
    total = 0
    any_non_int = False
    for v in values:
        v = normalize_space(v)
        if not v:
            continue
        try:
            total += int(v)
        except ValueError:
            any_non_int = True
    if any_non_int and total == 0:
        # fallback: pick max numeric-like or keep first non-empty
        for v in values:
            if v:
                return v
    return str(total) if total else ""


def merge_rows(rows: List[Dict[str, str]]) -> Dict[str, str]:
    if not rows:
        return {}
    out = dict(rows[0])
    for row in rows[1:]:
        for k in [ID_FIELD] + KEY_FIELDS:
            out[k] = merge_values(out.get(k, ""), row.get(k, ""), k)

    # Recompute source_count
    out["source_count"] = sum_source_count([r.get("source_count", "") for r in rows])

    # Combine notes and source_summary more explicitly
    out["notes"] = join_pipe([r.get("notes", "") for r in rows if r.get("notes", "")])
    out["source_summary"] = join_pipe([r.get("source_summary", "") for r in rows if r.get("source_summary", "")])

    # Actor ID: ensure present
    if not normalize_space(out.get(ID_FIELD, "")):
        name = out.get("official_name", "") or out.get("website", "") or "entity"
        website_domain = to_domain(out.get("website", ""))
        out[ID_FIELD] = stable_id(name, website_domain)

    # Ensure list fields are normalized once
    for lf in LIST_FIELDS:
        out[lf] = join_pipe(split_pipe(out.get(lf, "")))

    # Normalize website to canonical domain form if only domain is present
    dom = to_domain(out.get("website", ""))
    if dom and not out.get("website", "").startswith(("http://", "https://")):
        out["website"] = dom

    return out


# ---------------- Union-Find for grouping ----------------

class UnionFind:
    def __init__(self, n: int) -> None:
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x: int) -> int:
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a: int, b: int) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        if self.rank[ra] < self.rank[rb]:
            self.parent[ra] = rb
        elif self.rank[ra] > self.rank[rb]:
            self.parent[rb] = ra
        else:
            self.parent[rb] = ra
            self.rank[ra] += 1


# ---------------- Duplicate detection ----------------

def group_duplicates(records: List[Record], threshold: float, report_fp) -> List[List[int]]:
    n = len(records)
    uf = UnionFind(n)

    # 1) Strong keys: website domain, emails, phones
    domain_index: Dict[str, List[int]] = defaultdict(list)
    email_index: Dict[str, List[int]] = defaultdict(list)
    phone_index: Dict[str, List[int]] = defaultdict(list)

    for i, r in enumerate(records):
        if r.website_domain:
            domain_index[r.website_domain].append(i)
        for e in r.emails:
            email_index[e.lower()].append(i)
        for p in r.phones:
            phone_index[p].append(i)

    def chain_union(buckets: Dict[str, List[int]], label: str):
        for key, idxs in buckets.items():
            if len(idxs) > 1:
                head = idxs[0]
                for j in idxs[1:]:
                    uf.union(head, j)
                _emit_report_group_link(report_fp, "strong_key", label, key, idxs)

    chain_union(domain_index, "website_domain")
    chain_union(email_index, "email")
    chain_union(phone_index, "phone")

    # 2) Fuzzy by name within same country and first letter bucket
    country_buckets: Dict[Tuple[str, str], List[int]] = defaultdict(list)
    for i, r in enumerate(records):
        bucket_key = (r.country, r.name_first_letter)
        country_buckets[bucket_key].append(i)

    for bucket, idxs in country_buckets.items():
        m = len(idxs)
        if m < 2:
            continue
        # pairwise compare with blocking
        for a_idx in range(m):
            i = idxs[a_idx]
            ai = records[i]
            for b_idx in range(a_idx + 1, m):
                j = idxs[b_idx]
                aj = records[j]
                if not ai.name_norm or not aj.name_norm:
                    continue
                sim = ratio(ai.name_norm, aj.name_norm)
                if sim >= threshold:
                    uf.union(i, j)
                    _emit_report_pair(report_fp, "fuzzy_name", i, j, float(sim), bucket)

    # Build groups by parent
    groups_map: Dict[int, List[int]] = defaultdict(list)
    for i in range(n):
        groups_map[uf.find(i)].append(i)

    # Sort inner lists and return only groups with at least 1 member
    groups = [sorted(v) for v in groups_map.values()]
    groups.sort(key=lambda g: (len(g), g[0]))
    return groups


def _emit_report_group_link(fp, kind: str, label: str, key: str, idxs: List[int]) -> None:
    if fp is None:
        return
    fp.write(json.dumps({
        "type": "group_link",
        "kind": kind,
        "label": label,
        "key": key,
        "members": idxs,
    }, ensure_ascii=False) + "\n")


def _emit_report_pair(fp, kind: str, i: int, j: int, score: float, bucket) -> None:
    if fp is None:
        return
    fp.write(json.dumps({
        "type": "pair_link",
        "kind": kind,
        "i": i,
        "j": j,
        "score": score,
        "bucket": list(bucket) if isinstance(bucket, tuple) else bucket,
    }, ensure_ascii=False) + "\n")


# ---------------- Main pipeline ----------------

def deduplicate(input_path: str, output_path: str, report_path: Optional[str], threshold: float) -> Tuple[int, int]:
    rows = read_csv(input_path)
    if not rows:
        # Still create an empty output with header for consistency
        write_csv(output_path, [])
        return (0, 0)

    records = [parse_record(r) for r in rows]

    report_fp = open(report_path, "w", encoding="utf-8") if report_path else None
    try:
        groups = group_duplicates(records, threshold, report_fp)

        merged_rows: List[Dict[str, str]] = []
        # also record which indices merged for traceability
        for g in groups:
            members = [rows[i] for i in g]
            merged = merge_rows(members)
            merged_rows.append(merged)
            if report_fp:
                report_fp.write(json.dumps({
                    "type": "group_merge",
                    "members": g,
                    "merged_actor_id": merged.get(ID_FIELD, ""),
                    "official_names": [rows[i].get("official_name", "") for i in g],
                    "websites": [rows[i].get("website", "") for i in g],
                    "emails": [rows[i].get("email", "") for i in g],
                    "phones": [rows[i].get("phone", "") for i in g],
                }, ensure_ascii=False) + "\n")

        # Write output
        write_csv(output_path, merged_rows)
        return (len(rows), len(merged_rows))
    finally:
        if report_fp:
            report_fp.close()


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Deduplicate and normalize actors.csv")
    p.add_argument("--input", type=str, default="data/actors.csv", help="Input CSV path")
    p.add_argument("--output", type=str, default="data/actors_deduped.csv", help="Output CSV path")
    p.add_argument("--report", type=str, default="logs/dedup_report.jsonl", help="Merge report JSONL path")
    p.add_argument("--threshold", type=float, default=0.90, help="Fuzzy name ratio threshold (0..1)")
    return p


def main() -> None:
    args = build_parser().parse_args()
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    os.makedirs(os.path.dirname(args.report), exist_ok=True) if args.report else None

    before, after = deduplicate(args.input, args.output, args.report, args.threshold)
    print(json.dumps({
        "status": "ok",
        "input_rows": before,
        "output_rows": after,
        "reduction": before - after,
        "output": args.output,
        "report": args.report
    }))


if __name__ == "__main__":
    main()
