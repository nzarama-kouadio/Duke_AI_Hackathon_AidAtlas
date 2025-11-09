from __future__ import annotations

import re
from typing import Iterable, Optional

_MULTISPACE_RE = re.compile(r"\s+")
_NON_ALNUM_RE = re.compile(r"[^a-z0-9]+")


def slugify(name: str) -> str:
    """
    Convert a charity name into the slug used by CharityWatch URLs.

    This is a best-effort heuristic: CharityWatch generally uses lower-case,
    hyphen-separated slugs with punctuation removed. Parenthetical qualifiers
    are also stripped.
    """

    cleaned = name.lower()
    cleaned = cleaned.replace("&", "and")
    cleaned = re.sub(r"[\(\)\[\]\{\}]", " ", cleaned)
    cleaned = _MULTISPACE_RE.sub(" ", cleaned)
    cleaned = _NON_ALNUM_RE.sub("-", cleaned)
    cleaned = cleaned.strip("-")
    cleaned = re.sub(r"-{2,}", "-", cleaned)
    return cleaned


def first_matching_line(lines: Iterable[str], pattern: re.Pattern[str]) -> Optional[str]:
    """Return the first line (searching from the end) that matches the regex."""

    for line in reversed([line.strip() for line in lines if line.strip()]):
        if pattern.match(line):
            return line
    return None
