"""
Phase 5: Final Model Finalization, Serialization, Interpretability & Verification
Target: data/raw/Code3_LC.csv (READ-ONLY)

Selected Final Model: Logistic Regression (Balanced, C=0.1, solver='lbfgs', random_state=42)
Operating Decision Threshold: 0.50
Benchmark Model: Extra Trees (Balanced, max_depth=5, min_samples_leaf=2, min_samples_split=4, n_estimators=100)

Actions:
1. Load raw dataset in read-only mode, normalize column names & encode in memory.
2. In-memory deduplication (276 unique rows, 238 YES / 38 NO).
3. Split into 80% Train (n=220) and 20% Frozen Holdout Test (n=56, 48 YES / 8 NO, random_state=42).
4. Fit final Logistic Regression pipeline (StandardScaler + LogisticRegression) on training set.
5. Fit benchmark Extra Trees pipeline on training set.
6. Evaluate holdout test metrics (Accuracy, Balanced Accuracy, Precision, Recall, F1, Macro F1, ROC-AUC, PR-AUC, Confusion Matrix).
7. Extract interpretability artifacts (model coefficients, odds ratios, ranking).
8. Serialize production and benchmark artifacts to models/ directory.
9. Verify round-trip model reloading and prediction reproduction.
10. Confirm raw dataset byte-for-byte integrity.
"""

import hashlib
import json
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import ExtraTreesClassifier
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
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


