# Classification of Crohn's Disease and Ulcerative Colitis
### A Gut Microbial Analysis using Machine Learning + Demo

**Demo: https://microbiome-disease-predictor.vercel.app/**

**Authors:** Diya Patel · Maharshil Patel · Dhivya Umasuthan · Omar Soliman
**Institution:** Western University

---

> ### Status: results revised downward after an evaluation audit
>
> An earlier version of this README reported ROC-AUC of 0.899 (3-class) and 0.913
> (binary). **Those numbers were inflated by evaluation errors and have been
> withdrawn.** They came from a random train/test split that let samples from the
> same study project appear on both sides, plus feature selection and model tuning
> that were allowed to see the test set.
>
> After rebuilding the evaluation to remove those errors, honest performance is
> **far weaker**: roughly baseline-level accuracy on the 3-class problem, with
> Ulcerative Colitis effectively undetected. The corrected figures and the reasons
> behind them are documented below. This section is kept deliberately — the
> difference between the two sets of numbers is the most instructive result in the
> project.

---

## Problem Statement

Crohn's Disease (CD) and Ulcerative Colitis (UC) are the two main subtypes of Inflammatory Bowel Disease (IBD). They are both chronic, immune-mediated conditions characterized by persistent inflammation of the gastrointestinal tract. Despite sharing symptoms like diarrhea, abdominal pain, and fatigue, they differ critically in location and depth: UC is confined to the large intestine, while CD can affect any part of the digestive tract from mouth to anus.

Current diagnostic methods (colonoscopy, biopsy, endoscopy) are invasive, expensive, and fail to differentiate CD from UC in 10–20% of cases which leaves patients labeled as "Indeterminate Colitis" until further symptoms emerge. Misdiagnosis carries serious consequences because treatments differ significantly between the two conditions, and chronic inflammation from either disease can eventually progress to colorectal cancer.

This project develops a machine learning model that classifies gut microbial profiles into **Healthy**, **Crohn's Disease**, and **Ulcerative Colitis**, exploring whether stool-based microbiome data can serve as a less invasive diagnostic alternative.

---

## Why Stool-Based Microbiome Data?

Traditional diagnostic modalities including colonoscopy and cross-sectional imaging carry concerns around bowel preparation inconvenience and radiation exposure. Existing serological and fecal markers indicate inflammation but lack IBD specificity. Stool sampling is non-invasive, low-risk, easily collected, and cost-effective, and because it can identify IBD at an inactive stage, it has potential for early diagnosis.

---

## Dataset

| File | Description |
|---|---|
| `sample_to_run_info.csv` | Patient metadata: `project_id`, `run_id`, `phenotype`, `country`, `experiment_type` |
| `species_abundance.csv` | Long-format microbial abundance: `accession_id`, `ncbi_taxon_id`, `taxon_rank_level`, `relative_abundance` |

