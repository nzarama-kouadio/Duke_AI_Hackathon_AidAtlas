from fastapi.testclient import TestClient

from app.main import create_app


def test_get_recommendations_returns_default_payload() -> None:
    app = create_app()
    client = TestClient(app)

    response = client.get("/v1/recommendations/123")

    assert response.status_code == 200
    payload = response.json()
    assert payload["user_id"] == "123"
    assert len(payload["recommendations"]) >= 1
