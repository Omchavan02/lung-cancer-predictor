# Technical Documentation — Lung Cancer Predictor

**Project Title**: Lung Cancer Predictor  
**System Type**: Academic Machine Learning Binary Risk Classifier  
**Primary Frameworks**: Scikit-Learn 1.5.2, FastAPI 0.115.5, Pydantic 2.12.5, Modern Vanilla Web Stack  
**Document Version**: 1.0.0 (Phase 10 Release)

---

## 1. System Overview

The **Lung Cancer Predictor** is an academic software system developed to predict lung cancer risk categories (`YES` vs `NO`) based on 15 demographic, behavioral, and clinical survey indicators. 

The architecture consists of three strictly decoupled components:
1. **Machine Learning Core**: A standardized and regularized **Logistic Regression** pipeline trained with balanced class weights on deduplicated survey data, operating with a frozen decision threshold of $\theta = 0.50$.
2. **Inference & Backend Layer**: A standalone inference engine ([`src/models/predict.py`](../src/models/predict.py)) wrapped by a **FastAPI** REST service ([`src/utils/api.py`](../src/utils/api.py)) enforcing strict schema validation (`extra='forbid'`) and CORS support.
3. **Frontend Presentation Layer**: A clean, accessible, zero-dependency HTML5/CSS3/ES6 user interface ([`frontend/`](../frontend/)) communicating asynchronously via `POST /predict`.

---

## 2. Dataset

- **Raw Data File**: `data/raw/Code3_LC.csv`
- **File Properties**: 11,280 bytes and 309 patient records (plus header).
- **Format**: Comma-Separated Values (CSV).
- **Target Variable**: `LUNG_CANCER` (`YES` = Positive Lung Cancer Diagnosis, `NO` = Negative / Control).
- **Imbalance Ratio**: 270 Positive ($87.38\%$) vs 39 Negative ($12.62\%$) in raw data ($6.92:1$ ratio).

---

## 3. Dataset Integrity & Duplicate Handling

- **Missing Values**: $0$ missing cells across all 16 columns (100% complete dataset).
- **Exact Duplicate Count**: Exactly **33 duplicate rows** identified in the raw CSV.
- **Label Conflict Audit**: **0 conflicting target labels**. Every duplicated feature vector is 100% deterministically associated with the exact same target class.
- **Deduplication Policy**: In-memory deduplication is executed prior to model splitting, reducing the dataset to **276 unique patient profiles** (238 Positive / 38 Negative, $6.26:1$ ratio).
- **Raw File Status**: the checked-in `data/raw/Code3_LC.csv` has SHA256 `5328df14d965e0edb2c8e2787c5670868660bd8fad3e7c4574d434b34792155a`.

---

## 4. Data Preprocessing

1. **Column Name Normalization**: In-memory string trimming, space-to-underscore replacement, and uppercasing.
2. **Categorical Encoding**:
   - `GENDER`: Mapped to binary scalar ($1 = \text{Male}, 0 = \text{Female}$).
   - `LUNG_CANCER`: Mapped to binary target ($1 = \text{YES}, 0 = \text{NO}$).
3. **Continuous Feature Standardization**:
   - `AGE` along with all survey features are standardized via `StandardScaler`:
     $$z_j = \frac{x_j - \mu_j}{\sigma_j}$$
   - Scaling parameters are fitted **strictly on training partitions** and frozen into inference configuration to prevent data leakage.

---

## 5. Feature Schema (15 Input Features)

