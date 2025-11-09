from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass(slots=True)
class CharityRating:
    """Normalized CharityWatch rating details for a single organization."""

    name: str
    slug: str
    url: str
    rating_date: Optional[str]
    rating: Optional[str]
    program_percentage: Optional[str]
    cost_to_raise_100: Optional[str]
    raw_source: str
