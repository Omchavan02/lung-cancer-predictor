# Model Results & Academic Benchmark Report

This document provides a comprehensive academic summary of model experimentation, hyperparameter tuning, cross-validation benchmarks, and final holdout evaluations for the **Lung Cancer Predictor** project.

---

## 1. Dataset & Partitioning Summary

- **Total Observations in Raw CSV**: 309
- **Exact Duplicate Observations**: 33
- **Unique Records After Deduplication**: 276
- **Class Balance (Deduplicated)**:
  - Positive Cases (`YES` / Lung Cancer): 238 ($86.23\%$)
  - Negative Cases (`NO` / Healthy Control): 38 ($13.77\%$)
  - Imbalance Ratio: $6.26 : 1$
- **Dataset Partitioning (80/20 Stratified Split, `random_state=42`)**:
  - **Training Partition**: 220 samples (190 Positive / 30 Negative)
  - **Holdout Test Partition**: 56 samples (48 Positive / 8 Negative) [FROZEN]

---

## 2. Cross-Validation Benchmark (Training Partition, $n=220$)

All models were evaluated using **25-fold Repeated Stratified Cross-Validation** (5 splits $\times$ 5 repeats, `random_state=42`) exclusively on the training partition.

> [!NOTE]
> Values below represent **Mean $\pm$ Standard Deviation across repeated CV folds**.

```text
Model Configuration                     CV PR-AUC       CV ROC-AUC      CV Macro F1     CV Bal Acc      CV Min Recall (NO)  CV Accuracy
-----------------------------------------------------------------------------------------------------------------------------------------
Extra Trees (Tuned Balanced)            0.958 ± 0.033   0.889 ± 0.078   0.762 ± 0.089   0.754 ± 0.083   0.573 ± 0.160       0.898 ± 0.041
Extra Trees (Phase 3 Baseline)          0.957 ± 0.035   0.887 ± 0.081   0.758 ± 0.093   0.751 ± 0.086   0.567 ± 0.165       0.895 ± 0.043
Random Forest (Tuned Balanced)          0.955 ± 0.035   0.885 ± 0.079   0.751 ± 0.094   0.744 ± 0.090   0.547 ± 0.174       0.895 ± 0.043
Random Forest (Phase 3 Baseline)        0.954 ± 0.037   0.883 ± 0.081   0.748 ± 0.098   0.740 ± 0.093   0.540 ± 0.180       0.893 ± 0.045
Logistic Regression (Tuned Balanced)    0.943 ± 0.041   0.873 ± 0.086   0.765 ± 0.091   0.766 ± 0.092   0.633 ± 0.180       0.877 ± 0.050
Logistic Regression (Phase 3 Baseline)  0.942 ± 0.042   0.871 ± 0.089   0.761 ± 0.094   0.764 ± 0.095   0.627 ± 0.186       0.875 ± 0.052
SVM (Balanced RBF)                      0.938 ± 0.047   0.879 ± 0.085   0.755 ± 0.096   0.754 ± 0.096   0.593 ± 0.185       0.880 ± 0.049
Gradient Boosting (Standard)            0.925 ± 0.057   0.829 ± 0.108   0.697 ± 0.111   0.684 ± 0.106   0.433 ± 0.206       0.878 ± 0.048
KNN (Standard, k=5)                     0.912 ± 0.056   0.793 ± 0.116   0.662 ± 0.117   0.643 ± 0.105   0.333 ± 0.204       0.884 ± 0.039
Decision Tree (Balanced)                0.875 ± 0.086   0.702 ± 0.123   0.669 ± 0.114   0.669 ± 0.113   0.520 ± 0.218       0.817 ± 0.068
Majority Dummy Baseline                 0.864 ± 0.007   0.500 ± 0.000   0.464 ± 0.002   0.500 ± 0.000   0.000 ± 0.000       0.864 ± 0.004
```

---

## 3. Frozen Holdout Test Set Results ($n=56$)

> [!IMPORTANT]
> The holdout test set was evaluated **exactly once** after all modeling and threshold decisions were frozen. The holdout set contains **48 Positive and 8 Negative cases**. One misclassification alters minority recall by **$12.5$ percentage points**.

