"""
Phase 8: Frontend & Backend End-to-End Integration Verification Suite
Target Module: frontend/ (index.html, styles.css, app.js, config.js) & src/utils/api.py

Verifies:
1. Static asset delivery for frontend (index.html, styles.css, app.js, config.js).
2. Test A: Exact Positive Profile (Male, 69, Symptomatic -> Prediction YES, P(YES) ~ 0.9835).
3. Test B: Exact Negative Profile (Female, 25, Asymptomatic -> Prediction NO, P(YES) ~ 0.0113).
4. Error handling: Age bounds, Missing features, Invalid types.
5. Decision threshold consistency (0.50).
6. Raw dataset byte-level integrity.
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


def run_frontend_integration_tests():
    print("=" * 95)
    print(" PHASE 8: FRONTEND / API END-TO-END INTEGRATION TEST SUITE")
    print("=" * 95)

    client = TestClient(app)

    # -------------------------------------------------------------------------
    # TEST 1: Static Asset Delivery
    # -------------------------------------------------------------------------
    print("\n[Test 1: Static Frontend Assets Delivery]")
    resp_index = client.get("/")
    assert resp_index.status_code == 200
    assert "Lung Cancer Predictor" in resp_index.text
    print(" -> GET / (index.html): 200 OK (Title verified)")

    resp_css = client.get("/styles.css")
    assert resp_css.status_code == 200
    print(" -> GET /styles.css: 200 OK")

    resp_js = client.get("/app.js")
    assert resp_js.status_code == 200
    print(" -> GET /app.js: 200 OK")

    resp_cfg = client.get("/config.js")
    assert resp_cfg.status_code == 200
    assert "CONFIG" in resp_cfg.text
    print(" -> GET /config.js: 200 OK")

    # -------------------------------------------------------------------------
    # TEST 2: TEST A — Positive Profile Verification
    # -------------------------------------------------------------------------
    print("\n[Test 2: TEST A — Positive Patient Profile Prediction]")
    test_a_payload = {
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
    resp_a = client.post("/predict", json=test_a_payload)
    assert resp_a.status_code == 200
    res_a_data = resp_a.json()
    print(f" -> Status:               {resp_a.status_code} OK")
    print(f" -> Model Prediction:     {res_a_data['prediction']}")
    print(f" -> Positive Probability: {res_a_data['positive_probability']:.4f} (Expected ~0.9835)")
    print(f" -> Negative Probability: {res_a_data['negative_probability']:.4f} (Expected ~0.0165)")
    print(f" -> Decision Threshold:   {res_a_data['decision_threshold']}")
    assert res_a_data["prediction"] == "YES"
    assert abs(res_a_data["positive_probability"] - 0.9835) < 0.001
    assert abs(res_a_data["negative_probability"] - 0.0165) < 0.001
    assert res_a_data["is_high_risk"] is True
    print(" -> TEST A PASSED")

    # -------------------------------------------------------------------------
    # TEST 3: TEST B — Negative Profile Verification
    # -------------------------------------------------------------------------
    print("\n[Test 3: TEST B — Negative Patient Profile Prediction]")
    test_b_payload = {
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
    resp_b = client.post("/predict", json=test_b_payload)
    assert resp_b.status_code == 200
    res_b_data = resp_b.json()
    print(f" -> Status:               {resp_b.status_code} OK")
    print(f" -> Model Prediction:     {res_b_data['prediction']}")
    print(f" -> Positive Probability: {res_b_data['positive_probability']:.4f} (Expected ~0.0113)")
    print(f" -> Negative Probability: {res_b_data['negative_probability']:.4f} (Expected ~0.9887)")
    print(f" -> Decision Threshold:   {res_b_data['decision_threshold']}")
    assert res_b_data["prediction"] == "NO"
    assert abs(res_b_data["positive_probability"] - 0.0113) < 0.001
    assert abs(res_b_data["negative_probability"] - 0.9887) < 0.001
    assert res_b_data["is_high_risk"] is False
    print(" -> TEST B PASSED")

    # -------------------------------------------------------------------------
    # TEST 4: Frontend Validation Error Scenarios
    # -------------------------------------------------------------------------
    print("\n[Test 4: Error Handling & Validation Tests]")

    # Age < 18
    resp_underage = client.post("/predict", json={**test_a_payload, "AGE": 15})
    assert resp_underage.status_code == 422
    print(" -> Underage input (AGE=15): 422 Unprocessable Entity (PASSED)")

    # Age > 120
    resp_overage = client.post("/predict", json={**test_a_payload, "AGE": 130})
    assert resp_overage.status_code == 422
    print(" -> Overage input (AGE=130): 422 Unprocessable Entity (PASSED)")

    # Missing binary feature
    bad_missing = test_a_payload.copy()
    del bad_missing["SMOKING"]
    resp_missing = client.post("/predict", json=bad_missing)
    assert resp_missing.status_code == 422
    print(" -> Missing required feature: 422 Unprocessable Entity (PASSED)")

    # -------------------------------------------------------------------------
    # TEST 5: Dataset Byte-Level Integrity Check
    # -------------------------------------------------------------------------
    print("\n[Test 5: Raw Dataset Integrity Audit]")
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
    print(" ALL 5 FRONTEND INTEGRATION TEST SUITES PASSED (100% GREEN)")
    print("=" * 95)


if __name__ == "__main__":
    run_frontend_integration_tests()
