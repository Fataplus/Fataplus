#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Search and scrape utility for Madagascar agriculture stakeholders discovery.

Features:
- Reproducible queries against multiple engines (Bing, DuckDuckGo).
- Logs exact queries and results summary to logs/queries.csv.
- Extracts result links (URL, title, snippet).
- Optional simple scrape of landing pages for basic signals (emails, phones).
- Stop-rule scaffolding: track novel domains rate to decide when to stop.

Usage:
  python scripts/search_scrape.py \
      --category "Government institutions" \
      --queries "site:.gov.mg agriculture Madagascar" \
      --engine bing ddg \
      --limit 20 \
      --delay 2 \
      --locale fr

Outputs:
- Console: JSON lines of result entries (engine, query, url, title, snippet).
- File: logs/queries.csv rows appended with query metadata.

Note:
- This script is intentionally conservative (no JavaScript rendering).
- For complex pages, use the Hyperbrowser MCP tools separately when needed.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Dict, Iterable, List, Optional, Set, Tuple
from urllib.parse import quote, urlparse, parse_qs, unquote

import requests
from bs4 import BeautifulSoup


# ---------- Config ----------

WORKDIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LOGS_DIR = os.path.join(WORKDIR, "logs")
DATA_DIR = os.path.join(WORKDIR, "data")

QUERIES_CSV_PATH = os.path.join(LOGS_DIR, "queries.csv")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    )
}
TIMEOUT = 25


# ---------- Data models ----------

@dataclass
class SearchResult:
    engine: str
    query: str
    url: str
    title: str
    snippet: str
    rank: int


@dataclass
class PageSignals:
    url: str
    title: str
    emails: List[str]
    phones: List[str]
    links: List[str]
    text_size: int


# ---------- Utilities ----------

def ensure_dirs() -> None:
    os.makedirs(LOGS_DIR, exist_ok=True)
    os.makedirs(DATA_DIR, exist_ok=True)


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def normalize_space(s: str) -> str:
    return re.sub(r"\s+", " ", s or "").strip()


def extract_emails(text: str) -> List[str]:
    pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
    return sorted(set(re.findall(pattern, text)))


def extract_phones(text: str) -> List[str]:
    """
    Heuristic Madagascar-focused phone extractor.
    - Avoids year ranges like 2016-2022
    - Requires +261... or leading 0 for local format
    - Length between 9 and 12 digits after stripping
    """
    # Broad candidate capture
    candidates = re.findall(r"(?:\+?\d[\d\s().-]{7,}\d)", text or "")
    out: List[str] = []
    year_range = re.compile(r"\b(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}\b")
    for m in candidates:
        s = normalize_space(m)
        # Drop obvious year ranges
        if year_range.search(s):
            continue
        digits = re.sub(r"\D", "", s)
        # Require plausible MG number: +261... or leading 0, length 9-12 digits
        if not (digits.startswith("261") or s.startswith("+261") or s.startswith("0")):
            continue
        if 9 <= len(digits) <= 12:
            out.append(s)
    return sorted(set(out))


def domain_of(url: str) -> str:
    try:
        return urlparse(url).netloc.lower()
    except Exception:
        return ""

def resolve_search_redirect(url: str) -> str:
    """
    Normalize search engine redirect URLs to their final targets.
    - Bing: https://www.bing.com/ck/a?...&u=<encoded_target>
    - DuckDuckGo: https://duckduckgo.com/l/?uddg=<encoded_target>
    """
    try:
        u = url or ""
        parsed = urlparse(u)
        host = parsed.netloc.lower()
        if "bing.com" in host and parsed.path.startswith("/ck/a"):
            qs = parse_qs(parsed.query)
            target = qs.get("u", [""])[0]
            return unquote(target) or u
        if "duckduckgo.com" in host and parsed.path.startswith("/l"):
            qs = parse_qs(parsed.query)
            target = qs.get("uddg", [""])[0]
            return unquote(target) or u
        return u
    except Exception:
        return url or ""


