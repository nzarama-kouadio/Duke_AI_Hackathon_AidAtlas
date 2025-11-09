from __future__ import annotations

import logging
import re
from dataclasses import asdict
from typing import Dict, Optional

import requests

from .exceptions import CharityNotFoundError, CharityWatchError, CharityWatchParseError
from .models import CharityRating
from .utils import slugify

LOG = logging.getLogger(__name__)

JINA_PREFIX = "https://r.jina.ai/https://"
CHARITYWATCH_ROOT = "www.charitywatch.org/charities/"

RATING_DATE_RE = re.compile(r"CharityWatch rating issued\s+\*\*(.*?)\*\*", re.IGNORECASE | re.DOTALL)


def _extract_line_before(label: str, markdown: str) -> Optional[str]:
    """
    Locate the text line that precedes a bold label within the CharityWatch markdown.

    Each metric (e.g., rating, program percentage) appears as the line immediately
    before a ``**Label**`` marker. Lines that are empty, navigation links, or
    decorative strings are ignored.
    """

    marker = f"**{label}**"
    if marker not in markdown:
        return None

    prefix = markdown.split(marker, 1)[0]
    for raw_line in reversed(prefix.splitlines()):
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("[") or line.startswith("!["):
            continue
        if line.lower() == "save":
            continue
        return line
    return None


def _normalize_metric(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    cleaned = value.strip()
    if not cleaned:
        return None
    return cleaned


class CharityWatchScraper:
    """
    Retrieve CharityWatch ratings for one or more NGO names.

    By default the scraper uses the `r.jina.ai` read-only proxy to avoid
    Cloudflare challenges. This returns a markdown representation of the page,
    which is parsed for the metrics of interest.
    """

    def __init__(
        self,
        *,
        use_proxy: bool = True,
        session: Optional[requests.Session] = None,
        timeout: int = 20,
        extra_headers: Optional[Dict[str, str]] = None,
    ) -> None:
        self.use_proxy = use_proxy
        self.session = session or requests.Session()
        self.timeout = timeout
        self.extra_headers = extra_headers or {}

    def _build_url(self, slug: str) -> str:
        base = CHARITYWATCH_ROOT + slug
        if self.use_proxy:
            return JINA_PREFIX + base
        return "https://" + base

    def fetch_rating(self, name: str, *, slug: Optional[str] = None) -> CharityRating:
        """Fetch rating details for an NGO by name."""

        slug_value = slug or slugify(name)
        url = self._build_url(slug_value)
        LOG.debug("Fetching CharityWatch page", extra={"url": url, "name": name, "slug": slug_value})

        response = self.session.get(url, timeout=self.timeout, headers=self.extra_headers)
        text = response.text

        if response.status_code == 404 or "Markdown Content:\n404" in text or "Target URL returned error 404" in text:
            raise CharityNotFoundError(f"No CharityWatch profile found for '{name}' (slug='{slug_value}')")

        if response.status_code >= 400:
            raise CharityWatchError(
                f"Failed to fetch CharityWatch profile for '{name}' (status={response.status_code})"
            )

        rating_date = self._parse_rating_date(text)
        rating_value = _normalize_metric(_extract_line_before("CharityWatch Rating", text))
        program_percentage = _normalize_metric(_extract_line_before("Program Percentage", text))
        cost_to_raise = _normalize_metric(_extract_line_before("Cost to Raise $100", text))

        if all(metric is None for metric in (rating_value, program_percentage, cost_to_raise)):
            raise CharityWatchParseError(f"Could not locate ratings for '{name}'.")

        result = CharityRating(
            name=name,
            slug=slug_value,
            url=url if not self.use_proxy else f"https://{CHARITYWATCH_ROOT}{slug_value}",
            rating_date=rating_date,
            rating=rating_value,
            program_percentage=program_percentage,
            cost_to_raise_100=cost_to_raise,
            raw_source=text,
        )

        LOG.debug("Parsed CharityWatch rating", extra={"rating": asdict(result)})
        return result

    @staticmethod
    def _parse_rating_date(markdown: str) -> Optional[str]:
        match = RATING_DATE_RE.search(markdown)
        if not match:
            return None
        value = match.group(1).strip()
        # remove any lingering markdown link artifacts like []()
        value = re.sub(r"\[\]\(.*?\)", "", value).strip()
        return value or None