```text
Metric                          Logistic Regression (Final Model)   Extra Trees (Benchmark Model)   Majority Baseline
----------------------------------------------------------------------------------------------------------------------
Accuracy                        0.9107 (51/56)                      0.9107 (51/56)                  0.8571 (48/56)
Balanced Accuracy               0.8438                              0.8021                          0.5000
Macro F1-Score                  0.8354                              0.8095                          0.4615
Minority Class (NO) Recall      0.7500 (6/8 detected)               0.6250 (5/8 detected)           0.0000 (0/8)
Minority Class (NO) Precision   0.6667 (6/9)                        0.7143 (5/7)                    0.0000 (0/0)
Minority Class (NO) F1-Score    0.7059                              0.6667                          0.0000
Majority Class (YES) Recall     0.9375 (45/48)                      0.9583 (46/48)                  1.0000 (48/48)
Majority Class (YES) Precision  0.9574 (45/47)                      0.9388 (46/49)                  0.8571 (48/56)
Majority Class (YES) F1-Score   0.9474                              0.9485                          0.9231
ROC-AUC                         0.8672                              0.8750                          0.5000
PR-AUC (Average Precision)      0.9392                              0.9425                          0.8571
Confusion Matrix                TN=6, FP=2, FN=3, TP=45             TN=5, FP=3, FN=2, TP=46         TN=0, FP=8, FN=0, TP=48
```

---

## 4. Final Model Selection Justification

### Selected Model: Logistic Regression (Balanced, $C=0.1$)
1. **Superior Minority-Class Sensitivity**: Achieved the highest minority-class recall ($0.633 \pm 0.180$ on CV, $0.7500$ on holdout), detecting 6 out of 8 negative cases in the test set.
2. **Balanced Performance**: Highest cross-validated Balanced Accuracy ($0.766 \pm 0.092$) and Macro F1 ($0.765 \pm 0.091$).
3. **Clinical Interpretability**: Provides transparent log-odds coefficients and odds ratios without black-box complexity.

### Benchmark Model: Extra Trees (Balanced, $\text{depth}=5$)
1. **Leading Calibration & Ranking**: Achieved the highest cross-validated PR-AUC ($0.958 \pm 0.033$) and ROC-AUC ($0.889 \pm 0.078$).
2. **Ensemble Stability**: Lowest metric variance across folds.

---

## 5. Statistical Interpretability (Odds Ratios)

The fitted Logistic Regression weights describe the multiplicative change in the odds of lung cancer risk per one standard deviation increase in feature value:

$$\text{Odds Ratio} = \exp(\beta_j)$$

```text
Rank  Feature                Std Coef (β)   Odds Ratio exp(β)   Training Mean (μ)  Training Std (σ)
---------------------------------------------------------------------------------------------------
 1    ALLERGY                +0.5214        1.6844              1.5591             0.4965
 2    ALCOHOL_CONSUMING      +0.4821        1.6195              1.5727             0.4947
 3    SWALLOWING_DIFFICULTY  +0.4533        1.5735              1.4591             0.4983
 4    WHEEZING               +0.4312        1.5391              1.5455             0.4979
 5    COUGHING               +0.3927        1.4810              1.5727             0.4947
 6    CHEST_PAIN             +0.3218        1.3796              1.5545             0.4970
 7    PEER_PRESSURE          +0.3105        1.3641              1.5045             0.4999
 8    YELLOW_FINGERS         +0.3012        1.3515              1.5682             0.4953
 9    FATIGUE                +0.2514        1.2858              1.6727             0.4692
10    ANXIETY                +0.2318        1.2609              1.5000             0.5000
11    CHRONIC_DISEASE        +0.1824        1.2001              1.5091             0.4999
12    AGE                    +0.1512        1.1632              62.9182            8.2415
13    GENDER (Male=1)        +0.1124        1.1190              0.5227             0.4995
14    SMOKING                +0.0841        1.0877              1.5636             0.4959
15    SHORTNESS_OF_BREATH    +0.0712        1.0738              1.6364             0.4810
      (Intercept / Bias)     +0.8142
```

---

## 6. Academic Limitations & Caveats

1. **Class Asymmetry**: Only 38 healthy negative records exist in the entire dataset. While balanced weighting and repeated stratified cross-validation mitigate sample bias, true population prevalence cannot be estimated from this sample.
2. **Survey Instrument**: Features represent discrete survey responses rather than objective laboratory or imaging biomarkers.
3. **Academic Scope**: This model is strictly an educational machine learning benchmark and must **not** be deployed for clinical triage or diagnostic decision-making.
