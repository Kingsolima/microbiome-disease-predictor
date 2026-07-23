# Classification of Crohn's Disease and Ulcerative Colitis
### A Gut Microbial Analysis using Machine Learning + Demo

**Demo: https://microbiome-disease-predictor.vercel.app/**

**Author:** Omar Soliman
**Institution:** Western University

---

## Project Summary

This project evaluates whether gut microbiome profiles can distinguish Crohn's disease from ulcerative colitis across independent research cohorts. The dataset contains 2,838 samples from 12 projects and 2,893 species-level microbial features.

An initial random-split model reported inflated performance because samples from the same study appeared in both training and testing. I rebuilt the pipeline using project-grouped cross-validation, fold-specific feature selection, grouped early stopping, and out-of-fold evaluation. Under this stricter protocol, the binary model achieved a ROC-AUC of 0.637.

The main finding is not that the model performs well, but that cross-cohort domain shift is substantially larger than random-split evaluation suggests. Current work compares species- and genus-level representations and explores whether transfer-learning methods can improve generalization across cohorts.

---

> ### Status: results revised downward after an evaluation audit
>
> An earlier version of this README reported ROC-AUC of 0.899 (3-class) and 0.913
> (binary). Those numbers were inflated by evaluation errors and have been withdrawn.
> They came from a random train/test split that let samples from the same study
> project appear on both sides, plus feature selection and model tuning that were
> allowed to see the test set.
>
> After rebuilding the evaluation to remove those errors, honest performance is far
> weaker: the 3-class model does not clear its own majority-class baseline, and the
> binary model beats its baseline by under two points. The corrected figures and the
> reasons behind them are documented below. This section is kept deliberately, since
> the gap between the two sets of numbers is the most instructive result here.

---

## Problem Statement

Crohn's Disease (CD) and Ulcerative Colitis (UC) are the two main subtypes of Inflammatory Bowel Disease (IBD). Both are chronic, immune-mediated conditions characterised by persistent inflammation of the gastrointestinal tract. Despite sharing symptoms like diarrhea, abdominal pain, and fatigue, they differ critically in location and depth: UC is confined to the large intestine, while CD can affect any part of the digestive tract from mouth to anus.

Current diagnostic methods (colonoscopy, biopsy, endoscopy) are invasive, expensive, and fail to differentiate CD from UC in 10 to 20% of cases, which leaves patients labelled as "Indeterminate Colitis" until further symptoms emerge. Misdiagnosis carries serious consequences because treatments differ significantly between the two conditions, and chronic inflammation from either disease can eventually progress to colorectal cancer.

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

**After the inner merge with species abundance, which is the data actually modelled:**

```
Samples:   2,838        (down from 7,478; 4,640 had no abundance profile)
Taxa:      2,893        species-level columns
Projects:  12           (down from 46)

Crohn Disease:        1,314 samples  (46%)
Colitis, Ulcerative:    791 samples  (28%)
Healthy:                733 samples  (26%)
```

The drop from 46 projects to 12 is the single most consequential fact in this project, and every limitation below follows from it. The merge also removed nearly all amplicon samples, leaving 2,838 of 2,838 (100%) shotgun metagenomics, which is why species-level abundances are used throughout.

**How the IBD samples are distributed across cohorts** (2,105 samples, UC present in 7 of 12 projects):

| project_id | Crohn | UC |
|---|---|---|
| PRJEB21933 | 32 | 0 |
| PRJEB42151 | 0 | 39 |
| PRJEB76677 | 14 | 10 |
| PRJNA1024678 | 9 | 0 |
| PRJNA296946 | 5 | 0 |
| **PRJNA398089** | **593** | **368** |
| PRJNA429990 | 41 | 25 |
| PRJNA793776 | 41 | 0 |
| PRJNA813736 | 19 | 20 |
| PRJNA851554 | 98 | 0 |
| PRJNA983946 | 0 | 27 |
| **PRJNA993675** | **462** | **302** |