> WARNING: Both files are too large for GitHub. Download from [Google Drive](https://drive.google.com/drive/folders/1EXH_sqCdQDstTGO3XrWg4KXlmFM1uJ71) and place in the project root before running.

**After filtering to IBD-relevant projects** (metadata only, 46 projects):

```
Crohn Disease:        3,516 samples  (47%)
Healthy:              2,099 samples  (28%)
Colitis, Ulcerative:  1,863 samples  (25%)
```

**After the inner merge with species abundance — this is the data actually modelled:**

```
Samples:   2,838        (down from 7,478 — 4,640 had no abundance profile)
Taxa:      2,893  species-level columns
Projects:  12           (down from 46)

Crohn Disease:        1,314 samples  (46%)
Colitis, Ulcerative:    791 samples  (28%)
Healthy:                733 samples  (26%)
```

**The drop from 46 projects to 12 is the single most consequential fact in this
project.** Every limitation below follows from it. The merge also removed nearly all
amplicon samples — the modelled set is 2,838/2,838 (100%) shotgun metagenomics, which
is why species-level abundances are used throughout.

---

## Evaluation Protocol

Study cohort is the unit that must not leak. Samples from one project share sequencing
platform, protocol, and population, so a model can score well by recognising the
*batch* rather than the *disease*. The evaluation is built to make that impossible:

| Control | Implementation |
|---|---|
| Cohort leakage | `StratifiedGroupKFold` grouped on `project_id` — a project is never split across train and test |
| Feature-selection leakage | LASSO refit **inside each fold** on that fold's training rows only |
| Early-stopping leakage | XGBoost early-stops on a **grouped validation set** carved from training, never on test |
| Threshold-tuning leakage | Decision threshold chosen on **validation**, then applied to test unchanged |
| Reporting | Pooled **out-of-fold (OOF)** predictions — every sample predicted exactly once, by a model that never saw it |

Every number below is out-of-fold. No number is from a model that saw the sample it
is being scored on.

---

## Results

All figures are out-of-fold. **Baseline** = always predict the majority class, which
is the number any model must beat to be worth anything.

### 3-Class Model (Healthy vs Crohn vs UC)

| Model | Accuracy | Macro F1 | Macro ROC-AUC | Healthy F1 | Crohn F1 | UC F1 |
|---|---|---|---|---|---|---|
| Majority baseline | 0.463 | — | 0.500 | — | — | — |
| Random Forest | 0.49 | 0.46 | — | 0.49 | 0.59 | 0.29 |
| XGBoost | 0.51 | 0.41 | 0.632 | 0.49 | 0.63 | 0.11 |

**Per-class recall — the number that matters:**

| Class | Support | RF recall | XGBoost recall |
|---|---|---|---|
| Healthy | 733 | 0.59 | 0.54 |
| Crohn | 1,314 | 0.58 | 0.76 |
| **Ulcerative Colitis** | **791** | **0.24** | **0.06** |

XGBoost beats the majority baseline by **4.7 percentage points** (0.51 vs 0.463).
Random Forest beats it by 2.7. A macro ROC-AUC of 0.632 (0.5 = chance) confirms there
is *some* signal, but it is weak.

**UC recall of 0.06 means the 3-class XGBoost model essentially never predicts
Ulcerative Colitis.** Of 791 UC patients it identifies 47. It has learned that
predicting "Crohn" for anything inflammatory is the cheapest way to minimise loss.
This is not a bug to be tuned away — see *Why This Does Not Work* below.

### Binary Model (Crohn vs UC only)

| Model | Accuracy | Crohn F1 | UC F1 | Macro F1 | ROC-AUC |
|---|---|---|---|---|---|
| Majority baseline | 0.624 | — | — | — | 0.500 |
| Random Forest | 0.62 | 0.69 | 0.50 | 0.60 | — |
| XGBoost (threshold 0.5) | 0.64 | 0.73 | 0.47 | 0.60 | 0.643 |
| XGBoost (validation-tuned threshold) | 0.44 | 0.24 | 0.55 | 0.40 | 0.643 |

Per-fold ROC-AUC: **0.668 ± 0.011**.

This is the stronger of the two models and the one worth reporting, but the honesty
is in the comparison to baseline: **accuracy of 0.64 against a 0.624 baseline is a
1.6-point improvement.** The AUC of 0.64–0.67 is the more meaningful figure — it says
the model ranks UC above Crohn better than chance, even though its hard predictions
are barely better than guessing the majority class.

**On threshold tuning:** lowering the cutoff raises UC F1 from 0.47 to 0.55 and UC
recall to 0.93 — but Crohn recall collapses from 0.77 to **0.14** and overall accuracy
falls to 0.44. This is a *trade*, not an improvement. It is reported here because the
operating point is a legitimate clinical choice, not because it made the model better.

---

## Why This Does Not Work

The honest diagnosis, in order of severity.

**1. Twelve cohorts is not enough.** The binding constraint is the number of
independent projects, not the number of samples. With 12 projects, between-cohort
technical variation is large relative to the disease signal, and grouped
cross-validation correctly refuses to reward a model for memorising batch effects.
The earlier 0.91 AUC was largely the model doing exactly that.

**2. UC and Crohn genuinely overlap at the species level.** These are two inflammatory
conditions affecting the same organ system with substantially shared microbial
dysbiosis. The 10–20% clinical misdiagnosis rate cited in the problem statement is
evidence that the distinction is hard *with a colonoscopy*. Expecting stool
composition alone to cleanly separate them was optimistic.

**3. UC is the minority class in a three-way contest it cannot win.** With 791 UC
against 1,314 Crohn and 733 Healthy, and with UC's signal overlapping Crohn's, the
loss-minimising strategy is to rarely predict UC. Class weighting redistributes the
decision boundary; it cannot manufacture signal that is not in the data.

**4. The fold geometry was itself broken.** At `n_splits=5`, splitting 12 projects
produced degenerate folds:

```
fold 0: 2708 train /  130 test | 1 project  | {H:89, C:41}          ← no UC at all
fold 1: 2833 train /    5 test | 1 project  | {C:5}                 ← 5 samples, one class
fold 2: 2720 train /  118 test | 3 projects | {H:38, C:41, UC:39}
fold 3: 2653 train /  185 test | 2 projects | {H:48, C:117, UC:20}
fold 4:  438 train / 2400 test | 5 projects | {H:558, C:1110, UC:732}
```

Two folds contain no UC, so their AUC is undefined. Worse, **fold 4 trained on 438
samples (15% of the data) and generated predictions for 2,400 samples — 85% of the
entire out-of-fold pool.** This means the reported OOF figures above are dominated by
one severely under-trained model and are likely *pessimistic*, while the per-fold
`± 0.215` standard deviation is pure noise. The fix (`n_splits=3`, ~4 projects per
fold) is implemented in the notebook and the figures above will be regenerated.

**5. `log1p` feature engineering was a no-op, for two compounding reasons.** Tree
ensembles split on thresholds, so they are mathematically **invariant to any monotonic
per-feature transform** — `log1p` cannot change a Random Forest or XGBoost, by
construction. And the one step that *is* sensitive to it, LASSO selection, was being
fed raw values regardless of the transform setting. The raw and `log1p` runs therefore
produced byte-identical scores (`0.651 ± 0.215` both times). The wiring is fixed and a
centered log-ratio (CLR) transform — which mixes information across taxa and is
therefore *not* monotonic per-feature — has been added as a transform that can
actually move the result.

---

## Methodology

### Why XGBoost?

**High-dimensional sparse data** — with ~2,900 taxon columns that are mostly zero, XGBoost handles sparse tabular data natively, unlike SVMs and neural networks which assume dense input and overfit in this setting.

**Mixed signal strength** — most taxa are uninformative noise; only a small fraction carry disease correlation. Gradient boosting builds trees sequentially, each focusing on the residual errors of the previous ones, naturally down-weighting weak features.

**Calibrated probabilities** — `binary:logistic` and `multi:softprob` produce probability outputs that make threshold tuning possible.

### Why Not Other Models?

| Model | Reason Not Used |
|---|---|
| **Logistic Regression** | Assumes a linear relationship between abundance and disease. Used as a feature selector only, via the L1 penalty. |
| **Random Forest** | Comparable performance, retained as a benchmark. Notably it achieves *better UC recall* (0.24 vs 0.06) than XGBoost in the 3-class setting, at the cost of overall accuracy. |
| **SVM** | Distance calculations unreliable on sparse high-dimensional data; no native calibrated probabilities, ruling out threshold tuning. |
| **Neural Networks** | 2,838 samples is far too small. Tree-based methods consistently outperform neural networks on tabular data below ~100k rows. |
| **LightGBM** | Architecturally similar to XGBoost; no expected gain. |

### Feature Selection: LASSO

L1-penalized logistic regression (C=0.1, GPU-accelerated via cuML) on the 2,893-taxon
matrix. Taxa with a non-zero coefficient for any class are retained. Refit on the full
dataset for interpretation, this selects **746 taxa**; inside cross-validation it is
refit per fold, so the selected set differs slightly between folds by design.

**Feature importances are reported for hypothesis generation only.** They come from a
full-data refit with no hold-out and must not be read as evidence of performance.

---

## Pipeline Overview

```
sample_to_run_info.csv
        ↓
  1. Filter to IBD-relevant project IDs (46 projects)
  2. Keep: Healthy, Crohn Disease, Colitis Ulcerative
        ↓
species_abundance.csv
        ↓
  3. Filter to species-level taxa, drop unclassified (ncbi_taxon_id = -1)
  4. Pivot long → wide (one row per sample, one column per taxon)
        ↓
  5. Inner merge on run_id  →  2,838 samples, 12 projects, 100% metagenomics
        ↓
  6. StratifiedGroupKFold grouped on project_id
        ↓
     For each fold:
       6a. LASSO feature selection   (training rows only)
       6b. Grouped validation carve-out from training rows
       6c. Random Forest             (fold training data)
       6d. XGBoost                   (early stop on validation)
       6e. Threshold tuning          (on validation, binary model)
       6f. Predict held-out fold once
        ↓
  7. Pool out-of-fold predictions → single honest report
```

---

## Setup & Usage

### Requirements
```
python >= 3.10
pandas, numpy, scikit-learn, xgboost, matplotlib, seaborn
cuml, cudf, cupy   (NVIDIA GPU — tested on T4 via Google Colab)
```

See `requirements.txt` (CPU) and `requirements-gpu.txt` (RAPIDS/cuML).

### Run in Google Colab (Recommended)
The notebook uses cuML for GPU-accelerated training. Open `Model Analysis.ipynb` in
Colab with a T4 GPU runtime and run all cells in order.

```bash
# 1. Clone the repo
git clone https://github.com/diya-patel83/microbiome-disease-predictor.git
cd microbiome-disease-predictor

# 2. Download the two CSVs from Google Drive into the project root
# 3. Open "Model Analysis.ipynb" in Colab (T4 GPU runtime)
# 4. Run all cells in order
```

**Before trusting any output, check the fold-geometry printout in Section 3.** Every
fold should show all three classes with non-trivial counts and comparable train sizes.
If it does not, the scores below it are not interpretable.

---

## Repository Structure

```
microbiome-disease-predictor/
├── Model Analysis.ipynb     # Main notebook (GPU: cuML + XGBoost)
├── backend/                 # Prediction API
├── frontend/                # Demo web app
├── bst_ibd.pkl              # Serialised binary Crohn-vs-UC model
├── selected_taxa.json       # Taxa retained by LASSO
├── requirements.txt         # CPU dependencies
├── requirements-gpu.txt     # RAPIDS / cuML dependencies
└── README.md
```

---

## Key Findings

- **Grouped cross-validation cut apparent performance roughly in half.** 3-class
  ROC-AUC fell from a reported 0.899 to 0.632; binary from 0.913 to 0.643. The gap is
  a direct measure of how much the original result was batch memorisation.
- **The binary Crohn-vs-UC model is the only result worth reporting**, at ROC-AUC
  0.643 OOF (0.668 ± 0.011 per fold) — above chance, but only marginally above the
  majority-class baseline on hard predictions.
- **Three-class UC detection is at or near the limit of this dataset**, with recall of
  0.06 (XGBoost) and 0.24 (Random Forest).
- **The constraint is cohorts, not samples.** 12 projects is too few to separate
  disease signal from batch effect, and adding more samples from the same 12 projects
  would not help.
- **Leakage is easy to introduce and expensive to detect.** Three separate leaks
  (feature selection, early stopping, threshold tuning) each looked like ordinary
  modelling code.

---

## Limitations & Future Work

### Being clear-eyed about the ceiling

**UC recall of 0.06 is probably close to what this data can support.** 791 UC samples
spread across a handful of cohorts, with signal that overlaps Crohn, is not a tuning
problem. No amount of hyperparameter search turns that into 0.7. The right response is
to report it accurately, not to hide it behind a favourable split.

### Planned work, in priority order

**1. Fold geometry — mandatory, implemented, pending rerun.** Drop to `n_splits=3` so
each test fold holds ~4 projects, every fold contains all three classes, and no fold
trains on a sliver. All figures in this README will be regenerated afterwards; the
per-fold standard deviations only become meaningful at that point.

**2. Repair the feature-engineering comparison — implemented, pending rerun.** The
transform now reaches LASSO selection, and CLR has been added alongside `log1p`. If
neither beats raw features under the corrected folds, the comparison will be reported
as a negative result rather than dropped.

**3. Class weighting for UC recall — implemented, pending rerun.** `class_weight="balanced"`
on the Random Forest (where the installed cuML build supports it) and inverse-frequency
sample weights for XGBoost, since `multi:softprob` does not accept `class_weight`
directly. Expected to produce a modest lift at best, and to trade Healthy/Crohn recall
for it.

**4. Lead with the binary model.** Report Crohn-vs-UC as the headline IBD result and
present the 3-class model with its UC limitation stated plainly rather than averaged
away into a macro F1.

**5. More independent cohorts — the genuine fix, currently unavailable.** The
constraint is the number of projects. Additional cohorts from different populations
and protocols would do more than any modelling change in this list. Until then, the
honest ceiling stands.

### Further limitations

- **Batch effects are controlled for in evaluation but not corrected in the data.**
  Grouped CV prevents leakage; it does not remove the confound. ComBat or a similar
  correction should be applied before any clinical interpretation.
- **Single sequencing technology.** The merge left only shotgun metagenomics, so the
  models are untested on amplicon data and should not be assumed to transfer.
- **Cross-sectional data.** Longitudinal microbiome tracking would likely improve
  early detection, but is not available here.
- **Unmodelled confounders** — diet, geography, antibiotic use, disease activity at
  sampling — are known drivers of microbiome composition and are absent from the
  feature set.
- **Not a diagnostic tool.** At current performance this is a research exercise. It is
  not suitable for any clinical use.

---

## References

- Mayo Clinic. Ulcerative Colitis vs. Crohn's Disease. https://www.mayoclinic.org
- PMC9793422 — Differentiating CD from UC
- PMC8643196 — Indeterminate Colitis outcomes
- PMC11241288 — IBD diagnostic procedures
- PubMed 39367251 — Stool sampling for IBD diagnosis
- PMC11538166 — Microbiome biomarkers in healthcare
- PMC11786253 — Microbiome ML challenges
- ScienceDirect S0966842X23003396 — ML microbiome risk score for Crohn's prediction
