# Classification of Crohn's Disease and Ulcerative Colitis
### A Gut Microbial Analysis using Machine Learning

**Demo By Omar: https://microbiome-disease-predictor.vercel.app/**

**Authors:** Diya Patel · Maharshil Patel · Dhivya Umasuthan · Omar Soliman  
**Institution:** Western University

---

## Problem Statement

Crohn's Disease (CD) and Ulcerative Colitis (UC) are the two main subtypes of Inflammatory Bowel Disease (IBD). They are both chronic, immune-mediated conditions characterized by persistent inflammation of the gastrointestinal tract. Despite sharing symptoms like diarrhea, abdominal pain, and fatigue, they differ critically in location and depth: UC is confined to the large intestine, while CD can affect any part of the digestive tract from mouth to anus.

Current diagnostic methods (colonoscopy, biopsy, endoscopy) are invasive, expensive, and fail to differentiate CD from UC in 10–20% of cases which leaves patients labeled as "Indeterminate Colitis" until further symptoms emerge. Misdiagnosis carries serious consequences because treatments differ significantly between the two conditions, and chronic inflammation from either disease can eventually progress to colorectal cancer.

This project develops a machine learning model that classifies gut microbial profiles into **Healthy**, **Crohn's Disease**, and **Ulcerative Colitis**, exploring whether stool-based microbiome data can serve as a less invasive diagnostic alternative.

---

## Why Stool-Based Microbiome Data?

Traditional diagnostic modalities including colonoscopy and cross-sectional imaging carry concerns around bowel preparation inconvenience and radiation exposure. Existing serological and fecal markers indicate inflammation but lack IBD specificity. Stool sampling is non-invasive, low-risk, easily collected, and cost-effective, and because it can identify IBD at an inactive stage, it has potential for early diagnosis. Integration of microbiome-based biomarkers into health information systems also has potential to define representative baselines for healthy populations and establish disease-associated signatures at scale.

---

## Dataset

| File | Description |
|---|---|
| `sample_to_run_info.csv` | Patient metadata: `project_id`, `run_id`, `phenotype`, `country`, `experiment_type` |
| `species_abundance.csv` | Long-format microbial abundance: `accession_id`, `ncbi_taxon_id`, `taxon_rank_level`, `relative_abundance` |

