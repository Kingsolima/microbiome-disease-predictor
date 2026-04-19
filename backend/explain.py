import numpy as np
import shap
import xgboost as xgb

from predict import _booster, _feature_names

_explainer = shap.TreeExplainer(_booster)


def top_features(features: list[float], n: int = 10) -> list[dict]:
    """Return top-n taxa by absolute SHAP value for a single sample."""
    arr = np.array(features, dtype=np.float32).reshape(1, -1)
    shap_values = _explainer.shap_values(arr)  # shape (1, n_features)
    values = shap_values[0]  # 1-D array

    indices = np.argsort(np.abs(values))[::-1][:n]
    return [
        {"taxon": _feature_names[i], "shap_value": round(float(values[i]), 6)}
        for i in indices
    ]