def site_matches(domain: str, site_token: str) -> bool:
    """
    Check if domain matches a site: token.
    - 'site:.gov.mg' means domain endswith 'gov.mg'
    - 'site:minae.gov.mg' means domain == 'minae.gov.mg' or endswith '.minae.gov.mg'
    """
    d = (domain or "").lower()
    s = (site_token or "").lower()
    d = re.sub(r"^www\.", "", d)
    s = re.sub(r"^www\.", "", s)
    if s.startswith("."):
        return d.endswith(s.lstrip("."))
    return d == s or d.endswith("." + s)


def parse_site_domains(query: str) -> List[str]:
    """
    Extract site: tokens from the query. Supports multiple tokens and OR-separated patterns.
    Example: 'site:minae.gov.mg OR site:maep.gov.mg programme agriculture'
    """
    tokens = re.findall(r"site:([^\s]+)", query)
    out: List[str] = []
    for t in tokens:
        t = t.strip().strip(")]},;")
        if t:
            out.append(t)
    return out

def write_query_log_row(
    engine: str,
    locale: str,
    query: str,
    category: str,
    new_actors_found: int = 0,
    unique_actors_total: int = 0,
    stop_rule_triggered: bool = False,
) -> None:
    ensure_dirs()
    file_exists = os.path.isfile(QUERIES_CSV_PATH)
    with open(QUERIES_CSV_PATH, "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if not file_exists:
            w.writerow(
                [
                    "timestamp",
                    "engine",
                    "locale",
                    "query",
                    "category",
                    "new_actors_found",
                    "unique_actors_total",
                    "stop_rule_triggered",
                ]
            )
        w.writerow(
            [
                now_iso(),
                engine,
                locale,
                query,
                category,
                new_actors_found,
                unique_actors_total,
                "TRUE" if stop_rule_triggered else "FALSE",
            ]
        )


# ---------- Search engines ----------

def search_bing(query: str, limit: int = 20, delay: float = 1.5) -> List[SearchResult]:
    """Scrape Bing HTML results page (no API)."""
    results: List[SearchResult] = []
    q = quote(query)
    url = f"https://www.bing.com/search?q={q}&count={min(limit,50)}"
    r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")

    # Enforce site: filters if present and resolve redirect links
    site_tokens = parse_site_domains(query)

    rank = 0
    for li in soup.select("li.b_algo"):
        a = li.select_one("h2 a")
        if not a or not a.get("href"):
            continue
        title = normalize_space(a.get_text())
        href_raw = a.get("href")
        href = resolve_search_redirect(href_raw)

        # Keep only results matching site: filters (e.g., .gov.mg)
        if site_tokens:
            dom = domain_of(href)
            if not any(site_matches(dom, t) for t in site_tokens):
                continue

        # Try to get snippet
        snippet_tag = li.select_one("div.b_caption p")
        snippet = normalize_space(snippet_tag.get_text()) if snippet_tag else ""
        rank += 1
        results.append(
            SearchResult(engine="bing", query=query, url=href, title=title, snippet=snippet, rank=rank)
        )
        if len(results) >= limit:
            break

    time.sleep(delay)
    return results


def search_duckduckgo(query: str, limit: int = 20, delay: float = 1.5) -> List[SearchResult]:
    """Scrape DuckDuckGo HTML results page (no API)."""
    results: List[SearchResult] = []
    q = quote(query)
    url = f"https://duckduckgo.com/html/?q={q}"
    r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")

    site_tokens = parse_site_domains(query)

    rank = 0
    for res in soup.select("div.result"):
        a = res.select_one("a.result__a")
        if not a or not a.get("href"):
            continue
        title = normalize_space(a.get_text())
        href_raw = a.get("href")
        href = resolve_search_redirect(href_raw)

        if site_tokens:
            dom = domain_of(href)
            if not any(site_matches(dom, t) for t in site_tokens):
                continue

        # snippet
        snippet_tag = res.select_one("a.result__snippet")
        snippet = normalize_space(snippet_tag.get_text()) if snippet_tag else ""
        rank += 1
        results.append(
            SearchResult(engine="ddg", query=query, url=href, title=title, snippet=snippet, rank=rank)
        )
        if len(results) >= limit:
            break

    time.sleep(delay)
    return results


ENGINE_FUNCS = {
    "bing": search_bing,
    "ddg": search_duckduckgo,
}


# ---------- Scrape page ----------

def scrape_page(url: str) -> PageSignals:
    title = ""
    text = ""
    links: List[str] = []
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        title_tag = soup.find("title")
        title = normalize_space(title_tag.get_text()) if title_tag else ""
        # Extract text conservatively
        for s in soup(["script", "style", "noscript"]):
            s.decompose()
        text = normalize_space(soup.get_text(separator=" "))
        links = sorted(
            set(a.get("href") for a in soup.find_all("a", href=True) if a.get("href"))
        )
    except Exception as e:
        # Non-fatal; return partial signals
        title = title or ""
        text = text or ""
        links = links or []

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


# ---------- Stop rule tracking ----------

class StopRuleTracker:
    """
    Track novel domains rate over last N queries.
    Stop when the rate of new unique actors discovered falls below threshold.
    Here we approximate "actors" with distinct result domains for scaffolding.
    """

    def __init__(self, window: int = 10, min_rate: float = 0.02) -> None:
        self.window = window
        self.min_rate = min_rate
        self.history_new_counts: List[int] = []
        self.seen_domains: Set[str] = set()
        self.successive_no_novel: int = 0

    def update(self, urls: Iterable[str]) -> Tuple[int, int, float, bool]:
        new_count = 0
        for u in urls:
            d = domain_of(u)
            if d and d not in self.seen_domains:
                self.seen_domains.add(d)
                new_count += 1

        self.history_new_counts.append(new_count)
        if len(self.history_new_counts) > self.window:
            self.history_new_counts.pop(0)

        rate = (
            (sum(self.history_new_counts) / max(1, sum(self.history_new_counts) + len(self.history_new_counts)))
            if self.history_new_counts
            else 0.0
        )

        if new_count == 0:
            self.successive_no_novel += 1
        else:
            self.successive_no_novel = 0

        stop_due_rate = False
        if len(self.history_new_counts) >= self.window:
            # Define "rate of new unique actors in last N queries"
            avg_new = sum(self.history_new_counts) / float(self.window)
            stop_due_rate = (avg_new < self.min_rate)

        stop_due_no_novel = self.successive_no_novel >= self.window
        should_stop = stop_due_rate or stop_due_no_novel

        return new_count, len(self.seen_domains), rate, should_stop


# ---------- CLI ----------

DEFAULT_CATEGORY_QUERIES = {
    "Government institutions": [
        "site:.gov.mg agriculture Madagascar",
        "site:gouv.mg agriculture Madagascar",
        "site:minae.gov.mg OR site:maep.gov.mg programme agriculture",
        "filetype:pdf Madagascar agriculture rapport annuel site:.gov.mg",
    ],
    "Donors and IFIs": [
        "site:fao.org Madagascar agriculture project",
        "site:ifad.org Madagascar project agriculture",
        "site:worldbank.org Madagascar agriculture",
        "site:usaid.gov Madagascar agriculture",
        "site:afd.fr Madagascar agriculture",
        "site:giz.de Madagascar agriculture",
        "site:europa.eu Madagascar agriculture fund",
    ],
    "Cooperatives": [
        "coopérative agricole Madagascar",
        "union coopérative agricole Madagascar",
    ],
    "Private agribusiness": [
        "Madagascar seed company",
        "Madagascar fertilizer distributor",
        "Madagascar food processing company",
        "Madagascar agricultural export company vanilla OR cloves OR rice OR cacao OR coffee",
    ],
    "Academia": [
        "site:.edu OR site:.mg université agriculture Madagascar",
        "centre de recherche agriculture Madagascar",
    ],
}


def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Search and scrape discovery tool")
    p.add_argument("--category", type=str, required=True, help="Category label for logging")
    p.add_argument(
        "--queries",
        type=str,
        nargs="*",
        help="Explicit queries (override defaults). If empty, defaults are used for known categories.",
    )
    p.add_argument("--engine", type=str, nargs="*", default=["bing", "ddg"], choices=list(ENGINE_FUNCS.keys()))
    p.add_argument("--limit", type=int, default=20, help="Max results per query per engine (HTML scraping)")
    p.add_argument("--delay", type=float, default=1.5, help="Delay between engine requests (seconds)")
    p.add_argument("--locale", type=str, default="fr", help="Locale tag for logging (fr|en|mg)")
    p.add_argument("--scrape", action="store_true", help="Scrape each result page for basic signals")
    p.add_argument("--stop-window", type=int, default=10, help="Stop rule window size (queries)")
    p.add_argument("--stop-min-rate", type=float, default=0.02, help="Minimum novel rate threshold")
    return p


def iter_queries(category: str, queries_arg: Optional[List[str]]) -> List[str]:
    if queries_arg:
        return [q for q in queries_arg if q.strip()]
    if category in DEFAULT_CATEGORY_QUERIES:
        return DEFAULT_CATEGORY_QUERIES[category]
    # Fallback: single generic query
    return [f"Madagascar agriculture {category}"]


def main() -> None:
    args = build_arg_parser().parse_args()
    ensure_dirs()

    tracker = StopRuleTracker(window=args.stop_window, min_rate=args.stop_min_rate)

    engines = [e.lower() for e in args.engine]
    for e in engines:
        if e not in ENGINE_FUNCS:
            print(json.dumps({"error": f"Unknown engine: {e}"}), file=sys.stderr)
            sys.exit(2)

    all_queries = iter_queries(args.category, args.queries)

    query_counter = 0
    for q in all_queries:
        for eng in engines:
            fn = ENGINE_FUNCS[eng]
            # Execute search
            try:
                results = fn(q, limit=args.limit, delay=args.delay)
            except Exception as ex:
                # Log failure line with zero new actors
                write_query_log_row(
                    engine=eng,
                    locale=args.locale,
                    query=q,
                    category=args.category,
                    new_actors_found=0,
                    unique_actors_total=len(tracker.seen_domains),
                    stop_rule_triggered=False,
                )
                print(json.dumps({"engine": eng, "query": q, "error": str(ex)}))
                continue

            # Emit JSON lines for results
            for r in results:
                print(json.dumps(asdict(r), ensure_ascii=False))

            # Update stop-rule based on novel domains in this result set
            new_count, total_unique, rate, should_stop = tracker.update([r.url for r in results])

            # Optionally scrape basic signals per result
            if args.scrape:
                for r in results:
                    sig = scrape_page(r.url)
                    out = {
                        "engine": eng,
                        "query": q,
                        "page_signals": asdict(sig),
                    }
                    print(json.dumps(out, ensure_ascii=False))

            # Append to queries log
            write_query_log_row(
                engine=eng,
                locale=args.locale,
                query=q,
                category=args.category,
                new_actors_found=new_count,
                unique_actors_total=total_unique,
                stop_rule_triggered=should_stop,
            )

            query_counter += 1

            # Stop rule check after each engine-query pair
            if should_stop:
                # Print a control line (machine-readable)
                print(
                    json.dumps(
                        {
                            "control": "stop_rule_triggered",
                            "engine": eng,
                            "query": q,
                            "window": args.stop_window,
                            "min_rate": args.stop_min_rate,
                            "new_in_last_window": sum(tracker.history_new_counts),
                            "unique_domains_total": total_unique,
                        }
                    )
                )
                return

    # End marker
    print(json.dumps({"control": "done", "queries_executed": query_counter}))


if __name__ == "__main__":
    main()