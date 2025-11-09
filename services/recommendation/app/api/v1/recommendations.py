from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from ...core.config import Settings, get_settings

router = APIRouter()


class RecommendationReason(BaseModel):
    label: str
    weight: float


class Recommendation(BaseModel):
    conflict_id: str
    score: float
    reasons: List[RecommendationReason]


class RecommendationResponse(BaseModel):
    user_id: str
    recommendations: List[Recommendation]


@router.get("/{user_id}", response_model=RecommendationResponse)
async def get_recommendations(user_id: str, settings: Settings = Depends(get_settings)) -> RecommendationResponse:
    # TODO: Integrate with trained models and feature store
    mock_recommendations = [
        Recommendation(
            conflict_id="31d8285b-e0b8-40bf-98bc-74df919ff001",
            score=0.86,
            reasons=[
                RecommendationReason(label="matched_cause:humanitarian_aid", weight=settings.weights.content_weight),
                RecommendationReason(label="similar_donors_supported", weight=settings.weights.collaborative_weight),
                RecommendationReason(label="exploration_bonus", weight=settings.weights.exploration_weight),
            ],
        )
    ]

    return RecommendationResponse(user_id=user_id, recommendations=mock_recommendations)
