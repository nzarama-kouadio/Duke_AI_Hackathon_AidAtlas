# AidAtlas Recommendation Service

FastAPI-powered service that delivers personalized conflict and organization recommendations for the AidAtlas application.

## Features (Planned)
- Hybrid collaborative + content-based scoring
- Real-time feature ingestion backed by Redis feature store
- Model experimentation and A/B testing hooks

## Project Structure
```
services/recommendation
  ├── app
  │   ├── core          # configuration, logging, dependencies
  │   ├── api           # FastAPI routers
  │   └── models        # future ML artifacts / schemas
  ├── tests             # pytest-based unit tests
  ├── pyproject.toml
  └── README.md
```

## Local Development
1. Install dependencies with Poetry:
   ```bash
   cd services/recommendation
   poetry install
   ```
2. Run the dev server:
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

## Environment Variables
- `REDIS_URL` – connection string for Redis feature store (default: `redis://localhost:6379/0`).
- `MODEL_REGISTRY_PATH` – S3 or local path for loading trained models.

## Next Steps
- Define schema for input events and recommendation responses.
- Implement cold-start quiz scoring.
- Integrate with event stream for behavioral signals.
