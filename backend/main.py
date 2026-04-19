from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predict import NUM_FEATURES, predict
from explain import top_features

app = FastAPI(title="Microbiome IBD Classifier")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