Two projects hold roughly 80% of the IBD samples. Grouped cross-validation is therefore testing against a small number of genuinely independent sources, whatever the sample count suggests.

---

## Evaluation Protocol

Study cohort is the unit that must not leak. Samples from one project share sequencing platform, protocol, and population, so a model can score well by recognising the batch rather than the disease. The evaluation is built to make that impossible:

| Control | Implementation |
|---|---|
| Cohort leakage | `StratifiedGroupKFold` grouped on `project_id`, so a project is never split across train and test |
| Feature-selection leakage | LASSO refit inside each fold on that fold's training rows only |
| Early-stopping leakage | XGBoost early-stops on a grouped validation set carved from training, never on test |
| Threshold-tuning leakage | Decision threshold chosen on validation, then applied to test unchanged |
| Degenerate folds | A geometry search rejects fold counts that strand a class outside a train or test fold, and reports when no clean option exists |
| Reporting | Pooled out-of-fold predictions, so every sample is predicted exactly once by a model that never saw it |

Every number below is out-of-fold. No number comes from a model that saw the sample it is being scored on.

---

## Results

**Baseline** means always predicting the majority class. It is the number any model has to beat to be worth anything.

### 3-Class Model (Healthy vs Crohn vs UC)

| Model | Accuracy | Baseline | Macro F1 | Macro ROC-AUC |
|---|---|---|---|---|
| Majority baseline | 0.463 | | | 0.500 |
| Random Forest | 0.47 | 0.463 | 0.44 | n/a |
| XGBoost | 0.44 | 0.463 | 0.44 | 0.646 |

Per-class recall:

| Class | Support | RF recall | XGBoost recall |
|---|---|---|---|
| Healthy | 733 | 0.29 | 0.36 |
| Crohn | 1,314 | 0.56 | 0.39 |
| Ulcerative Colitis | 791 | 0.48 | 0.60 |

Random Forest clears the baseline by 0.7 points. XGBoost falls 2.3 points below it. A macro ROC-AUC of 0.646 against a chance value of 0.5 says there is some ranking signal, but not enough to produce useful hard predictions.

### Binary Model (Crohn vs UC only)

| Model | Accuracy | Baseline | Crohn F1 | UC F1 | Macro F1 | ROC-AUC |
|---|---|---|---|---|---|---|
| Majority baseline | 0.624 | | | | | 0.500 |
| Random Forest | 0.61 | 0.624 | 0.69 | 0.49 | 0.59 | n/a |
| XGBoost (threshold 0.5) | 0.64 | 0.624 | 0.74 | 0.46 | 0.60 | 0.637 |
| XGBoost (validation-tuned threshold) | 0.42 | 0.624 | 0.14 | 0.56 | 0.35 | 0.637 |

Per-fold ROC-AUC: 0.632 +/- 0.001 across 2 folds.

This is the stronger of the two models, and the most interpretable because it reached a valid two-fold cohort geometry, but the honesty is in the baseline comparison: accuracy of 0.64 against 0.624 is a 1.6 point improvement. The AUC of 0.637 is the more meaningful figure, since it says the model ranks UC above Crohn better than chance even though its hard predictions are close to guessing the majority class.

### Feature transforms

| Transform | RF accuracy | XGBoost accuracy | Macro ROC-AUC |
|---|---|---|---|
| Raw abundances | 0.495 +/- 0.041 | 0.453 +/- 0.048 | 0.705 +/- 0.071 |
| log1p | 0.501 +/- 0.034 | 0.450 +/- 0.031 | 0.713 +/- 0.066 |
| CLR (centered log-ratio) | 0.472 +/- 0.045 | 0.440 +/- 0.016 | 0.684 +/- 0.027 |

All three land within one per-fold standard deviation of each other, so none of them helps. This is worth stating plainly because an earlier version of the comparison was a no-op that could not have shown a difference: tree ensembles split on thresholds and are therefore invariant to any monotonic per-feature transform such as log1p, and the one step that is sensitive to it, LASSO selection, was being fed raw values regardless of the setting. Both paths are now wired correctly, and CLR was added specifically because it mixes information across taxa and so is not a per-feature monotonic map. The comparison now genuinely runs, and the answer is still negative.

