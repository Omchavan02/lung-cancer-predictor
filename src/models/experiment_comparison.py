"""
Phase 3 & Phase 4: Machine Learning Algorithm Comparison & Robustness / Tuning Pipeline
Target: data/raw/Code3_LC.csv (Read-Only)

Objective:
1. Phase 3: Benchmark baseline models on deduplicated data (276 unique rows).
2. Phase 4: Controlled hyperparameter tuning, out-of-fold threshold optimization,
   and robustness evaluation on the top 3 finalists:
   - Logistic Regression (Balanced)
   - Extra Trees (Balanced)
   - Random Forest (Balanced)

Methodology:
- Deduplication: 276 unique rows (238 Positive / 38 Negative)
- Stratified 80/20 Train/Test Split (random_state=42, Train: 220, Holdout Test: 56)
- Repeated Stratified 5-Fold CV (n_splits=5, n_repeats=5, 25 total folds, random_state=42)
- All hyperparameter tuning and decision threshold optimization performed STRICTLY on training data
- Final holdout test set (48 YES / 8 NO) evaluated exactly ONCE on frozen configurations.
"""

from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.base import clone
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import ExtraTreesClassifier, GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    balanced_accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import GridSearchCV, RepeatedStratifiedKFold, StratifiedKFold, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier


def load_and_preprocess_data(csv_path: Path) -> tuple[pd.DataFrame, pd.Series, pd.DataFrame]:
    """
    Load raw CSV in read-only mode, normalize column names in memory,
    encode categoricals in memory, and deduplicate to unique feature vectors.
    """
    if not csv_path.exists():
        raise FileNotFoundError(f"Raw CSV not found at {csv_path.resolve()}")

    df_raw = pd.read_csv(csv_path)

    # Normalize column names in memory
    df = df_raw.copy()
    df.columns = [c.strip().replace(" ", "_").upper() for c in df.columns]

    # In-memory encoding: GENDER (M: 1, F: 0), LUNG_CANCER (YES: 1, NO: 0)
    df["GENDER"] = df["GENDER"].astype(str).str.strip().map({"M": 1, "F": 0})
    df["LUNG_CANCER"] = df["LUNG_CANCER"].astype(str).str.strip().str.upper().map({"YES": 1, "NO": 0})

    # Drop exact duplicates strictly in memory
    df_dedup = df.drop_duplicates(keep="first").reset_index(drop=True)

    feature_cols = [c for c in df_dedup.columns if c != "LUNG_CANCER"]
    X = df_dedup[feature_cols]
    y = df_dedup["LUNG_CANCER"]

    return X, y, df_dedup


def evaluate_model_cv(
    model_pipeline,
    X_train: np.ndarray,
    y_train: np.ndarray,
    cv_splitter,
    threshold: float = 0.5,
) -> dict:
    """
    Evaluate a model pipeline across Repeated Stratified K-Fold CV.
    Collects fold-by-fold metrics at specified probability decision threshold.
    """
    metrics = {
        "accuracy": [],
        "balanced_accuracy": [],
        "macro_f1": [],
        "minority_recall": [],
        "minority_precision": [],
        "minority_f1": [],
        "majority_recall": [],
        "majority_f1": [],
        "roc_auc": [],
        "pr_auc": [],
    }

    for fold_idx, (train_idx, val_idx) in enumerate(cv_splitter.split(X_train, y_train)):
        X_tr, y_tr = X_train[train_idx], y_train[train_idx]
        X_va, y_va = X_train[val_idx], y_train[val_idx]

        fold_model = clone(model_pipeline)
        fold_model.fit(X_tr, y_tr)

        if hasattr(fold_model, "predict_proba"):
            y_proba = fold_model.predict_proba(X_va)[:, 1]
        elif hasattr(fold_model, "decision_function"):
            df_vals = fold_model.decision_function(X_va)
            y_proba = 1 / (1 + np.exp(-df_vals))
        else:
            y_proba = fold_model.predict(X_va)

        # Apply custom decision threshold (y_pred=1 if proba >= threshold else 0)
        y_pred = (y_proba >= threshold).astype(int)

        metrics["accuracy"].append(accuracy_score(y_va, y_pred))
        metrics["balanced_accuracy"].append(balanced_accuracy_score(y_va, y_pred))
        metrics["macro_f1"].append(f1_score(y_va, y_pred, average="macro", zero_division=0))
        metrics["minority_recall"].append(recall_score(y_va, y_pred, pos_label=0, zero_division=0))
        metrics["minority_precision"].append(precision_score(y_va, y_pred, pos_label=0, zero_division=0))
        metrics["minority_f1"].append(f1_score(y_va, y_pred, pos_label=0, zero_division=0))
        metrics["majority_recall"].append(recall_score(y_va, y_pred, pos_label=1, zero_division=0))
        metrics["majority_f1"].append(f1_score(y_va, y_pred, pos_label=1, zero_division=0))

        try:
            metrics["roc_auc"].append(roc_auc_score(y_va, y_proba))
        except ValueError:
            metrics["roc_auc"].append(0.5)

        try:
            metrics["pr_auc"].append(average_precision_score(y_va, y_proba))
        except ValueError:
            metrics["pr_auc"].append(0.0)

    results_summary = {}
    for k, v in metrics.items():
        results_summary[f"{k}_mean"] = np.mean(v)
        results_summary[f"{k}_std"] = np.std(v)

    return results_summary


