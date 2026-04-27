from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from predict import NUM_FEATURES, predict
from explain import top_features

app = FastAPI(title="Microbiome IBD Classifier")

def _parse_origins(value: str | None) -> list[str]:
    if not value:
        return []
    return [o.strip().rstrip("/") for o in value.split(",") if o.strip()]


# Comma-separated list, e.g.
# FRONTEND_ORIGINS="http://localhost:5173,https://your-frontend.vercel.app"
frontend_origins = _parse_origins(os.getenv("FRONTEND_ORIGINS"))

allow_origins = (
    frontend_origins
    if frontend_origins
    else [
        "http://localhost:5173",  # Vite dev server default
        "http://localhost:3000",  # alternate dev port
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    features: list[float]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict_endpoint(body: PredictRequest):
    if len(body.features) != NUM_FEATURES:
        raise HTTPException(
            status_code=422,
            detail=f"Expected {NUM_FEATURES} features, got {len(body.features)}.",
        )
    result = predict(body.features)
    result["top_features"] = top_features(body.features)
    return result
