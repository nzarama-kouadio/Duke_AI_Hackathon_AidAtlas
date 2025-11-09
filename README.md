# CharityWatch NGO Ratings Agent

This repository contains a small command-line agent that retrieves NGO ratings from [CharityWatch](https://www.charitywatch.org/). It automates pulling the public-grade, program percentage, and fundraising efficiency metrics for one or more organizations and renders the results as a table or JSON.

> **Note**  
> CharityWatch is protected by Cloudflare. To avoid the interactive challenge, the scraper defaults to querying the site through the public `r.jina.ai` read-only proxy, which serves the page as Markdown. If that proxy stops working or CharityWatch removes the page from public view, the agent will need to be updated or run with valid session cookies that can pass Cloudflare.

## Quick Start

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Fetch two charities by name
python -m charitywatch_agent "American Red Cross" "Doctors Without Borders USA"

# Emit JSON instead of a table
python -m charitywatch_agent --json "Save the Children"
```

### Input Source Options

- Positional arguments are treated as NGO names.  
- For names whose CharityWatch slug is non-trivial, you can override the slug with the `Name|slug` syntax:

  ```bash
  python -m charitywatch_agent "Catholic Charities USA (National Office)|catholic-charities-usa-national-office"
  ```

- Use `--file path/to/names.txt` to read one entry per line (the same syntax applies). Lines starting with `#` and blank lines are ignored.

### Additional Flags

- `--json` &mdash; output JSON instead of a formatted table.  
- `--no-proxy` &mdash; attempt to request CharityWatch directly (likely to be blocked by Cloudflare without valid cookies).  
- `--fail-fast` &mdash; stop on the first error instead of skipping missing charities.  
- `--timeout` &mdash; tweak the HTTP timeout (seconds).  
- `--verbose` &mdash; enable debug logging.

## Limitations & Caveats

- The CLI only extracts the high-level metrics that are visible without a CharityWatch membership. Detailed financials remain paywalled.  
- Reliance on the `r.jina.ai` proxy means we are at the mercy of that service’s availability and caching behaviour. For production use, consider hosting your own proxy or obtaining API/data access directly from CharityWatch.  
- CharityWatch page structures occasionally change. If parsing fails (e.g., all metrics return blank), inspect the page and update the parser in `charitywatch_agent/scraper.py`.  
- Always review CharityWatch’s Terms of Use before automating requests against their site.

## Project Structure

```
charitywatch_agent/
  __main__.py         # CLI entry point (python -m charitywatch_agent)
  scraper.py          # Fetching logic and Markdown parser
  models.py           # Dataclass representing the parsed result
  utils.py            # Helper utilities (slug heuristics, etc.)
  exceptions.py       # Custom exception types
requirements.txt      # Runtime dependency list (requests)
```

## Troubleshooting

- **All requests return 404**: Verify the slug. Use `Name|slug` or inspect the CharityWatch URL manually.  
- **Cloudflare block when using `--no-proxy`**: Acquire valid session cookies and provide them via environment configuration (e.g., modify the scraper to inject headers), or revert to the default proxy transport.  
- **Stale data**: The proxy caches aggressively. Append a query string such as `?t=TIMESTAMP` to force a refresh (modify `_build_url` accordingly).