```text
Index  Feature Name            Type         Accepted Values               Domain Interpretation
------------------------------------------------------------------------------------------------------------------
 1     GENDER                  Categorical  'M'/'F', 'MALE'/'FEMALE', 1/0 Biological sex of patient
 2     AGE                     Continuous   18 to 120                     Chronological age in years
 3     SMOKING                 Binary       1 (No), 2 (Yes), boolean      Tobacco smoking habit
 4     YELLOW_FINGERS          Binary       1 (No), 2 (Yes), boolean      Nicotine/tar staining on fingers
 5     ANXIETY                 Binary       1 (No), 2 (Yes), boolean      History/presence of anxiety
 6     PEER_PRESSURE           Binary       1 (No), 2 (Yes), boolean      Social exposure / peer pressure
 7     CHRONIC_DISEASE         Binary       1 (No), 2 (Yes), boolean      Pre-existing chronic health conditions
 8     FATIGUE                 Binary       1 (No), 2 (Yes), boolean      Persistent fatigue or generalized malaise
 9     ALLERGY                 Binary       1 (No), 2 (Yes), boolean      History of allergic conditions
 10    WHEEZING                Binary       1 (No), 2 (Yes), boolean      Respiratory wheezing sound
 11    ALCOHOL_CONSUMING       Binary       1 (No), 2 (Yes), boolean      Regular alcohol consumption
 12    COUGHING                Binary       1 (No), 2 (Yes), boolean      Persistent coughing symptom
 13    SHORTNESS_OF_BREATH     Binary       1 (No), 2 (Yes), boolean      Dyspnea / difficulty breathing
 14    SWALLOWING_DIFFICULTY   Binary       1 (No), 2 (Yes), boolean      Dysphagia / pain when swallowing
 15    CHEST_PAIN              Binary       1 (No), 2 (Yes), boolean      Chest pain symptom
```

---

## 6. Model Development Methodology

- **Metric Hierarchy**: Due to the severe 6.26:1 class imbalance, model selection strictly followed this hierarchy:
  1. **PR-AUC (Precision-Recall Area Under Curve / Average Precision)**
  2. **Macro F1-Score**
  3. **Minority-Class (NO) Recall**
  4. **Balanced Accuracy**
  5. **ROC-AUC**
- **Validation Protocol**: 25-fold Repeated Stratified Cross-Validation ($5\text{ splits} \times 5\text{ repeats}$, `random_state=42`) on the training partition ($n=220$).
- **Holdout Partition**: 20% Stratified Holdout Test Set ($n=56: 48\text{ YES} / 8\text{ NO}$) frozen until final verification.

---

## 7. Baseline Experiments (Phase 3 Benchmark)

Evaluated 6 standard algorithms + 1 proposed ensemble algorithm across standard, balanced, and oversampled configurations:
- Logistic Regression (Standard, Balanced, Oversampled)
- K-Nearest Neighbors (KNN: Standard, Oversampled)
- Decision Tree (Standard, Balanced)
- Random Forest (Standard, Balanced, Balanced Subsample)
- Support Vector Machine (SVM RBF: Standard, Balanced)
- Gradient Boosting (Standard, Oversampled)
- Extra Trees (Standard, Balanced)
- Naive Majority Dummy Baseline

---

## 8. Hyperparameter Tuning (Phase 4 Grid Search)

Tuning was conducted exclusively on the 80% training partition ($n=220$) via 5-fold cross-validation optimizing on Average Precision (PR-AUC):

1. **Logistic Regression**:
   - Optimal: `C=0.1`, `solver='lbfgs'`, `class_weight='balanced'`.
   - Result: L2 regularization stabilized coefficients and improved generalization.
2. **Extra Trees Classifier**:
   - Optimal: `n_estimators=100`, `max_depth=5`, `min_samples_split=4`, `min_samples_leaf=2`, `max_features='sqrt'`, `class_weight='balanced'`.
   - Result: Constraining tree depth to 5 prevented overfitting to small clusters.
3. **Random Forest Classifier**:
   - Optimal: `n_estimators=100`, `max_depth=4`, `min_samples_split=4`, `min_samples_leaf=2`, `max_features='sqrt'`, `class_weight='balanced'`.

---

## 9. Repeated Stratified Cross-Validation Results (25 Folds)

```text
Model Configuration                     CV PR-AUC       CV ROC-AUC      CV Macro F1     CV Bal Acc      CV Min Recall (NO)
--------------------------------------------------------------------------------------------------------------------------
Extra Trees (Tuned max_depth=5)         0.958 ± 0.033   0.889 ± 0.078   0.762 ± 0.089   0.754 ± 0.083   0.573 ± 0.160
Logistic Regression (Tuned C=0.1)       0.943 ± 0.041   0.873 ± 0.086   0.765 ± 0.091   0.766 ± 0.092   0.633 ± 0.180
Random Forest (Tuned max_depth=4)       0.955 ± 0.035   0.885 ± 0.079   0.751 ± 0.094   0.744 ± 0.090   0.547 ± 0.174
Majority Dummy Baseline                 0.864 ± 0.007   0.500 ± 0.000   0.464 ± 0.002   0.500 ± 0.000   0.000 ± 0.000
```
*(All $\pm$ values represent standard deviation across repeated CV folds).*

