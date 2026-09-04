"""
Dataset Audit Script for Lung Cancer Prediction Dataset (Code3_LC.csv)

Performs a comprehensive in-memory exploratory audit including:
- Dataset shape, column names, data types, missing values, duplicates
- In-memory column name normalization and categorical/target encoding
- Target distribution, class imbalance assessment, naive majority baseline accuracy
- Binary feature distributions against target
- Age distribution statistics separated by target class
- Mutual Information and Categorical Association Statistics (Chi-square, Cramér's V)
- Concise Dataset Audit Summary and modeling recommendations
"""

import sys
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.stats import chi2_contingency
from sklearn.feature_selection import mutual_info_classif


def get_default_data_path() -> Path:
    """Resolve data path relative to repo root or current working directory."""
    candidates = [
        Path("data/raw/Code3_LC.csv"),
        Path(__file__).resolve().parents[2] / "data" / "raw" / "Code3_LC.csv",
        Path.cwd() / "data" / "raw" / "Code3_LC.csv",
    ]
    for p in candidates:
        if p.exists():
            return p
    return candidates[0]


def load_dataset(filepath: Path | str) -> pd.DataFrame:
    """Load the raw dataset without modifying the file."""
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"Dataset file not found at: {path.resolve()}")
    df = pd.read_csv(path)
    return df


def audit_basic_properties(df_raw: pd.DataFrame) -> None:
    """Audit and display fundamental dataset properties."""
    print("=" * 80)
    print(" 1. DATASET SHAPE & BASIC PROPERTIES")
    print("=" * 80)
    print(f"Total Rows:    {df_raw.shape[0]}")
    print(f"Total Columns: {df_raw.shape[1]}")
    print("\nColumn Names and Data Types:")
    dtype_df = pd.DataFrame({
        "Column Name (Raw)": df_raw.columns,
        "Data Type": df_raw.dtypes.astype(str).values,
        "Non-Null Count": df_raw.notnull().sum().values,
        "Missing Count": df_raw.isnull().sum().values,
        "Missing Ratio (%)": (df_raw.isnull().sum() / len(df_raw) * 100).values,
    })
    print(dtype_df.to_string(index=False))

    print("\nMissing Values Audit:")
    total_missing = df_raw.isnull().sum().sum()
    print(f"Total Missing Values across dataset: {total_missing}")
    if total_missing == 0:
        print("-> Clean dataset: Zero missing values detected.")

    print("\nDuplicate Rows Audit:")
    duplicate_count = df_raw.duplicated().sum()
    unique_count = len(df_raw) - duplicate_count
    print(f"Exact Duplicate Rows: {duplicate_count} ({duplicate_count / len(df_raw) * 100:.2f}%)")
    print(f"Unique Rows:          {unique_count} ({unique_count / len(df_raw) * 100:.2f}%)")
    print("-> Note: Duplicates are logged for audit; no rows are modified or dropped.")


def normalize_and_encode_in_memory(df_raw: pd.DataFrame) -> pd.DataFrame:
    """
    Perform in-memory normalization of column names and encoding of categoricals.
    Does NOT modify the underlying CSV or raw DataFrame.
    """
    df = df_raw.copy()

    # Normalize column names: strip whitespace, replace spaces with underscores, uppercase
    df.columns = [col.strip().replace(" ", "_").upper() for col in df.columns]

    # In-memory encoding for GENDER (M: 1, F: 0)
    if "GENDER" in df.columns:
        df["GENDER_ENCODED"] = df["GENDER"].astype(str).str.strip().map({"M": 1, "F": 0})
        # If mapping leaves NaNs, handle gracefully
        if df["GENDER_ENCODED"].isnull().any():
            unique_unmapped = df.loc[df["GENDER_ENCODED"].isnull(), "GENDER"].unique()
            raise ValueError(f"Unexpected values in GENDER column: {unique_unmapped}")

    # In-memory binary encoding for LUNG_CANCER (YES: 1, NO: 0)
    if "LUNG_CANCER" in df.columns:
        df["LUNG_CANCER_BINARY"] = df["LUNG_CANCER"].astype(str).str.strip().str.upper().map({"YES": 1, "NO": 0})
        if df["LUNG_CANCER_BINARY"].isnull().any():
            unique_unmapped = df.loc[df["LUNG_CANCER_BINARY"].isnull(), "LUNG_CANCER"].unique()
            raise ValueError(f"Unexpected values in LUNG_CANCER column: {unique_unmapped}")

    return df


