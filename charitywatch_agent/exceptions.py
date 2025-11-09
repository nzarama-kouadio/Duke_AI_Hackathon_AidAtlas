class CharityWatchError(RuntimeError):
    """Base exception for CharityWatch scraper errors."""


class CharityNotFoundError(CharityWatchError):
    """Raised when no CharityWatch profile can be located for the given name or slug."""


class CharityWatchParseError(CharityWatchError):
    """Raised when a CharityWatch profile is fetched but the expected metrics cannot be located."""