---

## 10. Out-of-Fold Threshold Analysis

Sweep of decision thresholds $\theta \in [0.30, 0.70]$ evaluated on training Out-of-Fold predictions:
- For Logistic Regression (Balanced), $\theta = 0.50$ produced optimal Macro F1 ($0.7645$), Balanced Accuracy ($0.7658$), and Minority Recall ($0.6333$).
- The default $\theta = 0.50$ threshold was confirmed optimal when combined with `class_weight='balanced'`.

---

## 11. Final Model Selection

- **Selected Final Production Model**: **Logistic Regression (Balanced, $C=0.1$)**
  - **Rationale**: Delivers the highest minority-class recall ($0.633 \pm 0.180$ on CV, $0.7500$ on holdout), highest balanced accuracy ($0.766 \pm 0.092$ on CV, $0.8438$ on holdout), and direct interpretability via odds ratios.
- **Selected Benchmark Model**: **Extra Trees (Balanced, $\text{depth}=5$)**
  - **Role**: Retained as probability ranking and calibration benchmark ($0.958 \pm 0.033$ CV PR-AUC).

---

## 12. Final Holdout Test Set Evaluation ($n=56$)

| Metric | Logistic Regression (Production) | Extra Trees (Benchmark) |
| :--- | :---: | :---: |
| **Accuracy** | **0.9107** ($51/56$) | **0.9107** ($51/56$) |
| **Balanced Accuracy** | **0.8438** | 0.8021 |
| **Macro F1-Score** | **0.8354** | 0.8095 |
| **Minority (NO) Recall** | **0.7500** ($6/8$) | 0.6250 ($5/8$) |
| **Minority (NO) Precision** | 0.6667 ($6/9$) | **0.7143** ($5/7$) |
| **Minority (NO) F1-Score** | **0.7059** | 0.6667 |
| **Majority (YES) Recall** | 0.9375 ($45/48$) | **0.9583** ($46/48$) |
| **Majority (YES) Precision**| **0.9574** ($45/47$) | 0.9388 ($46/49$) |
| **ROC-AUC** | 0.8672 | **0.8750** |
| **PR-AUC (Average Precision)** | 0.9392 | **0.9425** |
| **Confusion Matrix** | $\text{TN}=6, \text{FP}=2, \text{FN}=3, \text{TP}=45$ | $\text{TN}=5, \text{FP}=3, \text{FN}=2, \text{TP}=46$ |

---

## 13. Model Interpretability (Standardized Coefficients & Odds Ratios)

Log-odds equation:
$$\text{logit}(P) = \beta_0 + \sum_{j=1}^{15} \beta_j \left(\frac{x_j - \mu_j}{\sigma_j}\right)$$

Where $\beta_0 = +0.8142$ (Intercept) and feature weights are:

```text
Rank  Feature                Standardized Coef (β)   Odds Ratio exp(β)   Training Mean (μ)  Training Std (σ)
------------------------------------------------------------------------------------------------------------
 1    ALLERGY                +0.5214                 1.6844              1.5591             0.4965
 2    ALCOHOL_CONSUMING      +0.4821                 1.6195              1.5727             0.4947
 3    SWALLOWING_DIFFICULTY  +0.4533                 1.5735              1.4591             0.4983
 4    WHEEZING               +0.4312                 1.5391              1.5455             0.4979
 5    COUGHING               +0.3927                 1.4810              1.5727             0.4947
 6    CHEST_PAIN             +0.3218                 1.3796              1.5545             0.4970
 7    PEER_PRESSURE          +0.3105                 1.3641              1.5045             0.4999
 8    YELLOW_FINGERS         +0.3012                 1.3515              1.5682             0.4953
 9    FATIGUE                +0.2514                 1.2858              1.6727             0.4692
10    ANXIETY                +0.2318                 1.2609              1.5000             0.5000
11    CHRONIC_DISEASE        +0.1824                 1.2001              1.5091             0.4999
12    AGE                    +0.1512                 1.1632              62.9182            8.2415
13    GENDER (Male=1)        +0.1124                 1.1190              0.5227             0.4995
14    SMOKING                +0.0841                 1.0877              1.5636             0.4959
15    SHORTNESS_OF_BREATH    +0.0712                 1.0738              1.6364             0.4810
```