> WARNING: Both files are too large for GitHub. Download from [Google Drive](https://drive.google.com/drive/folders/1EXH_sqCdQDstTGO3XrWg4KXlmFM1uJ71) and place in the project root before running.

**After filtering to IBD-relevant projects:**
```
Crohn Disease:        3,516 samples  (47%)
Healthy:              2,099 samples  (28%)
Colitis, Ulcerative:  1,863 samples  (25%)
```

---

## Pipeline Overview

```
sample_to_run_info.csv
        ↓
  1. Filter to IBD-relevant project IDs only
  2. Keep: Healthy, Crohn Disease, Colitis, Ulcerative
        ↓
species_abundance.csv
        ↓
  3. Filter to genus-level taxa, drop unclassified (ncbi_taxon_id = -1)
  4. Pivot long → wide (one row per sample, one column per taxon)
        ↓
  5. Merge metadata + abundance on run_id
        ↓
  6. LASSO (L1 Logistic Regression) feature selection
     2,213 taxa → 413 informative taxa
        ↓
  7. Train/test split (80/20, stratified)
        ↓
  8a. XGBoost (3-class: Healthy vs Crohn vs UC)
  8b. Random Forest (3-class benchmark)
  8c. XGBoost (binary: Crohn vs UC only)
  8d. Threshold tuning for optimal UC recall
```

---

## Methodology

### Why XGBoost?

**High-dimensional sparse data** — with over 2,000 taxon columns that are mostly zero, XGBoost handles sparse tabular data natively, unlike SVMs and neural networks which assume dense input and overfit in this setting.

**Mixed signal strength** — most taxa are uninformative noise, only a small percentage carry strong disease correlation. XGBoost's gradient boosting builds trees sequentially where each tree focuses on the residual errors of the previous ones, naturally learning to ignore weak features and amplify strong ones.

**Class imbalance and biological noise** — microbiome samples from the same disease vary significantly across diet, geography, and medical history. Boosting corrects its own mistakes iteratively rather than fitting a single rigid decision boundary.

### Why Not Other Models?

| Model | Reason Not Used |
|---|---|
| **Logistic Regression** | Assumes linear relationship between taxon abundance and disease — relationship is nonlinear. Used as feature selector only (2,213 → 413 taxa via L1 penalty). |
| **Random Forest** | Comparable performance, included as benchmark. Treats all trees equally with no mechanism to prioritize misclassified minority samples — critical for detecting UC as a minority class. |
| **SVM** | Distance calculations unreliable on sparse high-dimensional data. No native calibrated probability output, ruling out threshold tuning. |
| **Neural Networks** | Dataset (~7,500 samples) is too small. Tree-based methods consistently outperform neural networks on tabular data under ~100k rows. Adds complexity without meaningful gain. |
| **LightGBM** | Architecturally similar to XGBoost. XGBoost selected for well-calibrated probability outputs (`binary:logistic`, `multi:softprob`) that enable threshold tuning. |

### Feature Selection: LASSO

L1-penalized logistic regression (C=0.1, GPU-accelerated via cuML) was applied to the full 2,213-taxon matrix. Features with non-zero coefficients across any class were retained, reducing dimensionality from 2,213 to **413 informative taxa** before training the final classifiers.

---

## Results

### 3-Class Model (Healthy vs Crohn vs UC)

| Model | Healthy F1 | Crohn F1 | UC F1 | Macro F1 | ROC-AUC |
|---|---|---|---|---|---|
| XGBoost | 0.72 | 0.81 | 0.68 | 0.74 | 0.899 |
| Random Forest | 0.72 | 0.82 | 0.69 | 0.74 | — |

### Binary Model (Crohn vs UC only)

| Model | Crohn F1 | UC F1 | Macro F1 | ROC-AUC |
|---|---|---|---|---|
| XGBoost (default threshold 0.5) | 0.87 | 0.77 | 0.82 | 0.9125 |
| Random Forest | 0.87 | 0.74 | 0.81 | — |
| **XGBoost (tuned threshold 0.32)** | **0.86** | **0.80** | **0.83** | **0.9125** |

Lowering the decision threshold from 0.5 to 0.32 increased UC recall from 0.73 to **0.88** — a clinically meaningful improvement given that missing a UC diagnosis carries similar consequences to missing Crohn's.

---

## Setup & Usage

### Requirements
```
python >= 3.10
pandas
numpy
scikit-learn
xgboost
matplotlib
seaborn
cuml  (NVIDIA GPU, tested on T4 via Google Colab)
cudf
cupy
```

### Run in Google Colab (Recommended)
This notebook uses cuML for GPU-accelerated training. Open in Colab with a T4 GPU runtime:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/diya-patel83/microbiome-disease-predictor/blob/main/analysis_cuml.ipynb)

### Steps
```bash
# 1. Clone the repo
git clone https://github.com/diya-patel83/microbiome-disease-predictor.git
cd microbiome-disease-predictor

# 2. Download data files from Google Drive and place in root:
#    - sample_to_run_info.csv
#    - species_abundance.csv

# 3. Open analysis_cuml.ipynb in Colab with T4 GPU runtime
# 4. Run all cells in order
```

---

## Repository Structure

```
microbiome-disease-predictor/
├── analysis_cuml.ipynb     # Main notebook (GPU, cuML + XGBoost)
├── analysis.ipynb          # CPU fallback notebook
├── README.md
├── .gitignore
└── test.txt
```

---

## Key Findings

- Gut microbiome data alone achieves **ROC-AUC of 0.91** for distinguishing Crohn's Disease from Ulcerative Colitis
- Some Crohn/UC confusion is expected and clinically known — even gastroenterologists misdiagnose one as the other before colonoscopy in up to 20% of cases
- LASSO feature selection identified **413 taxa** as diagnostically informative out of 2,213 — a 81% reduction with no performance loss
- Top discriminating taxa include genera from families consistent with prior IBD microbiome literature (Oscillospiraceae, Lachnospiraceae)
- Threshold tuning is clinically actionable — the operating point can be adjusted based on which misdiagnosis carries greater clinical risk

---

## Limitations & Future Work

- Confounding factors (diet, geography, antibiotic use, sequencing platform) were not fully corrected — batch effects across 46 study projects may inflate performance
- Dataset is cross-sectional — longitudinal microbiome tracking could improve early detection
- ComBat or similar batch correction methods should be applied before clinical deployment
- Integration of host genetics, metabolomics, and clinical metadata could further improve discrimination between CD and UC

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
