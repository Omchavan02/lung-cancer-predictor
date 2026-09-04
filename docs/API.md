# REST API Specification — Lung Cancer Predictor

The **Lung Cancer Predictor API** provides RESTful HTTP endpoints for health monitoring, model metadata inspection, and single-patient risk prediction.

**Base URL**: `http://127.0.0.1:8000`  
**Protocol**: HTTP/1.1  
**Content-Type**: `application/json`

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | System and model health check | No |
| `GET` | `/model-info` | Frozen model configuration & feature schema | No |
| `POST` | `/predict` | Primary lung cancer risk prediction endpoint | No |
| `GET` | `/` | Serves static frontend web application | No |

---

## 2. Endpoint Specifications

### 2.1 Health Check: `GET /health`

Returns the operational status of the service and model loading state.

#### Response (`200 OK`)
```json
{
  "status": "healthy",
  "model_loaded": true,
  "service": "Lung Cancer Predictor Inference API"
}
```

---

### 2.2 Model Metadata: `GET /model-info`

Returns the active model configuration, decision threshold, and list of expected feature names.

#### Response (`200 OK`)
```json
{
  "model_name": "Logistic Regression (Balanced)",
  "pipeline_type": "StandardScaler -> LogisticRegression(C=0.1, class_weight='balanced')",
  "decision_threshold": 0.5,
  "feature_count": 15,
  "expected_features": [
    "GENDER",
    "AGE",
    "SMOKING",
    "YELLOW_FINGERS",
    "ANXIETY",
    "PEER_PRESSURE",
    "CHRONIC_DISEASE",
    "FATIGUE",
    "ALLERGY",
    "WHEEZING",
    "ALCOHOL_CONSUMING",
    "COUGHING",
    "SHORTNESS_OF_BREATH",
    "SWALLOWING_DIFFICULTY",
    "CHEST_PAIN"
  ],
  "academic_disclaimer": "Educational / Coursework ML Model. NOT a certified clinical diagnostic system."
}
```

---

### 2.3 Risk Prediction: `POST /predict`

Computes the calibrated probability and binary risk classification for a patient profile.

#### Request Headers
- `Content-Type: application/json`
- `Accept: application/json`

#### Request Schema & Field Validation Rules

All 15 fields are **strictly required**. Unknown extra fields are rejected with HTTP 422 (`extra='forbid'`).

| Field Name | Type | Valid Values | Description |
| :--- | :--- | :--- | :--- |
| `GENDER` | String / Integer | `'M'`, `'F'`, `'MALE'`, `'FEMALE'`, `1`, `0` | Biological sex ($1 = \text{Male}, 0 = \text{Female}$) |
| `AGE` | Float / Integer | $18.0 \le \text{AGE} \le 120.0$ | Chronological age in years |
| `SMOKING` | Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Smoking status ($1 = \text{No}, 2 = \text{Yes}$) |
| `YELLOW_FINGERS` | Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Yellow fingers / tar staining ($1 = \text{No}, 2 = \text{Yes}$) |
| `ANXIETY` | Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Anxiety presence ($1 = \text{No}, 2 = \text{Yes}$) |
| `PEER_PRESSURE` | Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Peer pressure ($1 = \text{No}, 2 = \text{Yes}$) |
| `CHRONIC_DISEASE`| Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Chronic conditions ($1 = \text{No}, 2 = \text{Yes}$) |
| `FATIGUE` | Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Persistent fatigue ($1 = \text{No}, 2 = \text{Yes}$) |
| `ALLERGY` | Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Allergic history ($1 = \text{No}, 2 = \text{Yes}$) |
| `WHEEZING` | Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Wheezing symptom ($1 = \text{No}, 2 = \text{Yes}$) |
| `ALCOHOL_CONSUMING`| Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Alcohol consumption ($1 = \text{No}, 2 = \text{Yes}$) |
| `COUGHING` | Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Persistent cough ($1 = \text{No}, 2 = \text{Yes}$) |
| `SHORTNESS_OF_BREATH`| Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Dyspnea ($1 = \text{No}, 2 = \text{Yes}$) |
| `SWALLOWING_DIFFICULTY`| Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Dysphagia ($1 = \text{No}, 2 = \text{Yes}$) |
| `CHEST_PAIN` | Integer / String / Bool | `1`, `2`, `'YES'`, `'NO'`, `true`, `false` | Chest pain symptom ($1 = \text{No}, 2 = \text{Yes}$) |

---

#### Example Request: Positive Patient Profile
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{
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
       "CHEST_PAIN": 2
     }'
```

#### Example Response (`200 OK`)
```json
{
  "status": "success",
  "prediction": "YES",
  "prediction_label": "Lung Cancer (Positive Risk)",
  "positive_probability": 0.9835,
  "negative_probability": 0.0165,
  "decision_threshold": 0.5,
  "model_name": "Logistic Regression (Balanced)",
  "model_version": "1.0.0 (Phase 5 Frozen)",
  "is_high_risk": true,
  "validated_input": {
    "GENDER": 1,
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
    "CHEST_PAIN": 2
  }
}
```

---

#### Example Request: Negative / Low Risk Patient Profile
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{
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
       "CHEST_PAIN": 1
     }'
```

#### Example Response (`200 OK`)
```json
{
  "status": "success",
  "prediction": "NO",
  "prediction_label": "No Lung Cancer (Low Risk)",
  "positive_probability": 0.0113,
  "negative_probability": 0.9887,
  "decision_threshold": 0.5,
  "model_name": "Logistic Regression (Balanced)",
  "model_version": "1.0.0 (Phase 5 Frozen)",
  "is_high_risk": false,
  "validated_input": {
    "GENDER": 0,
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
    "CHEST_PAIN": 1
  }
}
```

---

## 3. Error Responses & HTTP Status Codes

### `422 Unprocessable Entity` (Schema / Range Validation Error)
Returned when a required field is missing, out-of-range, or invalid.

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "ALLERGY"],
      "msg": "Field required",
      "input": null
    }
  ]
}
```

### `500 Internal Server Error` (Server Error)
Returned if an unhandled runtime error occurs during inference. Stack traces are suppressed for security.

```json
{
  "detail": "Inference processing failed on the server."
}
```
