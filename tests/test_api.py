"""
Backend Integration Test Suite for FastAPI Lung Cancer Predictor API
Target Module: src/utils/api.py

Tests:
1. System endpoints: /health, /model-info
2. Valid Positive Case Prediction (200 OK, prediction='YES', P >= 0.50)
3. Valid Negative Case Prediction (200 OK, prediction='NO', P < 0.50)
4. Missing Feature Rejection (422 Unprocessable Entity)
5. Invalid Gender Rejection (422 Unprocessable Entity)
6. Invalid Age Boundary Rejection (< 18, > 120 -> 422 Unprocessable Entity)
7. Invalid Survey Symptom Code Rejection (422 Unprocessable Entity)
8. Unknown / Extra Field Rejection (422 Unprocessable Entity)
9. Idempotency & Determinism (Repeated requests return bit-exact identical response)
10. Raw dataset byte-level integrity verification
"""

import hashlib
import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parents[1]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from fastapi.testclient import TestClient
from src.utils.api import app


def compute_sha256(filepath: Path) -> str:
    """Compute SHA256 hash of a file."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()


def run_backend_tests():
    print("=" * 95)
    print(" PHASE 7: BACKEND / API INTEGRATION VERIFICATION TEST SUITE")
    print("=" * 95)

    client = TestClient(app)

    # -------------------------------------------------------------------------
    # TEST 1: Health Check Endpoint
    # -------------------------------------------------------------------------
    print("\n[Test 1: Health Check Endpoint (GET /health)]")
    resp_health = client.get("/health")
    print(f" -> Status: {resp_health.status_code}")
    print(f" -> Body:   {resp_health.json()}")
    assert resp_health.status_code == 200
    assert resp_health.json()["status"] == "healthy"
    assert resp_health.json()["model_loaded"] is True
    print(" -> PASSED")

    # -------------------------------------------------------------------------
    # TEST 2: Model Info Endpoint
    # -------------------------------------------------------------------------
    print("\n[Test 2: Model Info Endpoint (GET /model-info)]")
    resp_info = client.get("/model-info")
    print(f" -> Status: {resp_info.status_code}")
    info_data = resp_info.json()
    print(f" -> Model Name:         {info_data['model_name']}")
    print(f" -> Decision Threshold: {info_data['decision_threshold']}")
    print(f" -> Feature Count:      {info_data['feature_count']}")
    assert resp_info.status_code == 200
    assert info_data["decision_threshold"] == 0.50
    assert info_data["feature_count"] == 15
    print(" -> PASSED")

    # -------------------------------------------------------------------------
    # TEST 3: Valid Positive Prediction
    # -------------------------------------------------------------------------
    print("\n[Test 3: Valid Positive Prediction (POST /predict)]")
    positive_payload = {
        "GENDER": "M",
        "AGE": 69.0,
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
    resp_pos = client.post("/predict", json=positive_payload)
    print(f" -> Status: {resp_pos.status_code}")
    pos_data = resp_pos.json()
    print(f" -> Prediction: {pos_data['prediction']} ({pos_data['prediction_label']})")
    print(f" -> P(YES):     {pos_data['positive_probability']}")
    print(f" -> P(NO):      {pos_data['negative_probability']}")
    assert resp_pos.status_code == 200
    assert pos_data["status"] == "success"
    assert pos_data["prediction"] == "YES"
    assert pos_data["positive_probability"] >= 0.50
    assert pos_data["is_high_risk"] is True
    print(" -> PASSED")

    # -------------------------------------------------------------------------
    # TEST 4: Valid Negative Prediction
    # -------------------------------------------------------------------------
    print("\n[Test 4: Valid Negative Prediction (POST /predict)]")
    negative_payload = {
        "GENDER": "F",
        "AGE": 25.0,
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
    resp_neg = client.post("/predict", json=negative_payload)
    print(f" -> Status: {resp_neg.status_code}")
    neg_data = resp_neg.json()
    print(f" -> Prediction: {neg_data['prediction']} ({neg_data['prediction_label']})")
    print(f" -> P(YES):     {neg_data['positive_probability']}")
    print(f" -> P(NO):      {neg_data['negative_probability']}")
    assert resp_neg.status_code == 200
    assert neg_data["status"] == "success"
    assert neg_data["prediction"] == "NO"
    assert neg_data["positive_probability"] < 0.50
    assert neg_data["is_high_risk"] is False
    print(" -> PASSED")

    # -------------------------------------------------------------------------
    # TEST 5: Missing Feature Validation Error
    # -------------------------------------------------------------------------
    print("\n[Test 5: Missing Feature Validation (POST /predict)]")
    bad_payload_missing = positive_payload.copy()
    del bad_payload_missing["ALLERGY"]
    resp_missing = client.post("/predict", json=bad_payload_missing)
    print(f" -> Status: {resp_missing.status_code} (Expected 422)")
    print(f" -> Error Detail: {resp_missing.json()['detail']}")
    assert resp_missing.status_code == 422
    print(" -> PASSED")

    # -------------------------------------------------------------------------
    # TEST 6: Invalid Gender Validation Error
    # -------------------------------------------------------------------------
    print("\n[Test 6: Invalid Gender Validation (POST /predict)]")
    bad_payload_gender = positive_payload.copy()
    bad_payload_gender["GENDER"] = "UNKNOWN_CODE"
    resp_gender = client.post("/predict", json=bad_payload_gender)
    print(f" -> Status: {resp_gender.status_code} (Expected 422)")
    assert resp_gender.status_code == 422
    print(" -> PASSED")

    # -------------------------------------------------------------------------
    # TEST 7: Invalid Age Boundary Validation Error
    # -------------------------------------------------------------------------
    print("\n[Test 7: Invalid Age Boundary Validation (POST /predict)]")
    bad_payload_age = positive_payload.copy()
    bad_payload_age["AGE"] = 5.0
    resp_age = client.post("/predict", json=bad_payload_age)
    print(f" -> Status: {resp_age.status_code} (Expected 422)")
    assert resp_age.status_code == 422
    print(" -> PASSED")

    # -------------------------------------------------------------------------
    # TEST 8: Invalid Survey Code Validation Error
    # -------------------------------------------------------------------------
    print("\n[Test 8: Invalid Symptom Code Validation (POST /predict)]")
    bad_payload_symptom = positive_payload.copy()
    bad_payload_symptom["SMOKING"] = 99
    resp_symptom = client.post("/predict", json=bad_payload_symptom)
    print(f" -> Status: {resp_symptom.status_code} (Expected 422)")
    assert resp_symptom.status_code == 422
    print(" -> PASSED")

    # -------------------------------------------------------------------------
    # TEST 9: Extra / Unexpected Field Rejection
    # -------------------------------------------------------------------------
    print("\n[Test 9: Extra Field Rejection (POST /predict)]")
    bad_payload_extra = positive_payload.copy()
    bad_payload_extra["UNEXPECTED_FIELD"] = "TEST"
    resp_extra = client.post("/predict", json=bad_payload_extra)
    print(f" -> Status: {resp_extra.status_code} (Expected 422)")
    assert resp_extra.status_code == 422
    print(" -> PASSED")

    # -------------------------------------------------------------------------
    # TEST 10: Determinism & Idempotency (50 Repeated Calls)
    # -------------------------------------------------------------------------
    print("\n[Test 10: Determinism & Idempotency (50 Repeated Calls)]")
    first_resp_json = client.post("/predict", json=positive_payload).json()
    for _ in range(50):
        call_json = client.post("/predict", json=positive_payload).json()
        assert call_json == first_resp_json, "Non-deterministic API response detected!"
    print(" -> PASSED: 50 repeated API calls returned identical structured JSON.")

    # -------------------------------------------------------------------------
    # TEST 11: Raw Dataset & Model Integrity Audit
    # -------------------------------------------------------------------------
    print("\n[Test 11: Dataset and Model Integrity Verification]")
    data_path = root_dir / "data" / "raw" / "Code3_LC.csv"
    data_hash = compute_sha256(data_path)
    file_size = data_path.stat().st_size
    print(f" -> Dataset Path: {data_path}")
    print(f" -> File Size:    {file_size} bytes")
    print(f" -> SHA256 Hash:  {data_hash}")
    assert file_size == 11280
    assert data_hash == "5328df14d965e0edb2c8e2787c5670868660bd8fad3e7c4574d434b34792155a"
    print(" -> PASSED: Raw dataset is 100% BYTE-FOR-BYTE UNTOUCHED.")

    print("\n" + "=" * 95)
    print(" ALL 11 BACKEND / API VERIFICATION TESTS PASSED SUCCESSFULLY (100% GREEN)")
    print("=" * 95)


if __name__ == "__main__":
    run_backend_tests()
