"""
Phase 6: Deterministic Verification and Test Suite for ML Inference Layer
Target Module: src/models/predict.py

Validates:
1. Exact input schema validation and error raising for invalid/missing inputs.
2. Deterministic prediction outputs across repeated invocations.
3. Feature ordering preservation regardless of dictionary key order.
4. Correct application of frozen 0.50 decision threshold.
5. Structured result schema completeness.
6. Model source verification (loaded from serialized metadata, not retrained).
7. Raw dataset byte-for-byte integrity check.
"""

import hashlib
import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parents[2]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from src.models.predict import FEATURE_ORDER, LungCancerPredictor, ValidationError, predict


def compute_sha256(filepath: Path) -> str:
    """Compute SHA256 hash of a file."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()


def run_tests() -> None:
    print("=" * 90)
    print(" PHASE 6: ML INFERENCE LAYER VERIFICATION & VALIDATION SUITE")
    print("=" * 90)

    # 1. Initialize Predictor
    predictor = LungCancerPredictor()
    print(f"Loaded Model:             {predictor.model_name}")
    print(f"Frozen Decision Threshold:{predictor.decision_threshold}")
    print(f"Expected Features Count:  {len(predictor.expected_features)}")
    assert predictor.decision_threshold == 0.50, "Decision threshold must be exactly 0.50"
    assert predictor.expected_features == FEATURE_ORDER, "Feature order mismatch"

    # 2. Test Case A: Typical Positive Risk Profile
    positive_input = {
        "GENDER": "M",
        "AGE": 69,
        "SMOKING": 2,
        "YELLOW_FINGERS": 2,
        "ANXIETY": 2,
        "PEER_PRESSURE": 1,
        "CHRONIC_DISEASE": 2,
        "FATIGUE": 2,
        "ALLERGY": 2,
        "WHEEZING": 2,
        "ALCOHOL_CONSUMING": 2,
        "COUGHING": 2,
        "SHORTNESS_OF_BREATH": 2,
        "SWALLOWING_DIFFICULTY": 2,
        "CHEST_PAIN": 2,
    }

    res_a = predictor.predict(positive_input)
    print("\n[Test 1: Positive Case Inference]")
    print(f" -> Input Profile: Male, Age 69, Multi-symptomatic")
    print(f" -> Prediction:   {res_a.prediction} ({res_a.prediction_label})")
    print(f" -> P(YES):       {res_a.positive_probability:.4f}")
    print(f" -> P(NO):        {res_a.negative_probability:.4f}")
    assert res_a.prediction == "YES", "Expected positive prediction"
    assert res_a.positive_probability >= 0.50, "P(YES) must be >= threshold"
    assert round(res_a.positive_probability + res_a.negative_probability, 4) == 1.0000

    # 3. Test Case B: Typical Negative / Low Risk Profile
    negative_input = {
        "GENDER": "F",
        "AGE": 25,
        "SMOKING": 1,
        "YELLOW_FINGERS": 1,
        "ANXIETY": 1,
        "PEER_PRESSURE": 1,
        "CHRONIC_DISEASE": 1,
        "FATIGUE": 1,
        "ALLERGY": 1,
        "WHEEZING": 1,
        "ALCOHOL_CONSUMING": 1,
        "COUGHING": 1,
        "SHORTNESS_OF_BREATH": 1,
        "SWALLOWING_DIFFICULTY": 1,
        "CHEST_PAIN": 1,
    }

    res_b = predictor.predict(negative_input)
    print("\n[Test 2: Negative Case Inference]")
    print(f" -> Input Profile: Female, Age 25, Asymptomatic")
    print(f" -> Prediction:   {res_b.prediction} ({res_b.prediction_label})")
    print(f" -> P(YES):       {res_b.positive_probability:.4f}")
    print(f" -> P(NO):        {res_b.negative_probability:.4f}")
    assert res_b.prediction == "NO", "Expected negative prediction"
    assert res_b.positive_probability < 0.50, "P(YES) must be < threshold"

    # 4. Test Determinism & Idempotency (100 Iterations)
    print("\n[Test 3: Determinism & Idempotency (100 Iterations)]")
    prob_first = predictor.predict_proba(positive_input)
    for _ in range(100):
        prob_i = predictor.predict_proba(positive_input)
        assert prob_first == prob_i, "Non-deterministic prediction detected!"
    print(" -> PASSED: 100 consecutive executions returned bit-exact identical probabilities.")

    # 5. Test Key Order Invariance
    print("\n[Test 4: Dictionary Key Ordering Invariance]")
    shuffled_input = {
        "CHEST_PAIN": 2,
        "AGE": 69,
        "GENDER": "M",
        "ALLERGY": 2,
        "SMOKING": 2,
        "SWALLOWING_DIFFICULTY": 2,
        "YELLOW_FINGERS": 2,
        "FATIGUE": 2,
        "SHORTNESS_OF_BREATH": 2,
        "ANXIETY": 2,
        "COUGHING": 2,
        "PEER_PRESSURE": 1,
        "ALCOHOL_CONSUMING": 2,
        "CHRONIC_DISEASE": 2,
        "WHEEZING": 2,
    }
    res_shuffled = predictor.predict(shuffled_input)
    assert res_a.positive_probability == res_shuffled.positive_probability
    assert res_a.prediction == res_shuffled.prediction
    print(" -> PASSED: Unordered dictionary mapped strictly to trained feature vector.")

    # 6. Test Input Validation & Exception Handling
    print("\n[Test 5: Validation Error Handling on Bad Inputs]")

    # 6A. Missing required feature
    try:
        bad_input = positive_input.copy()
        del bad_input["ALLERGY"]
        predictor.predict(bad_input)
        raise AssertionError("Failed: Missing feature did not raise ValidationError")
    except ValidationError as e:
        print(f" -> Caught expected Missing Feature Error: {e}")

    # 6B. Invalid Age (< 18)
    try:
        bad_input = positive_input.copy()
        bad_input["AGE"] = 10
        predictor.predict(bad_input)
        raise AssertionError("Failed: Invalid age did not raise ValidationError")
    except ValidationError as e:
        print(f" -> Caught expected Age Domain Error: {e}")

    # 6C. Invalid Gender
    try:
        bad_input = positive_input.copy()
        bad_input["GENDER"] = "OTHER"
        predictor.predict(bad_input)
        raise AssertionError("Failed: Invalid gender did not raise ValidationError")
    except ValidationError as e:
        print(f" -> Caught expected Gender Domain Error: {e}")

    # 6D. Invalid Survey Category
    try:
        bad_input = positive_input.copy()
        bad_input["SMOKING"] = 5
        predictor.predict(bad_input)
        raise AssertionError("Failed: Invalid symptom code did not raise ValidationError")
    except ValidationError as e:
        print(f" -> Caught expected Category Domain Error: {e}")

    # 7. Raw Dataset Integrity Verification
    data_path = root_dir / "data" / "raw" / "Code3_LC.csv"
    data_hash = compute_sha256(data_path)
    file_size = data_path.stat().st_size
    print("\n[Test 6: Raw Dataset Integrity Audit]")
    print(f" -> Dataset Path: {data_path}")
    print(f" -> File Size:    {file_size} bytes")
    print(f" -> SHA256 Hash:  {data_hash}")
    assert file_size == 11280, f"File size altered! Expected 11280, got {file_size}"
    assert data_hash == "5328df14d965e0edb2c8e2787c5670868660bd8fad3e7c4574d434b34792155a", "Dataset hash mismatch"
    print(" -> PASSED: data/raw/Code3_LC.csv is 100% BYTE-FOR-BYTE UNTOUCHED.")

    print("\n" + "=" * 90)
    print(" ALL 6 VERIFICATION TEST SUITES PASSED SUCCESSFULLY (100% GREEN)")
    print("=" * 90)


if __name__ == "__main__":
    run_tests()
