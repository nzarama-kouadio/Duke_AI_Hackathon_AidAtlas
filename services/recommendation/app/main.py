from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.router import api_router
from .core.config import get_settings
from .core.logging import configure_logging, get_logger


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging()

    app = FastAPI(
        title="AidAtlas Recommendation API",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)

    logger = get_logger(__name__)

    @app.on_event("startup")
    async def on_startup() -> None:  # pragma: no cover - side effects only
        logger.info("Starting AidAtlas Recommendation API", extra={"env": settings.app.env})

    @app.on_event("shutdown")
    async def on_shutdown() -> None:  # pragma: no cover - side effects only
        logger.info("Shutting down AidAtlas Recommendation API")

    return app


app = create_app()