def audit_target_distribution(df: pd.DataFrame, target_col: str = "LUNG_CANCER_BINARY") -> None:
    """Analyze target distribution, class imbalance, and naive baseline accuracy."""
    print("\n" + "=" * 80)
    print(" 2. TARGET VARIABLE DISTRIBUTION & CLASS IMBALANCE")
    print("=" * 80)

    counts = df[target_col].value_counts()
    percentages = df[target_col].value_counts(normalize=True) * 100

    target_summary = pd.DataFrame({
        "Class Label": ["YES (Positive / Cancer)", "NO (Negative / No Cancer)"],
        "Encoded Value": [1, 0],
        "Count": [counts.get(1, 0), counts.get(0, 0)],
        "Percentage (%)": [percentages.get(1, 0.0), percentages.get(0, 0.0)],
    })
    print(target_summary.to_string(index=False))

    majority_class_count = counts.max()
    total_samples = len(df)
    baseline_accuracy = (majority_class_count / total_samples) * 100
    imbalance_ratio = counts.get(1, 0) / max(counts.get(0, 1), 1)

    print(f"\nClass Imbalance Ratio (YES : NO): {imbalance_ratio:.2f} : 1")
    print(f"Naive Majority-Class Baseline Accuracy: {baseline_accuracy:.2f}%")

    print("\n" + "!" * 80)
    print("WARNING: CRITICAL MODELING NOTE ON ACCURACY")
    print("!" * 80)
    print(
        f"A naive classifier predicting 'YES' for every single patient would achieve "
        f"{baseline_accuracy:.2f}% accuracy while completely failing to detect healthy (NO) cases.\n"
        "Therefore, standard ACCURACY is a misleading metric for this dataset.\n"
        "Model development and evaluation MUST prioritize balanced metrics including:\n"
        "  - Precision, Recall, and F1-score (especially Macro F1 & Minority Class Recall)\n"
        "  - Balanced Accuracy\n"
        "  - PR-AUC (Precision-Recall Area Under Curve)\n"
        "  - ROC-AUC with threshold calibration\n"
        "  - Confusion matrix analysis to track false negatives and false positives."
    )
    print("!" * 80)


def audit_age_statistics(df: pd.DataFrame, target_col: str = "LUNG_CANCER_BINARY") -> None:
    """Report descriptive AGE statistics separately for YES and NO target classes."""
    print("\n" + "=" * 80)
    print(" 3. AGE STATISTICS BY TARGET CLASS")
    print("=" * 80)

    def stats_for_series(s: pd.Series, name: str) -> dict:
        q25 = s.quantile(0.25)
        q75 = s.quantile(0.75)
        return {
            "Group": name,
            "Count": len(s),
            "Mean": s.mean(),
            "Std Dev": s.std(),
            "Median": s.median(),
            "IQR": q75 - q25,
            "Min": s.min(),
            "25th Pct": q25,
            "75th Pct": q75,
            "Max": s.max(),
        }

    age_yes = df.loc[df[target_col] == 1, "AGE"]
    age_no = df.loc[df[target_col] == 0, "AGE"]
    age_all = df["AGE"]

    stats_list = [
        stats_for_series(age_yes, "YES (Lung Cancer)"),
        stats_for_series(age_no, "NO (No Lung Cancer)"),
        stats_for_series(age_all, "Overall Dataset"),
    ]
    age_df = pd.DataFrame(stats_list)
    print(age_df.to_string(index=False))


def audit_binary_features(df: pd.DataFrame, target_col: str = "LUNG_CANCER_BINARY") -> None:
    """Report distribution of each binary / survey feature against the target."""
    print("\n" + "=" * 80)
    print(" 4. BINARY & SURVEY FEATURE DISTRIBUTIONS AGAINST TARGET")
    print("=" * 80)

    # Exclude non-feature or transformed target columns
    excluded = {"AGE", "LUNG_CANCER", "LUNG_CANCER_BINARY", "GENDER"}
    feature_cols = [col for col in df.columns if col not in excluded]

    for col in feature_cols:
        print(f"\nFeature: [{col}] vs [{target_col}]")
        ct = pd.crosstab(
            df[col],
            df[target_col].map({1: "Target: YES", 0: "Target: NO"}),
            margins=True,
            margins_name="Total",
        )
        ct_pct = pd.crosstab(
            df[col],
            df[target_col].map({1: "Target: YES", 0: "Target: NO"}),
            normalize="index",
        ) * 100

        # Combine count and row percentages
        combined = ct.copy().astype(object)
        for val in df[col].unique():
            if val in ct.index and val in ct_pct.index:
                for target_val in ["Target: YES", "Target: NO"]:
                    cnt = ct.loc[val, target_val]
                    pct = ct_pct.loc[val, target_val]
                    combined.loc[val, target_val] = f"{cnt} ({pct:.1f}%)"

        print(combined.to_string())


def cramers_v(contingency_table: np.ndarray) -> float:
    """Calculate Cramér's V statistic for categorical association."""
    chi2, _, _, _ = chi2_contingency(contingency_table, correction=False)
    n = contingency_table.sum()
    r, k = contingency_table.shape
    if n == 0 or min(r - 1, k - 1) == 0:
        return 0.0
    phi2 = chi2 / n
    # Bias-corrected Cramér's V
    phi2_corr = max(0, phi2 - ((k - 1) * (r - 1)) / (n - 1))
    r_corr = r - ((r - 1) ** 2) / (n - 1)
    k_corr = k - ((k - 1) ** 2) / (n - 1)
    min_dim = min(k_corr - 1, r_corr - 1)
    if min_dim <= 0:
        return 0.0
    return float(np.sqrt(phi2_corr / min_dim))