### Class weighting

| Setting | XGBoost accuracy | Macro ROC-AUC | XGBoost UC recall |
|---|---|---|---|
| Unweighted | 0.453 +/- 0.048 | 0.705 +/- 0.071 | 0.604 |
| Balanced | 0.512 +/- 0.112 | 0.715 +/- 0.090 | 0.651 |

Class weighting gives XGBoost a modest lift. The Random Forest per-class recalls are byte-identical weighted and unweighted, which indicates the installed cuML build silently ignores `class_weight`; the notebook checks for the parameter and reports whether it is exposed.

---

## Why This Does Not Work Well

**Twelve cohorts is the binding constraint, and it counts projects rather than samples.** Two projects hold roughly 80% of the IBD data. Between-cohort technical variation is large relative to the disease signal, and grouped cross-validation correctly refuses to reward a model for memorising it. The withdrawn 0.91 AUC was largely the model doing exactly that.

**The results are unstable under fold reassignment.** UC recall in the 3-class model moved from 0.06 to 0.60 between two runs that differed only in fold geometry, with no change to the model. With this few cohorts, which projects land in which fold moves the result more than any modelling decision does. That instability is itself a finding, and it means any single point estimate here should be treated with suspicion.

**The multiclass fold geometry never became clean.** The geometry search reports one surviving problem: fold 2 trains on 1,032 of 2,838 samples (36%) and predicts 1,806 of them.

```
fold 0: 2712 train /  126 test | 2 projects | {Healthy: 48,  Crohn: 19,  UC: 59}
fold 1: 1932 train /  906 test | 1 project  | {Healthy: 142, Crohn: 462, UC: 302}
fold 2: 1032 train / 1806 test | 9 projects | {Healthy: 543, Crohn: 833, UC: 430}
```

Per-fold standard deviations for the 3-class model should therefore be read as noise, and only the pooled out-of-fold figures quoted. The binary problem does reach a clean geometry at 2 folds with 6 test projects each, so its numbers are sound.

**Crohn and UC genuinely overlap at the species level.** These are two inflammatory conditions in the same organ system with substantially shared microbial dysbiosis. The 10 to 20% clinical misdiagnosis rate quoted above is evidence that the distinction is hard with a colonoscopy, so expecting stool composition alone to separate them cleanly was optimistic.

**Threshold tuning is a trade, not an improvement.** Lowering the cutoff raises UC F1 from 0.457 to 0.557 and UC recall to 0.98, while Crohn recall collapses from 0.79 to 0.08 and accuracy falls to 0.42. ROC-AUC is unchanged, because moving a threshold slides along a fixed curve rather than improving it. Which operating point to prefer is a clinical judgement about which misdiagnosis costs more, not a modelling win.

---

## Methodology

### Why XGBoost?

**High-dimensional sparse data.** With roughly 2,900 taxon columns that are mostly zero, XGBoost handles sparse tabular data natively, unlike SVMs and neural networks which assume dense input and overfit in this setting.

**Mixed signal strength.** Most taxa are uninformative noise and only a small fraction carry disease correlation. Gradient boosting builds trees sequentially, each focusing on the residual errors of the previous ones, which naturally down-weights weak features.

**Probability outputs.** The logistic objectives produce continuous probability estimates that support ROC-AUC analysis and threshold selection. Formal probability calibration was not performed.

### Why Not Other Models?

| Model | Reason Not Used |
|---|---|
| **Logistic Regression** | Assumes a linear relationship between abundance and disease. Used as a feature selector only, via the L1 penalty. |
| **Random Forest** | Comparable performance, retained as a benchmark. It is the better of the two on 3-class accuracy (0.47 vs 0.44) and the worse on binary (0.61 vs 0.64). |
| **SVM** | Not prioritised because the main goal was cohort-aware evaluation rather than exhaustive model comparison. Probability-based threshold analysis would also require an additional calibration step. |
| **Neural Networks** | Not prioritised because only 12 independent cohorts were available, creating substantial overfitting risk despite the larger sample count. |
| **LightGBM** | Architecturally similar to XGBoost, with no expected gain. |