---

## 14. Model Serialization & Artifacts

- **Model Metadata**: `models/model_metadata.json` (Stores frozen weights, intercept, feature means, stds, schema, threshold, and training metrics).
- **Evaluation Report**: `reports/final_model_evaluation.json` (Stores complete classification reports and confusion matrices).

---

## 15. Inference Layer (`src/models/predict.py`)

- **Class**: `LungCancerPredictor`
- **Functions**: `validate_and_transform_inputs()`, `predict_proba()`, `predict()`
- **Guarantees**:
  - Enforces strict input validation (raises `ValidationError` on missing or out-of-domain features).
  - Preserves exact feature ordering (`FEATURE_ORDER`).
  - Computes exact probabilities deterministically.
  - Applies frozen threshold $\theta = 0.50$.

---

## 16. Backend API Layer (`src/utils/api.py`)

- **Framework**: FastAPI with Pydantic v2 request validation.
- **Endpoints**:
  - `GET /health`: Health status.
  - `GET /model-info`: Frozen model metadata and schema.
  - `POST /predict`: Main prediction endpoint.
  - `GET /`: Serves static frontend assets.

---

## 17. Frontend Architecture (`frontend/`)

- **Technology**: Native HTML5, Accessible Vanilla CSS3 (Grid + Flexbox), ES6 JavaScript.
- **Files**:
  - `frontend/index.html`: Form structure, 15 inputs, result card, disclaimer.
  - `frontend/styles.css`: Responsive, high-contrast, accessible styling.
  - `frontend/app.js`: Form submission, client validation, async fetch client.
  - `frontend/config.js`: Centralized endpoint configuration.

---

## 18. End-to-End Data Flow

```text
Form Input -> Client Validation -> POST /predict -> FastAPI Schema Check -> Inference Engine -> Standardize -> Logit Scoring -> Sigmoid -> Threshold -> JSON Response -> UI Card Render
```

---

## 19. Validation and Testing

- **Inference Unit Suite** (`src/evaluation/verify_inference.py`): 6 tests (Positive case, Negative case, 100-iteration determinism, key shuffling, error handling, dataset hash).
- **Backend API Suite** (`tests/test_api.py`): 11 tests (All endpoints, 422 validations, idempotency, dataset hash).
- **Frontend Integration Suite** (`tests/test_frontend_integration.py`): 5 tests (Static asset delivery, Test A profile, Test B profile, boundary errors, dataset hash).
- **Total Tests Passed**: **22 / 22 Tests (100% Green)**.

---

## 20. Security & Robustness Measures

- No hardcoded credentials, API keys, or private tokens.
- No `eval()` or `exec()` execution.
- No untrusted pickle/joblib deserialization from client payloads.
- Pydantic models configured with `extra='forbid'`.
- Safe DOM updates via `.textContent` (no `innerHTML` injection).

---

## 21. Reproducibility

The entire pipeline is deterministic and reproducible using `random_state=42` and the declared dependencies in `requirements.txt`.

---

## 22. Limitations

1. **Small Sample Size for Healthy Controls**: 38 unique negative records in total.
2. **Survey Data Bias**: Self-reported responses are subject to recall inaccuracies.
3. **Correlation vs Causation**: Survey correlations do not imply clinical causality.

---

## 23. Academic Safety Disclaimer

**This software is developed strictly for academic and educational demonstration purposes. It is NOT a medical device, diagnostic test, or clinical guideline. It must never be used for clinical decision-making or patient diagnosis.**
