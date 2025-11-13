#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Clean/filter actors.csv by domain and category heuristics.

Goal
- Remove obvious noise from discovery (e.g., search engine redirect hosts, travel forums)
- Keep .mg government/research domains for Government institutions batch
- Provide configurable allow/deny lists

Usage
  python scripts/clean_filter.py \
    --input data/actors.csv \
    --output data/actors_clean.csv \
    --category "Government institutions"

Notes
- Conservative defaults; extend ALLOWLIST/DENYLIST as the project evolves
"""

from __future__ import annotations

import argparse
import csv
import os
import re
from urllib.parse import urlparse


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

# Hosts that should never appear as website domains for entities
DENYLIST_HOSTS = {
    "bing.com",
    "google.com",
    "googleusercontent.com",
    "routard.com",
    "tripadvisor.com",
    "facebook.com",
    "m.facebook.com",
    "twitter.com",
    "x.com",
    "instagram.com",
    "youtube.com",
    "linkedin.com",
    "en.wikipedia.org",
    "wikipedia.org",
    "medium.com",
    "blogspot.com",
    "wordpress.com",
}

# Regexes to detect obvious non-entity titles (tune over time)
TITLE_DENY_REGEX = re.compile(
    r"(voyage|travel|forum|guide|routard|itin[é|e]raire|photos|vacances|tourisme)",
    flags=re.IGNORECASE,
)

# For government institutions, prefer .mg domains and known gov/research suffixes
ALLOWED_MG_SUFFIXES_FOR_GOV = (
    ".gov.mg",
    ".gouv.mg",
    ".mg",  # broad, still useful (e.g., instat.mg, fofifa.mg, onn.mg)
)

def to_domain(website: str) -> str:
    if not website:
        return ""
    w = website.strip()
    if not (w.startswith("http://") or w.startswith("https://")):
        w = "http://" + w
    try:
        host = urlparse(w).netloc.lower()
        host = re.sub(r"^www\.", "", host)
        return host
    except Exception:
        return ""

def read_csv(path: str):
    rows = []
    if not os.path.isfile(path):
        return rows
    with open(path, "r", encoding="utf-8") as f:
        r = csv.DictReader(f)
        for row in r:
            for k in [ID_FIELD] + KEY_FIELDS:
                row.setdefault(k, "")
            rows.append(row)
    return rows

def write_csv(path: str, rows):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fieldnames = [ID_FIELD] + KEY_FIELDS
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for row in rows:
            w.writerow({k: row.get(k, "") for k in fieldnames})

def keep_row_for_government(row: dict) -> bool:
    """
    Heuristics:
    - website domain must not be in DENYLIST
    - official_name should not match TITLE_DENY_REGEX
    - if website present, prefer .mg; allow empty website if name clearly governmental? (we keep empty for now)
    """
    title = (row.get("official_name") or "").strip()
    if TITLE_DENY_REGEX.search(title or ""):
        return False

    dom = to_domain(row.get("website", ""))

    if dom and dom in DENYLIST_HOSTS:
        return False

    # If domain exists, require it to end with one of the allowed .mg suffixes for gov/research
    if dom and not dom.endswith(ALLOWED_MG_SUFFIXES_FOR_GOV):
        # allow some special .mg hosts that are clearly gov/research (explicit allowlist can be added here)
        special_ok = dom in {
            "instat.mg",
            "fofifa.mg",
            "onn.mg",
            "bngrc.gov.mg",
            "maep.gov.mg",
            "maep.mg",
            "minae.gov.mg",
        }
        if not special_ok:
            return False

    return True

def filter_rows(rows, category: str):
    kept = []
    dropped = []
    for row in rows:
        cat = (row.get("category") or "").strip()
        if category and cat and cat.lower() != category.lower():
            # Keep other categories untouched by this pass
            kept.append(row)
            continue

        # Category is government (or unspecified)
        if keep_row_for_government(row):
            kept.append(row)
        else:
            dropped.append(row)
    return kept, dropped

def main():
    ap = argparse.ArgumentParser(description="Clean/filter actors by category/domain heuristics")
    ap.add_argument("--input", type=str, default="data/actors.csv")
    ap.add_argument("--output", type=str, default="data/actors_clean.csv")
    ap.add_argument("--category", type=str, default="Government institutions")
    args = ap.parse_args()

    rows = read_csv(args.input)
    kept, dropped = filter_rows(rows, args.category)
    write_csv(args.output, kept)

    # Simple stats to stdout
    print({
        "status": "ok",
        "input_rows": len(rows),
        "kept": len(kept),
        "dropped": len(dropped),
        "output": args.output,
        "category_filtered": args.category,
    })

if __name__ == "__main__":
    main()