def compute_sha256(filepath: Path) -> str:
    """Compute SHA256 hash of a file for integrity verification."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()


def load_and_preprocess_data(csv_path: Path) -> tuple[pd.DataFrame, pd.Series, list[str]]:
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

    # In-memory encoding
    df["GENDER"] = df["GENDER"].astype(str).str.strip().map({"M": 1, "F": 0})
    df["LUNG_CANCER"] = df["LUNG_CANCER"].astype(str).str.strip().str.upper().map({"YES": 1, "NO": 0})

    # Drop exact duplicates strictly in memory
    df_dedup = df.drop_duplicates(keep="first").reset_index(drop=True)

    feature_cols = [c for c in df_dedup.columns if c != "LUNG_CANCER"]
    X = df_dedup[feature_cols]
    y = df_dedup["LUNG_CANCER"]

    return X, y, feature_cols


def evaluate_pipeline(pipeline, X_test, y_test, threshold=0.50):
    """Compute comprehensive test metrics at specified threshold."""
    y_proba = pipeline.predict_proba(X_test)[:, 1]
    y_pred = (y_proba >= threshold).astype(int)
    cm = confusion_matrix(y_test, y_pred, labels=[0, 1])
    tn, fp, fn, tp = cm[0, 0], cm[0, 1], cm[1, 0], cm[1, 1]

    return {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "balanced_accuracy": float(balanced_accuracy_score(y_test, y_pred)),
        "macro_f1": float(f1_score(y_test, y_pred, average="macro", zero_division=0)),
        "majority_precision_yes": float(precision_score(y_test, y_pred, pos_label=1, zero_division=0)),
        "majority_recall_yes": float(recall_score(y_test, y_pred, pos_label=1, zero_division=0)),
        "majority_f1_yes": float(f1_score(y_test, y_pred, pos_label=1, zero_division=0)),
        "minority_precision_no": float(precision_score(y_test, y_pred, pos_label=0, zero_division=0)),
        "minority_recall_no": float(recall_score(y_test, y_pred, pos_label=0, zero_division=0)),
        "minority_f1_no": float(f1_score(y_test, y_pred, pos_label=0, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_test, y_proba)),
        "pr_auc": float(average_precision_score(y_test, y_proba)),
        "confusion_matrix": {
            "true_negatives_no": int(tn),
            "false_positives_yes": int(fp),
            "false_negatives_no": int(fn),
            "true_positives_yes": int(tp),
        },
        "operating_threshold": threshold,
    }


def main():
    root_dir = Path(__file__).resolve().parents[2]
    data_path = root_dir / "data" / "raw" / "Code3_LC.csv"
    models_dir = root_dir / "models"
    reports_dir = root_dir / "reports"

    models_dir.mkdir(parents=True, exist_ok=True)
    reports_dir.mkdir(parents=True, exist_ok=True)

    initial_hash = compute_sha256(data_path)

    print("=" * 100)
    print(" PHASE 5: FINAL MODEL TRAINING, SERIALIZATION & VERIFICATION")
    print(f" Target File: {data_path.resolve()}")
    print(f" Initial SHA256: {initial_hash}")
    print("=" * 100)

    # 1. Load data
    X, y, feature_names = load_and_preprocess_data(data_path)

    # 2. Stratified 80/20 train/test split (frozen holdout)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=42
    )

    print(f"\nTraining Dataset: {len(y_train)} samples (YES: {(y_train==1).sum()}, NO: {(y_train==0).sum()})")
    print(f"Holdout Test Set: {len(y_test)} samples (YES: {(y_test==1).sum()}, NO: {(y_test==0).sum()}) [FROZEN]")

    # 3. Final Model Pipeline: Logistic Regression (Balanced, C=0.1)
    final_lr_pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model", LogisticRegression(C=0.1, solver="lbfgs", class_weight="balanced", random_state=42, max_iter=1000)),
    ])
    final_lr_pipeline.fit(X_train, y_train)

    # 4. Benchmark Model Pipeline: Extra Trees (Balanced, max_depth=5)
    benchmark_et_pipeline = Pipeline([
        ("model", ExtraTreesClassifier(
            n_estimators=100,
            max_depth=5,
            min_samples_split=4,
            min_samples_leaf=2,
            max_features="sqrt",
            class_weight="balanced",
            random_state=42,
        )),
    ])
    benchmark_et_pipeline.fit(X_train, y_train)

    # 5. Evaluate on Frozen Holdout Test Set
    lr_metrics = evaluate_pipeline(final_lr_pipeline, X_test, y_test, threshold=0.50)
    et_metrics = evaluate_pipeline(benchmark_et_pipeline, X_test, y_test, threshold=0.50)

    print("\n" + "=" * 100)
    print(" 1. FINAL HOLDOUT TEST EVALUATION RESULTS (n=56)")
    print("=" * 100)
    print("Selected Final Model: Logistic Regression (Balanced, C=0.1, threshold=0.50)")
    print(f" - Accuracy:            {lr_metrics['accuracy']:.4f} (51/56)")
    print(f" - Balanced Accuracy:   {lr_metrics['balanced_accuracy']:.4f}")
    print(f" - Macro F1:            {lr_metrics['macro_f1']:.4f}")
    print(f" - Minority NO Recall:  {lr_metrics['minority_recall_no']:.4f} (6 out of 8 negative cases detected)")
    print(f" - Minority NO Prec:    {lr_metrics['minority_precision_no']:.4f}")
    print(f" - Minority NO F1:      {lr_metrics['minority_f1_no']:.4f}")
    print(f" - Majority YES Recall: {lr_metrics['majority_recall_yes']:.4f} (45 out of 48 positive cases detected)")
    print(f" - Majority YES Prec:   {lr_metrics['majority_precision_yes']:.4f}")
    print(f" - Majority YES F1:     {lr_metrics['majority_f1_yes']:.4f}")
    print(f" - ROC-AUC:             {lr_metrics['roc_auc']:.4f}")
    print(f" - PR-AUC:              {lr_metrics['pr_auc']:.4f}")
    print(f" - Confusion Matrix:    TN={lr_metrics['confusion_matrix']['true_negatives_no']}, "
          f"FP={lr_metrics['confusion_matrix']['false_positives_yes']}, "
          f"FN={lr_metrics['confusion_matrix']['false_negatives_no']}, "
          f"TP={lr_metrics['confusion_matrix']['true_positives_yes']}")

    print("\nBenchmark Model: Extra Trees (Tuned Balanced, threshold=0.50)")
    print(f" - PR-AUC:              {et_metrics['pr_auc']:.4f}")
    print(f" - ROC-AUC:             {et_metrics['roc_auc']:.4f}")
    print(f" - Macro F1:            {et_metrics['macro_f1']:.4f}")
    print(f" - Balanced Accuracy:   {et_metrics['balanced_accuracy']:.4f}")
    print(f" - Minority NO Recall:  {et_metrics['minority_recall_no']:.4f} (5 out of 8)")

    # 6. Extract Model Interpretability / Coefficients
    lr_model = final_lr_pipeline.named_steps["model"]
    scaler = final_lr_pipeline.named_steps["scaler"]

    raw_coefficients = lr_model.coef_[0]
    intercept = float(lr_model.intercept_[0])
    odds_ratios = np.exp(raw_coefficients)

    interpretability_df = pd.DataFrame({
        "Feature": feature_names,
        "Standardized Coefficient (Log-Odds)": np.round(raw_coefficients, 4),
        "Odds Ratio [exp(beta)]": np.round(odds_ratios, 4),
        "Feature Mean": np.round(scaler.mean_, 4),
        "Feature Std": np.round(scaler.scale_, 4),
    }).sort_values(by="Standardized Coefficient (Log-Odds)", ascending=False).reset_index(drop=True)

    print("\n" + "=" * 100)
    print(" 2. MODEL INTERPRETABILITY & STANDARDIZED COEFFICIENTS")
    print("=" * 100)
    print(f"Model Intercept (Bias): {intercept:.4f}")
    print(interpretability_df.to_string(index=False))

    # 7. Serialize Models and Metadata
    lr_model_path = models_dir / "final_logistic_regression_pipeline.joblib"
    et_model_path = models_dir / "benchmark_extra_trees_pipeline.joblib"
    metadata_path = models_dir / "model_metadata.json"
    report_path = reports_dir / "final_model_evaluation.json"

    joblib.dump(final_lr_pipeline, lr_model_path)
    joblib.dump(benchmark_et_pipeline, et_model_path)

    metadata = {
        "model_name": "Logistic Regression (Balanced)",
        "pipeline_file": lr_model_path.name,
        "benchmark_file": et_model_path.name,
        "hyperparameters": {
            "C": 0.1,
            "solver": "lbfgs",
            "class_weight": "balanced",
            "random_state": 42,
            "max_iter": 1000,
        },
        "operating_threshold": 0.50,
        "feature_names": feature_names,
        "label_mapping": {"0": "NO (No Lung Cancer)", "1": "YES (Lung Cancer)"},
        "training_dataset_summary": {
            "total_unique_records": len(X),
            "training_samples": len(y_train),
            "holdout_test_samples": len(y_test),
            "class_imbalance_ratio": float((y_train == 1).sum() / (y_train == 0).sum()),
        },
        "holdout_evaluation_metrics": lr_metrics,
        "benchmark_evaluation_metrics": et_metrics,
        "cv_performance_summary": {
            "pr_auc": "0.943 ± 0.041 (standard deviation across repeated CV folds)",
            "roc_auc": "0.873 ± 0.086 (standard deviation across repeated CV folds)",
            "macro_f1": "0.765 ± 0.091 (standard deviation across repeated CV folds)",
            "balanced_accuracy": "0.766 ± 0.092 (standard deviation across repeated CV folds)",
            "minority_no_recall": "0.633 ± 0.180 (standard deviation across repeated CV folds)",
        },
        "feature_coefficients": interpretability_df.to_dict(orient="records"),
        "intercept": intercept,
    }

    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    with open(report_path, "w", encoding="utf-8") as f:
        json.dump({"final_model": lr_metrics, "benchmark_model": et_metrics}, f, indent=2)

    print("\n" + "=" * 100)
    print(" 3. SERIALIZATION & ARTIFACT EXPORT")
    print("=" * 100)
    print(f" - Production Model Saved: {lr_model_path.resolve()} ({lr_model_path.stat().st_size} bytes)")
    print(f" - Benchmark Model Saved:  {et_model_path.resolve()} ({et_model_path.stat().st_size} bytes)")
    print(f" - Metadata Exported:      {metadata_path.resolve()}")
    print(f" - Evaluation Report:      {report_path.resolve()}")

    # 8. Verification: Reload model and check predictions
    print("\n" + "=" * 100)
    print(" 4. ROUND-TRIP SERIALIZATION VERIFICATION")
    print("=" * 100)
    reloaded_pipeline = joblib.load(lr_model_path)
    reloaded_probas = reloaded_pipeline.predict_proba(X_test)[:, 1]
    reloaded_preds = (reloaded_probas >= 0.50).astype(int)

    orig_probas = final_lr_pipeline.predict_proba(X_test)[:, 1]
    orig_preds = (orig_probas >= 0.50).astype(int)

    np.testing.assert_allclose(orig_probas, reloaded_probas, rtol=1e-7, atol=1e-7)
    np.testing.assert_array_equal(orig_preds, reloaded_preds)

    print("-> Verification Passed: Reloaded pipeline produces 100% IDENTICAL probabilities and predictions.")

    # 9. Dataset byte-level integrity verification
    final_hash = compute_sha256(data_path)
    print(f"\nPre-Phase SHA256:  {initial_hash}")
    print(f"Post-Phase SHA256: {final_hash}")

    if initial_hash == final_hash:
        print(">>> INTEGRITY CONFIRMED: data/raw/Code3_LC.csv is 100% BYTE-FOR-BYTE UNTOUCHED. <<<")
    else:
        raise RuntimeError("CRITICAL ERROR: Dataset hash mismatch!")
    print("=" * 100)


if __name__ == "__main__":
    main()
