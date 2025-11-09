from fastapi import APIRouter

from . import recommendations

router = APIRouter()
router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