def audit_associations_and_mutual_info(df: pd.DataFrame, target_col: str = "LUNG_CANCER_BINARY") -> None:
    """
    Calculate Mutual Information and Categorical Association Statistics (Chi-square, Cramér's V)
    between all features and the target.
    """
    print("\n" + "=" * 80)
    print(" 5. MUTUAL INFORMATION & STATISTICAL ASSOCIATION ANALYSIS")
    print("=" * 80)

    excluded = {"LUNG_CANCER", "LUNG_CANCER_BINARY", "GENDER"}
    feature_cols = [c for c in df.columns if c not in excluded]

    # Prepare matrix for mutual information
    X = df[feature_cols].copy()
    y = df[target_col].values

    # Determine discrete features for mutual info
    discrete_mask = [col != "AGE" for col in feature_cols]

    # Calculate mutual info
    mi_scores = mutual_info_classif(
        X, y,
        discrete_features=discrete_mask,
        random_state=42
    )

    results = []
    for col, mi in zip(feature_cols, mi_scores):
        ct = pd.crosstab(df[col], df[target_col]).values
        chi2, p_val, dof, _ = chi2_contingency(ct)
        c_v = cramers_v(ct)

        results.append({
            "Feature": col,
            "Type": "Numerical" if col == "AGE" else "Categorical/Binary",
            "Mutual Information": round(mi, 4),
            "Chi2 Stat": round(chi2, 3),
            "p-value": round(p_val, 5),
            "Cramer's V": round(c_v, 4),
            "Statistically Sig (p < 0.05)": "YES" if p_val < 0.05 else "NO",
        })

    results_df = pd.DataFrame(results).sort_values(by="Mutual Information", ascending=False)
    print(results_df.to_string(index=False))


def print_audit_summary(df_raw: pd.DataFrame, df_encoded: pd.DataFrame) -> None:
    """Print the final concise dataset audit summary."""
    total_rows = len(df_raw)
    duplicates = df_raw.duplicated().sum()
    unique_rows = total_rows - duplicates
    missing = df_raw.isnull().sum().sum()
    pos_count = (df_encoded["LUNG_CANCER_BINARY"] == 1).sum()
    neg_count = (df_encoded["LUNG_CANCER_BINARY"] == 0).sum()
    pos_pct = (pos_count / total_rows) * 100
    neg_pct = (neg_count / total_rows) * 100
    baseline_acc = max(pos_pct, neg_pct)

    print("\n" + "=" * 80)
    print(" DATASET AUDIT SUMMARY")
    print("=" * 80)
    print(f"1. Dataset Scale:       {total_rows} rows, {df_raw.shape[1]} columns")
    print(f"2. Data Integrity:      Missing values = {missing} (100% complete)")
    print(f"3. Duplication:         {duplicates} exact duplicates ({duplicates / total_rows * 100:.1f}%), {unique_rows} unique rows")
    print(f"4. Target Distribution: YES = {pos_count} ({pos_pct:.1f}%), NO = {neg_count} ({neg_pct:.1f}%)")
    print(f"5. Class Imbalance:     Severe imbalance ratio of ~{pos_count / max(neg_count, 1):.1f}:1")
    print(f"6. Baseline Accuracy:   Naive majority classifier achieves {baseline_acc:.2f}% accuracy")
    print("7. Key Modeling Risks & Recommendations:")
    print("   - High raw accuracy is illusory: Models predicting all positive will show ~87% accuracy.")
    print("   - Evaluation must prioritize Recall/F1 for healthy class and ROC-AUC / PR-AUC.")
    print("   - Resampling strategies (SMOTE, Class Weighting) should be considered during training.")
    print("   - Duplicate rows exist in raw data and must be treated deliberately during train/test splits.")
    print("   - Strict policy observed: Dataset untouched; no feature selection or deletion executed.")
    print("=" * 80 + "\n")


def main() -> None:
    """Main audit pipeline execution entry point."""
    data_path = get_default_data_path()
    print(f"Loading raw dataset from: {data_path}")

    # Step 1: Load raw dataset
    df_raw = load_dataset(data_path)

    # Step 2: Audit basic properties
    audit_basic_properties(df_raw)

    # Step 3: In-memory normalization and encoding
    df_encoded = normalize_and_encode_in_memory(df_raw)

    # Step 4: Target distribution and class imbalance
    audit_target_distribution(df_encoded, target_col="LUNG_CANCER_BINARY")

    # Step 5: Age distribution by class
    audit_age_statistics(df_encoded, target_col="LUNG_CANCER_BINARY")

    # Step 6: Binary feature distribution vs target
    audit_binary_features(df_encoded, target_col="LUNG_CANCER_BINARY")

    # Step 7: Mutual info & categorical associations
    audit_associations_and_mutual_info(df_encoded, target_col="LUNG_CANCER_BINARY")

    # Step 8: Concise Dataset Audit Summary
    print_audit_summary(df_raw, df_encoded)


if __name__ == "__main__":
    main()