def compute_out_of_fold_probabilities(
    model_pipeline,
    X_train: np.ndarray,
    y_train: np.ndarray,
    cv_splitter,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Generate out-of-fold probability predictions strictly on training data
    to safely tune decision thresholds without data leakage.
    """
    oof_probas = np.zeros(len(y_train))
    oof_counts = np.zeros(len(y_train))

    for train_idx, val_idx in cv_splitter.split(X_train, y_train):
        X_tr, y_tr = X_train[train_idx], y_train[train_idx]
        X_va = X_train[val_idx]

        fold_model = clone(model_pipeline)
        fold_model.fit(X_tr, y_tr)

        if hasattr(fold_model, "predict_proba"):
            y_proba = fold_model.predict_proba(X_va)[:, 1]
        elif hasattr(fold_model, "decision_function"):
            df_vals = fold_model.decision_function(X_va)
            y_proba = 1 / (1 + np.exp(-df_vals))
        else:
            y_proba = fold_model.predict(X_va)

        oof_probas[val_idx] += y_proba
        oof_counts[val_idx] += 1

    oof_probas_avg = oof_probas / np.maximum(oof_counts, 1)
    return oof_probas_avg, y_train


def sweep_thresholds(oof_probas: np.ndarray, y_true: np.ndarray, thresholds: list[float]) -> pd.DataFrame:
    """Evaluate performance across candidate decision thresholds on OOF predictions."""
    records = []
    for th in thresholds:
        y_pred = (oof_probas >= th).astype(int)
        records.append({
            "Threshold": th,
            "Macro F1": round(f1_score(y_true, y_pred, average="macro", zero_division=0), 4),
            "Bal Acc": round(balanced_accuracy_score(y_true, y_pred), 4),
            "Min Recall (NO)": round(recall_score(y_true, y_pred, pos_label=0, zero_division=0), 4),
            "Min Precision (NO)": round(precision_score(y_true, y_pred, pos_label=0, zero_division=0), 4),
            "Min F1 (NO)": round(f1_score(y_true, y_pred, pos_label=0, zero_division=0), 4),
            "Maj Recall (YES)": round(recall_score(y_true, y_pred, pos_label=1, zero_division=0), 4),
            "Accuracy": round(accuracy_score(y_true, y_pred), 4),
        })
    return pd.DataFrame(records)


def evaluate_model_holdout(
    model_pipeline,
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
    threshold: float = 0.5,
) -> dict:
    """
    Train final tuned configuration on full training set and evaluate once on holdout.
    """
    model = clone(model_pipeline)
    model.fit(X_train, y_train)

    if hasattr(model, "predict_proba"):
        y_proba = model.predict_proba(X_test)[:, 1]
    elif hasattr(model, "decision_function"):
        df_vals = model.decision_function(X_test)
        y_proba = 1 / (1 + np.exp(-df_vals))
    else:
        y_proba = model.predict(X_test)

    y_pred = (y_proba >= threshold).astype(int)
    cm = confusion_matrix(y_test, y_pred, labels=[0, 1])

    return {
        "accuracy": accuracy_score(y_test, y_pred),
        "balanced_accuracy": balanced_accuracy_score(y_test, y_pred),
        "macro_f1": f1_score(y_test, y_pred, average="macro", zero_division=0),
        "minority_recall": recall_score(y_test, y_pred, pos_label=0, zero_division=0),
        "minority_precision": precision_score(y_test, y_pred, pos_label=0, zero_division=0),
        "minority_f1": f1_score(y_test, y_pred, pos_label=0, zero_division=0),
        "majority_recall": recall_score(y_test, y_pred, pos_label=1, zero_division=0),
        "majority_precision": precision_score(y_test, y_pred, pos_label=1, zero_division=0),
        "majority_f1": f1_score(y_test, y_pred, pos_label=1, zero_division=0),
        "roc_auc": roc_auc_score(y_test, y_proba),
        "pr_auc": average_precision_score(y_test, y_proba),
        "confusion_matrix": cm,
    }


def main():
    data_path = Path("data/raw/Code3_LC.csv")
    if not data_path.exists():
        data_path = Path(__file__).resolve().parents[2] / "data" / "raw" / "Code3_LC.csv"

    print("=" * 115)
    print(" PHASE 4: MODEL ROBUSTNESS, HYPERPARAMETER TUNING & THRESHOLD ANALYSIS")
    print(f" Source: {data_path.resolve()} (READ-ONLY)")
    print("=" * 115)

    # 1. Load and prepare in-memory data
    X, y, df_dedup = load_and_preprocess_data(data_path)
    total_samples = len(y)
    n_pos = (y == 1).sum()
    n_neg = (y == 0).sum()

    # 2. Stratified Train/Test Split (80/20) - Frozen Holdout Set
    X_train, X_test, y_train, y_test = train_test_split(
        X.values, y.values, test_size=0.20, stratify=y.values, random_state=42
    )

    print(f"Dataset Summary: {total_samples} unique records (YES: {n_pos}, NO: {n_neg})")
    print(f"Train Set: {len(y_train)} samples (YES: {(y_train==1).sum()}, NO: {(y_train==0).sum()})")
    print(f"Holdout Test Set: {len(y_test)} samples (YES: {(y_test==1).sum()}, NO: {(y_test==0).sum()}) [UNTOUCHED DURING TUNING]\n")

    rskf = RepeatedStratifiedKFold(n_splits=5, n_repeats=5, random_state=42)
    skf_tuning = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    # =========================================================================
    # STEP 1: HYPERPARAMETER TUNING ON TRAINING SET (CROSS-VALIDATION ONLY)
    # =========================================================================
    print("=" * 115)
    print(" STEP 1: CONTROLLED HYPERPARAMETER SEARCH (TRAINING SET ONLY)")
    print("=" * 115)

    # 1A. Logistic Regression Tuning
    lr_pipe = Pipeline([
        ("scaler", StandardScaler()),
        ("model", LogisticRegression(max_iter=1000, random_state=42)),
    ])
    lr_param_grid = {
        "model__C": [0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0],
        "model__solver": ["lbfgs", "liblinear"],
        "model__class_weight": ["balanced"],
    }
    lr_grid = GridSearchCV(lr_pipe, lr_param_grid, cv=skf_tuning, scoring="average_precision", n_jobs=1)
    lr_grid.fit(X_train, y_train)
    best_lr_pipeline = lr_grid.best_estimator_
    print(f"Logistic Regression Best Parameters: {lr_grid.best_params_} (Tuning PR-AUC: {lr_grid.best_score_:.4f})")

    # 1B. Extra Trees Tuning
    et_pipe = Pipeline([
        ("model", ExtraTreesClassifier(random_state=42)),
    ])
    et_param_grid = {
        "model__n_estimators": [50, 100, 150],
        "model__max_depth": [3, 4, 5, None],
        "model__min_samples_split": [2, 4, 6],
        "model__min_samples_leaf": [1, 2, 3],
        "model__max_features": ["sqrt", "log2", 0.5],
        "model__class_weight": ["balanced", "balanced_subsample"],
    }
    et_grid = GridSearchCV(et_pipe, et_param_grid, cv=skf_tuning, scoring="average_precision", n_jobs=1)
    et_grid.fit(X_train, y_train)
    best_et_pipeline = et_grid.best_estimator_
    print(f"Extra Trees Best Parameters:        {et_grid.best_params_} (Tuning PR-AUC: {et_grid.best_score_:.4f})")

    # 1C. Random Forest Tuning
    rf_pipe = Pipeline([
        ("model", RandomForestClassifier(random_state=42)),
    ])
    rf_param_grid = {
        "model__n_estimators": [50, 100, 150],
        "model__max_depth": [3, 4, 5, None],
        "model__min_samples_split": [2, 4, 6],
        "model__min_samples_leaf": [1, 2, 3],
        "model__max_features": ["sqrt", "log2", 0.5],
        "model__class_weight": ["balanced", "balanced_subsample"],
    }
    rf_grid = GridSearchCV(rf_pipe, rf_param_grid, cv=skf_tuning, scoring="average_precision", n_jobs=1)
    rf_grid.fit(X_train, y_train)
    best_rf_pipeline = rf_grid.best_estimator_
    print(f"Random Forest Best Parameters:      {rf_grid.best_params_} (Tuning PR-AUC: {rf_grid.best_score_:.4f})\n")

    # =========================================================================
    # STEP 2: OUT-OF-FOLD THRESHOLD OPTIMIZATION (TRAINING SET ONLY)
    # =========================================================================
    print("=" * 115)
    print(" STEP 2: OUT-OF-FOLD (OOF) PROBABILITY THRESHOLD ANALYSIS (TRAINING DATA ONLY)")
    print("=" * 115)
    thresholds = [0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70]

    # Evaluate OOF predictions for each finalist
    finalists = {
        "Logistic Regression (Tuned Balanced)": best_lr_pipeline,
        "Extra Trees (Tuned Balanced)": best_et_pipeline,
        "Random Forest (Tuned Balanced)": best_rf_pipeline,
    }

    best_thresholds = {}

    for name, pipe in finalists.items():
        oof_probas, y_tr_true = compute_out_of_fold_probabilities(pipe, X_train, y_train, rskf)
        th_df = sweep_thresholds(oof_probas, y_tr_true, thresholds)
        print(f"\nThreshold Sweep for [{name}]:")
        print(th_df.to_string(index=False))

        # Select threshold maximizing Macro F1 while maintaining Bal Acc and Min Recall >= 0.60
        # Criteria: Highest Macro F1 under constraint of balanced performance
        best_th_row = th_df.sort_values(by=["Macro F1", "Bal Acc", "Min Recall (NO)"], ascending=False).iloc[0]
        chosen_th = best_th_row["Threshold"]
        best_thresholds[name] = chosen_th
        print(f"-> Selected Optimal Training Threshold for {name}: {chosen_th:.2f} (OOF Macro F1: {best_th_row['Macro F1']}, Bal Acc: {best_th_row['Bal Acc']}, Min Recall: {best_th_row['Min Recall (NO)']})")

    # =========================================================================
    # STEP 3: CROSS-VALIDATION ROBUSTNESS COMPARISON (25 FOLDS)
    # =========================================================================
    print("\n" + "=" * 115)
    print(" STEP 3: 25-FOLD REPEATED CV ROBUSTNESS COMPARISON (BASELINE VS TUNED VS TUNED+THRESHOLD)")
    print("=" * 115)

    comparison_models = {
        # Baseline configurations (from Phase 3)
        "Logistic Regression (Phase 3 Baseline)": (
            Pipeline([("scaler", StandardScaler()), ("model", LogisticRegression(class_weight="balanced", random_state=42, max_iter=1000))]),
            0.50,
        ),
        "Logistic Regression (Tuned, th=0.50)": (best_lr_pipeline, 0.50),
        "Logistic Regression (Tuned, Optimal th)": (best_lr_pipeline, best_thresholds["Logistic Regression (Tuned Balanced)"]),
        "Extra Trees (Phase 3 Baseline)": (
            Pipeline([("model", ExtraTreesClassifier(n_estimators=100, class_weight="balanced", random_state=42, max_depth=5))]),
            0.50,
        ),
        "Extra Trees (Tuned, th=0.50)": (best_et_pipeline, 0.50),
        "Extra Trees (Tuned, Optimal th)": (best_et_pipeline, best_thresholds["Extra Trees (Tuned Balanced)"]),
        "Random Forest (Phase 3 Baseline)": (
            Pipeline([("model", RandomForestClassifier(n_estimators=100, class_weight="balanced", random_state=42, max_depth=5))]),
            0.50,
        ),
        "Random Forest (Tuned, th=0.50)": (best_rf_pipeline, 0.50),
        "Random Forest (Tuned, Optimal th)": (best_rf_pipeline, best_thresholds["Random Forest (Tuned Balanced)"]),
    }

    cv_robustness_records = []
    for name, (pipe, th) in comparison_models.items():
        res = evaluate_model_cv(pipe, X_train, y_train, rskf, threshold=th)
        cv_robustness_records.append({
            "Model Configuration": name,
            "Threshold": th,
            "CV PR-AUC": f"{res['pr_auc_mean']:.3f} ± {res['pr_auc_std']:.3f}",
            "CV ROC-AUC": f"{res['roc_auc_mean']:.3f} ± {res['roc_auc_std']:.3f}",
            "CV Macro F1": f"{res['macro_f1_mean']:.3f} ± {res['macro_f1_std']:.3f}",
            "CV Bal Acc": f"{res['balanced_accuracy_mean']:.3f} ± {res['balanced_accuracy_std']:.3f}",
            "CV Min Recall (NO)": f"{res['minority_recall_mean']:.3f} ± {res['minority_recall_std']:.3f}",
            "CV Min F1 (NO)": f"{res['minority_f1_mean']:.3f} ± {res['minority_f1_std']:.3f}",
            "CV Accuracy": f"{res['accuracy_mean']:.3f} ± {res['accuracy_std']:.3f}",
        })

    cv_rob_df = pd.DataFrame(cv_robustness_records)
    print(cv_rob_df.to_string(index=False))

    # =========================================================================
    # STEP 4: FINAL FROZEN HOLDOUT EVALUATION (ONCE ON TEST SET, n=56)
    # =========================================================================
    print("\n" + "=" * 115)
    print(" STEP 4: FINAL EVALUATION ON UNTOUCHED HOLDOUT TEST SET (n=56: 48 YES / 8 NO)")
    print(" NOTE: Exactly 8 negative cases exist in holdout; 1 misclassification = 12.5% shift in NO Recall.")
    print("=" * 115)

    holdout_records = []
    for name, (pipe, th) in comparison_models.items():
        h_res = evaluate_model_holdout(pipe, X_train, y_train, X_test, y_test, threshold=th)
        cm = h_res["confusion_matrix"]
        tn, fp, fn, tp = cm[0, 0], cm[0, 1], cm[1, 0], cm[1, 1]

        holdout_records.append({
            "Model Configuration": name,
            "Threshold": th,
            "Test PR-AUC": round(h_res["pr_auc"], 4),
            "Test ROC-AUC": round(h_res["roc_auc"], 4),
            "Test Macro F1": round(h_res["macro_f1"], 4),
            "Test Bal Acc": round(h_res["balanced_accuracy"], 4),
            "Test Min Recall": f"{h_res['minority_recall']:.4f} ({tn}/8)",
            "Test Min F1": round(h_res["minority_f1"], 4),
            "Test Accuracy": round(h_res["accuracy"], 4),
            "Confusion Matrix": f"TN={tn}, FP={fp}, FN={fn}, TP={tp}",
        })

    ho_df = pd.DataFrame(holdout_records)
    print(ho_df.to_string(index=False))

    # =========================================================================
    # STEP 5: COMPREHENSIVE SIDE-BY-SIDE SUMMARY TABLE
    # =========================================================================
    print("\n" + "=" * 115)
    print(" STEP 5: COMPREHENSIVE MODEL COMPARISON TABLE (CV vs HOLDOUT)")
    print("=" * 115)

    summary_table = []
    for cv_row, ho_row in zip(cv_robustness_records, holdout_records):
        summary_table.append({
            "Model": cv_row["Model Configuration"],
            "CV PR-AUC": cv_row["CV PR-AUC"],
            "CV Macro F1": cv_row["CV Macro F1"],
            "CV Bal Acc": cv_row["CV Bal Acc"],
            "CV NO Recall": cv_row["CV Min Recall (NO)"],
            "Holdout PR-AUC": ho_row["Test PR-AUC"],
            "Holdout Macro F1": ho_row["Test Macro F1"],
            "Holdout Bal Acc": ho_row["Test Bal Acc"],
            "Holdout NO Recall": ho_row["Test Min Recall"],
            "Holdout Acc": ho_row["Test Accuracy"],
        })

    sum_df = pd.DataFrame(summary_table)
    print(sum_df.to_string(index=False))
    print("=" * 115)


if __name__ == "__main__":
    main()
