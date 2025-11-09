from __future__ import annotations

import argparse
import json
import logging
import sys
from dataclasses import asdict
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

from .exceptions import CharityWatchError
from .scraper import CharityWatchScraper


def _parse_input_names(raw_names: Iterable[str]) -> List[Tuple[str, Dict[str, str]]]:
    """
    Parse user-provided names, supporting optional overrides.

    Each entry may be plain text (interpreted as the charity name) or
    ``Name|slug`` to force a specific CharityWatch slug when the heuristic
    slugifier is not sufficient.
    """

    parsed: List[Tuple[str, Dict[str, str]]] = []
    for raw in raw_names:
        entry = raw.strip()
        if not entry or entry.startswith("#"):
            continue
        if "|" in entry:
            name, slug = entry.split("|", 1)
            parsed.append((name.strip(), {"slug": slug.strip()}))
        else:
            parsed.append((entry, {}))
    return parsed


def configure_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(levelname)s: %(message)s",
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Fetch NGO ratings from CharityWatch and render them as a table or JSON."
    )
    parser.add_argument("names", nargs="*", help="NGO names (optionally 'Name|slug' to override the derived slug).")
    parser.add_argument(
        "-f",
        "--file",
        type=Path,
        help="File containing NGO names, one per line. Supports the same 'Name|slug' syntax.",
    )
    parser.add_argument("--no-proxy", action="store_true", help="Attempt to query CharityWatch directly (Cloudflare protected).")
    parser.add_argument("--timeout", type=int, default=20, help="HTTP timeout in seconds (default: 20).")
    parser.add_argument("--json", action="store_true", help="Output JSON instead of a table.")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging.")
    parser.add_argument(
        "--fail-fast",
        action="store_true",
        help="Stop processing after the first error instead of skipping missing charities.",
    )
    return parser


def _format_table(rows: List[Dict[str, str]]) -> str:
    if not rows:
        return "No data fetched."

    columns = ["Name", "Rating", "Program %", "Cost / $100", "Rating Date", "Profile URL"]
    row_values = [
        [
            row["name"],
            row.get("rating") or "-",
            row.get("program_percentage") or "-",
            row.get("cost_to_raise_100") or "-",
            row.get("rating_date") or "-",
            row["url"],
        ]
        for row in rows
    ]

    widths = [len(col) for col in columns]
    for row in row_values:
        for idx, value in enumerate(row):
            widths[idx] = max(widths[idx], len(value))

    def fmt_row(values: Iterable[str]) -> str:
        return "  ".join(value.ljust(widths[idx]) for idx, value in enumerate(values))

    lines = [fmt_row(columns), fmt_row("-" * w for w in widths)]
    lines.extend(fmt_row(row) for row in row_values)
    return "\n".join(lines)


def main(argv: Iterable[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    configure_logging(args.verbose)

    inputs: List[str] = list(args.names)

    if args.file:
        if not args.file.exists():
            parser.error(f"Input file not found: {args.file}")
        file_contents = args.file.read_text(encoding="utf-8").splitlines()
        inputs.extend(file_contents)

    parsed_inputs = _parse_input_names(inputs)
    if not parsed_inputs:
        parser.print_usage(sys.stderr)
        return 1

    scraper = CharityWatchScraper(use_proxy=not args.no_proxy, timeout=args.timeout)

    results: List[Dict[str, str]] = []
    for name, overrides in parsed_inputs:
        try:
            rating = scraper.fetch_rating(name, **overrides)
        except CharityWatchError as exc:
            logging.error("%s", exc)
            if args.fail_fast:
                return 2
            continue
        record = asdict(rating)
        record.pop("raw_source", None)
        results.append({k: str(v) if v is not None else None for k, v in record.items()})

    if not results:
        return 2

    if args.json:
        json.dump(results, sys.stdout, indent=2)
        sys.stdout.write("\n")
    else:
        print(_format_table(results))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
