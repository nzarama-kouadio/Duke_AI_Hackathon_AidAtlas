"""
Utilities for retrieving NGO ratings from CharityWatch.

The main entrypoint is :class:`charitywatch_agent.scraper.CharityWatchScraper`.
"""

from .models import CharityRating  # noqa: F401
from .scraper import CharityWatchScraper  # noqa: F401
