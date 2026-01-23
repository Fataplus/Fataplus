#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Seed domain crawler for Madagascar agriculture stakeholders.

Purpose
- Crawl a small, bounded number of pages from specific seed domains (e.g., ministries, research institutes).
- Extract basic "page_signals" per URL:
  * url, title, emails, phones, links (same-domain only), text_size
- Output JSONL lines formatted so scripts/ingest_results.py can ingest them
  (it accepts page_signals-only records and will create/update actors accordingly).

Usage
  python scripts/seed_crawl.py \
    --seeds https://maep.gov.mg/ https://fofifa.mg/ https://bngrc.gov.mg/ \
    --max-pages 20 \
    --output logs/gov_seed.jsonl

Notes
- This crawler is conservative: no JS rendering, honors same-domain restriction, and uses polite delays.
- For larger/JS-heavy sites, switch to Hyperbrowser MCP when available.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from collections import deque
from dataclasses import dataclass, asdict
from typing import Dict, Iterable, List, Optional, Set, Tuple
from urllib.parse import urlparse, urljoin

import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    )
}
TIMEOUT = 25
DEFAULT_DELAY = 1.0  # seconds between requests


EMAIL_PATTERN = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_PATTERN = re.compile(r"(?:\+?\d{1,3}[\s.\-]?)?(?:\(?\d{2,4}\)?[\s.\-]?)?\d{3,4}[\s.\-]?\d{3,4}")


@dataclass
class PageSignals:
    url: str
    title: str
    emails: List[str]
    phones: List[str]
    links: List[str]
    text_size: int


def normalize_space(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip())


def domain_of(url: str) -> str:
    try:
        return urlparse(url).netloc.lower()
    except Exception:
        return ""


def is_same_domain(url: str, origin_domain: str) -> bool:
    d = domain_of(url)
    if not d:
        return False
    if d == origin_domain:
        return True
    # allow subdomains
    return d.endswith("." + origin_domain)


def absolute_link(base: str, link: str) -> str:
    try:
        return urljoin(base, link)
    except Exception:
        return link


def extract_emails(text: str) -> List[str]:
    return sorted(set(EMAIL_PATTERN.findall(text)))


def extract_phones(text: str) -> List[str]:
    """
    Madagascar-focused phone heuristic:
    - Skip year ranges like 2016-2022, 2025-2030
    - Require +261... or leading 0 (local)
    - Keep 9-12 digits after stripping non-digits
    """
    candidates = re.findall(r"(?:\+?\d[\d\s().-]{7,}\d)", text or "")
    out: List[str] = []
    year_range = re.compile(r"\b(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}\b")
    for m in candidates:
        s = normalize_space(m)
        if year_range.search(s):
            continue
        digits = re.sub(r"\D", "", s)
        if not (digits.startswith("261") or s.startswith("+261") or s.startswith("0")):
            continue
        if 9 <= len(digits) <= 12:
            out.append(s)
    return sorted(set(out))


def fetch(url: str) -> Optional[BeautifulSoup]:
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        return soup
    except Exception:
        return None


def scrape_page(url: str) -> PageSignals:
    title = ""
    text = ""
    links: List[str] = []
    soup = fetch(url)
    if soup:
        title_tag = soup.find("title")
        title = normalize_space(title_tag.get_text()) if title_tag else ""
        for s in soup(["script", "style", "noscript"]):
            s.decompose()
        text = normalize_space(soup.get_text(separator=" "))
        links = sorted(
            set(a.get("href") for a in soup.find_all("a", href=True) if a.get("href"))
        )
    emails = extract_emails(text)
    phones = extract_phones(text)
    return PageSignals(
        url=url,
        title=title,
        emails=emails,
        phones=phones,
        links=links,
        text_size=len(text),
    )


def crawl_seed(seed_url: str, max_pages: int, delay: float) -> Iterable[PageSignals]:
    origin_domain = domain_of(seed_url)
    if not origin_domain:
        return

    seen: Set[str] = set()
    q: deque[str] = deque()
    q.append(seed_url)

    while q and len(seen) < max_pages:
        url = q.popleft()
        if url in seen:
            continue
        seen.add(url)

        sig = scrape_page(url)
        yield sig
        time.sleep(delay)

        # Enqueue same-domain links
        # Only a light normalization for anchors and javascript:void links
        for href in sig.links:
            if href.startswith("#"):
                continue
            if href.startswith("javascript:"):
                continue
            abs_url = absolute_link(url, href)
            if is_same_domain(abs_url, origin_domain) and abs_url not in seen:
                q.append(abs_url)


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Seed domain crawler")
    p.add_argument("--seeds", nargs="+", required=True, help="Seed URLs to crawl")
    p.add_argument("--max-pages", type=int, default=20, help="Max pages per seed domain")
    p.add_argument("--delay", type=float, default=DEFAULT_DELAY, help="Delay between requests (seconds)")
    p.add_argument("--output", type=str, required=True, help="Output JSONL path")
    return p


def main() -> None:
    ap = build_parser()
    args = ap.parse_args()

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as out:
        for seed in args.seeds:
            for sig in crawl_seed(seed, args.max_pages, args.delay):
                # Emit as page_signals envelope so ingest_results.py can parse it
                rec = {"page_signals": asdict(sig)}
                out.write(json.dumps(rec, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()