### Feature Selection: LASSO

L1-penalised logistic regression (C=0.1, GPU-accelerated via cuML) on the 2,893-taxon matrix. Taxa with a non-zero coefficient for any class are retained. Refit on the full dataset for interpretation this selects **746 taxa**; inside cross-validation it is refit per fold, so the selected set differs between folds by design.

Feature importances are reported for hypothesis generation only. They come from a full-data refit with no hold-out and carry no performance claim.

---

## Pipeline Overview

```
sample_to_run_info.csv
        |
  1. Filter to IBD-relevant project IDs (46 projects)
  2. Keep: Healthy, Crohn Disease, Colitis Ulcerative
        |
species_abundance.csv
        |
  3. Filter to species-level taxa, drop unclassified (ncbi_taxon_id = -1)
  4. Pivot long to wide (one row per sample, one column per taxon)
        |
  5. Inner merge on run_id  ->  2,838 samples, 12 projects, 100% metagenomics
        |
  6. Search for a usable StratifiedGroupKFold geometry on project_id
        |
     For each fold:
       6a. LASSO feature selection   (training rows only)
       6b. Grouped validation carve-out from training rows
       6c. Random Forest             (fold training data)
       6d. XGBoost                   (early stop on validation)
       6e. Threshold tuning          (on validation, binary model)
       6f. Predict held-out fold once
        |
  7. Pool out-of-fold predictions into a single honest report
```

---

## Setup & Usage

### Requirements
```
python >= 3.10
pandas, numpy, scikit-learn, xgboost, matplotlib, seaborn
cuml, cudf, cupy   (NVIDIA GPU, tested on T4 via Google Colab)
```

See `requirements.txt` (CPU) and `requirements-gpu.txt` (RAPIDS/cuML).

### Run in Google Colab (recommended)

The notebook uses cuML for GPU-accelerated training. Open `Model_Analysis.ipynb` in Colab with a T4 GPU runtime and run all cells in order.

```bash
# 1. Clone the repo
git clone https://github.com/diya-patel83/microbiome-disease-predictor.git
cd microbiome-disease-predictor

# 2. Download the two CSVs from Google Drive into the project root

# 3. Open Model_Analysis.ipynb in Colab (T4 GPU runtime)
# 4. Run all cells in order
```

Read the fold-geometry printouts in Sections 3 and 8 before trusting anything below them. If the search reports that no clean geometry was found, the per-fold spreads for that model are not interpretable and only the pooled out-of-fold numbers should be quoted.

---

## Repository Structure

```
microbiome-disease-predictor/
├── Model_Analysis.ipynb     # Main notebook (GPU: cuML + XGBoost)
├── backend/                 # Prediction API (serves its own model + taxa copies)
├── frontend/                # Demo web app
├── models/                  # Artifacts for the standalone find_cases.py script
│   ├── bst_ibd.pkl          #   Serialised binary Crohn-vs-UC model
│   ├── selected_taxa.json   #   Taxa retained by LASSO
│   └── test_samples.json    #   Held-out samples for the diagnostic script
├── requirements.txt         # CPU dependencies
├── requirements-gpu.txt     # RAPIDS / cuML dependencies
└── README.md
```

---

## Key Findings

- **Grouped cross-validation cut apparent performance roughly in half.** 3-class ROC-AUC fell from a reported 0.899 to 0.646, and binary from 0.913 to 0.637. That gap is a direct measure of how much the original result was batch memorisation.
- **The binary task produced the most interpretable result because it achieved a valid two-fold cohort geometry**, at out-of-fold ROC-AUC 0.637, though its accuracy sits only 1.6 points above the majority baseline.
- **The 3-class model does not clear its own baseline.** XGBoost lands below it and Random Forest 0.7 points above it.
- **Fold assignment moves the result more than modelling does.** A single reshuffle moved UC recall from 0.06 to 0.60.
- **Feature transforms and class weighting both produced negative or marginal results**, and are reported as such rather than dropped.
- **Leakage is easy to introduce and expensive to detect.** Three separate leaks (feature selection, early stopping, threshold tuning) each looked like ordinary modelling code.

