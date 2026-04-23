import json
from pathlib import Path

import joblib
import numpy as np
import xgboost as xgb

_ROOT = Path(__file__).parent

_booster: xgb.Booster = joblib.load(_ROOT / "bst_ibd.pkl")

with open(_ROOT / "selected_taxa.json") as f:
    _feature_names: list[str] = json.load(f)

NUM_FEATURES = len(_feature_names)


def predict(features: list[float]) -> dict:
    """Return prediction label and confidence probability for one sample."""
    arr = np.array(features, dtype=np.float32).reshape(1, -1)
    dmat = xgb.DMatrix(arr, feature_names=_feature_names)
    prob_uc: float = float(_booster.predict(dmat)[0])  # P(class=1, UC)
    if prob_uc >= 0.5:
        label = "UC"
        confidence = prob_uc
    else:
        label = "CD"
        confidence = 1.0 - prob_uc
    return {"prediction": label, "probability": round(confidence, 6)}
