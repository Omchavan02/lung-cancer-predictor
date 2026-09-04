# Reproducibility Guide — Lung Cancer Predictor

This guide provides exact, step-by-step instructions to reproduce all audit, training, inference, backend, and frontend verification steps for the **Lung Cancer Predictor** project.

---

## 1. System Requirements & Environment Setup

### Supported Python Versions
- Python **3.10**, **3.11**, or **3.12**

### Recommended Environment Setup
Create and activate an isolated virtual environment:

```bash
# Navigate to project root
cd "c:/MINI PROJECTS/Lung Cancer Predictor"

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Windows (Command Prompt):
.venv\Scripts\activate.bat
# Linux / macOS:
source .venv/bin/activate

# Upgrade pip and install pinned dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 2. Core Declared Dependencies

The project relies strictly on the packages declared in `requirements.txt`:
- `scikit-learn==1.5.2` (Machine learning algorithms and metrics)
- `pandas==2.2.3` (Data structures and in-memory transformations)
- `numpy==2.1.3` (Vector computations and numerical linear algebra)
- `scipy==1.16.1` (Statistical tests, Chi-square, Cramér's V)
- `fastapi==0.115.5` (REST API framework)
- `uvicorn==0.32.1` (ASGI web server)
- `pydantic==2.12.5` (Schema validation)
- `joblib==1.5.2` (Pipeline serialization)

*Frontend requires zero npm/Node.js dependencies (built with native HTML5, CSS3, and ES6 JavaScript).*

---

## 3. Dataset Integrity Verification

Before running any pipeline, verify that `data/raw/Code3_LC.csv` is untouched:

```bash
# Check SHA256 Hash
# Windows (PowerShell):
Get-FileHash data/raw/Code3_LC.csv -Algorithm SHA256

# Linux / macOS:
sha256sum data/raw/Code3_LC.csv
```

**Expected SHA256**:
`5328df14d965e0edb2c8e2787c5670868660bd8fad3e7c4574d434b34792155a` (11,280 bytes).

---

## 4. Execution Commands (Phase-by-Phase Reproduction)

### Step 1: Execute Dataset Audits (Phases 1 & 2)
```bash
# Basic dataset audit
python src/evaluation/dataset_audit.py

# Deep semantics, duplicate, and association audit
python src/evaluation/dataset_semantics_audit.py
```

### Step 2: Execute Multi-Algorithm Benchmark & CV Tuning (Phases 3 & 4)
```bash
# Runs 25-fold Repeated Stratified CV, Grid Search tuning, and OOF threshold sweeps
python src/models/experiment_comparison.py
```

### Step 3: Run Final Model Training & Verification (Phase 5)
```bash
# Trains final Logistic Regression & benchmark Extra Trees on training partition (n=220),
# evaluates frozen holdout set (n=56), and verifies round-trip model reloading
python src/models/train_final_model.py
```

### Step 4: Run Inference Unit Verification Suite (Phase 6)
```bash
# Validates schema rejection, 100-iteration determinism, and positive/negative test cases
python src/evaluation/verify_inference.py
```

### Step 5: Run Backend API Test Suite (Phase 7)
```bash
# Executes FastAPI test client against /health, /model-info, and /predict with 11 test cases
python tests/test_api.py
```

### Step 6: Run Frontend / API End-to-End Integration Suite (Phase 8)
```bash
# Validates static asset delivery, Test A positive profile, Test B negative profile, and boundary checks
python tests/test_frontend_integration.py
```

---

## 5. Starting the Live Application Server

To start the FastAPI web server serving both the backend API and the static web UI:

```bash
python -m uvicorn src.utils.api:app --host 127.0.0.1 --port 8000 --reload
```

- **Web Application**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Swagger Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Endpoint**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- **Model Info**: [http://127.0.0.1:8000/model-info](http://127.0.0.1:8000/model-info)

---

## 6. Verification Test Profiles (Expected Reference Values)

### Test A: Positive Patient Profile
- **Input**: Male, Age 69, All survey symptoms set to `2` (Yes) except Peer Pressure set to `1` (No).
- **Expected Prediction**: `YES` (Positive Risk Classification)
- **Expected P(YES)**: `0.9835` ($98.35\%$)
- **Expected P(NO)**: `0.0165` ($1.65\%$)

### Test B: Negative Patient Profile
- **Input**: Female, Age 25, All survey symptoms set to `1` (No).
- **Expected Prediction**: `NO` (Low Risk Classification)
- **Expected P(YES)**: `0.0113` ($1.13\%$)
- **Expected P(NO)**: `0.9887` ($98.87\%$)

---

## 7. Frozen Artifacts List

The following files are frozen and must not be altered:
1. `data/raw/Code3_LC.csv` (Raw survey dataset)
2. `models/model_metadata.json` (Frozen model weights, intercept, scaling parameters, threshold $\theta=0.50$, and feature order)
3. `reports/final_model_evaluation.json` (Frozen performance metrics)
