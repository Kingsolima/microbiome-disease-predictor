import json
from pathlib import Path

import joblib
import numpy as np
import xgboost as xgb

ROOT = Path(__file__).parent.parent

booster = joblib.load(ROOT / "bst_ibd.pkl")

with open(ROOT / "selected_taxa.json") as f:
    feature_names = json.load(f)

with open(ROOT / "test_samples.json") as f:
    samples = json.load(f)

arr = np.array([s["features"] for s in samples], dtype=np.float32)
dmat = xgb.DMatrix(arr, feature_names=feature_names)
probs = booster.predict(dmat)  # P(UC) for each sample

results = [
    {"index": i, "true_label": samples[i]["label"], "prob_uc": float(p)}
    for i, p in enumerate(probs)
]

best_cd  = min(results, key=lambda r: r["prob_uc"])
best_uc  = max(results, key=lambda r: r["prob_uc"])
borderline = min(results, key=lambda r: abs(r["prob_uc"] - 0.5))

def fmt(r, case):
    pred = "UC" if r["prob_uc"] >= 0.5 else "CD"
    conf = r["prob_uc"] if pred == "UC" else 1 - r["prob_uc"]
    correct = "[correct]" if pred == r["true_label"] else "[wrong]"
    print(f"  {case}")
    print(f"    index      : {r['index']}")
    print(f"    true label : {r['true_label']}")
    print(f"    prediction : {pred} {correct}")
    print(f"    P(UC)      : {r['prob_uc']:.6f}")
    print(f"    confidence : {conf:.1%}")

print(f"Loaded {len(samples)} samples\n")
fmt(best_cd,   "Highest CD confidence")
print()
fmt(best_uc,   "Highest UC confidence")
print()
fmt(borderline, "Borderline (closest to 0.50)")