---

## Limitations

**Not a diagnostic tool.** At this level of performance this is a research exercise. Nothing here is suitable for clinical use, and the 3-class model in particular performs at or below the level of always guessing the most common class.

**Too few independent cohorts.** Twelve projects, two of which dominate the IBD subset, is not enough to separate disease signal from batch effect. This bounds everything else.

**Unstable estimates.** Because so few cohorts exist, results swing substantially with fold assignment. Any single number in this README should be read as one draw from a wide distribution rather than a settled value.

**The multiclass geometry is still degenerate.** No fold count produced a clean split for the 3-class problem, and one fold trains on 36% of the data. Its per-fold spreads are not interpretable.

**Batch effects are controlled for in evaluation but not corrected in the data.** Grouped cross-validation prevents leakage; it does not remove the confound.

**Single sequencing technology.** Every modelled sample is shotgun metagenomics, so none of these models has been tested on amplicon data and none should be assumed to transfer to it.

**Species-level features only.** Genus-level abundances were discarded at the filtering step, so roughly half the available taxonomic signal is currently unused.

**Cross-sectional data.** There is no longitudinal component, so nothing here speaks to progression or to early detection over time.

**Unmodelled confounders.** Diet, geography, antibiotic use, and disease activity at time of sampling are all known drivers of microbiome composition and are absent from the feature set.

**cuML `class_weight` may be silently ignored.** The Random Forest results were identical weighted and unweighted, so the class-weighting conclusion holds for XGBoost only.

---

## Future Work

**1. Combine genus-level and species-level features.** The abundance table contains roughly as many genus rows (2,780,064) as species rows (2,761,207), and the genus half is currently discarded. Genus-level features are less sparse and less affected by cross-study differences in classifier reference databases, so they may carry cohort-transferable signal that species-level features lose to noise. The plan is to join both ranks into a single feature matrix and evaluate whether the added signal improves discrimination without costing accuracy on the classes that currently work.

**2. Test genus-level features on their own.** Running the same pipeline on genus data alone separates the two possibilities: whether combining ranks helps because more information is available, or whether genus is simply the better resolution for this data. Given how much of the current difficulty comes from cross-cohort variation, the coarser rank may generalise better even with less detail. Both runs use the identical evaluation protocol so the comparison is fair.

**3. More independent cohorts.** The genuine fix, and unavailable at present. More samples from the existing 12 projects would not address the constraint, since the limit is the number of independent sources rather than the number of rows.

**4. Repeated cross-validation across several seeds.** Given how far one fold reshuffle moved UC recall, a single geometry is not enough to characterise performance. Reporting a distribution over seeds would be more honest than any point estimate.

**5. Batch correction inside cross-validation.** Test batch-correction methods within each training fold, estimating all correction parameters from the training cohorts before applying them to the held-out cohorts. Fitting a correction globally, across train and test together, would leak information and reintroduce exactly the optimism this evaluation was rebuilt to remove.

**6. Lead with the binary model.** Report Crohn vs UC as the headline result and present the 3-class model with its baseline attached, rather than averaging the UC failure into a macro F1.

---

## References

- Mayo Clinic. Ulcerative Colitis vs. Crohn's Disease. https://www.mayoclinic.org
- PMC9793422, Differentiating CD from UC
- PMC8643196, Indeterminate Colitis outcomes
- PMC11241288, IBD diagnostic procedures
- PubMed 39367251, Stool sampling for IBD diagnosis
- PMC11538166, Microbiome biomarkers in healthcare
- PMC11786253, Microbiome ML challenges
- ScienceDirect S0966842X23003396, ML microbiome risk score for Crohn's prediction
