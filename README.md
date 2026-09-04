# LungSense

LungSense is an academic lung-cancer risk-prediction platform. It combines a React/Vite interface with a FastAPI inference API that evaluates 15 survey-derived patient indicators using a frozen logistic-regression model.

## Important medical disclaimer

This software is an educational machine-learning project. Its output is an AI-assisted statistical risk estimate, **not a medical diagnosis**, screening result, or substitute for advice from a qualified healthcare professional.

## Features

- React assessment interface with patient-profile controls and reference profiles.
- FastAPI health, model-information, and prediction endpoints.
- Strict server-side input validation for 15 features.
- Deterministic metadata-based inference with a displayed probability and `YES`/`NO` risk classification.
- Model transparency, risk details, and documented holdout metrics.
- A protected PowerShell utility for displaying the recorded holdout accuracy.

## Application sections

The React UI includes the Dashboard, Patient Assessment, Lung Insights, AI Engine, and About sections. The legacy static frontend in `frontend/` is also served by the FastAPI application.

## Machine learning

The production inference engine uses a balanced logistic-regression model with `C=0.1` and an operating threshold of `0.50`. It reads its frozen feature order, coefficients, intercept, training means, and standard deviations from `models/model_metadata.json`.

The raw dataset has 309 observations; the documented training workflow deduplicates it to 276 unique records, then uses 220 training and 56 holdout samples. The recorded holdout metrics are:

| Metric | Value |
| --- | ---: |
| Accuracy | 91.07% |
| Balanced accuracy | 84.38% |
| Macro F1 | 83.54% |
| ROC-AUC | 0.8672 |
| PR-AUC | 0.9392 |

These are project evaluation results, not clinical-performance claims.

## Prediction pipeline

```text
User input
  -> FastAPI schema validation and encoding
  -> fixed 15-feature order
  -> StandardScaler-compatible z-score transformation
  -> logistic score and sigmoid probability P(YES)
  -> threshold at 0.50
  -> YES / NO response rendered by the UI
```

The React application calls `POST /predict`. It renders `positive_probability`, `negative_probability`, and the `prediction` returned by the API; no prediction probability or class is generated client-side.

### Input schema

The model expects these features, in this order:

`GENDER`, `AGE`, `SMOKING`, `YELLOW_FINGERS`, `ANXIETY`, `PEER_PRESSURE`, `CHRONIC_DISEASE`, `FATIGUE`, `ALLERGY`, `WHEEZING`, `ALCOHOL_CONSUMING`, `COUGHING`, `SHORTNESS_OF_BREATH`, `SWALLOWING_DIFFICULTY`, and `CHEST_PAIN`.

`GENDER` accepts male/female values or 1/0. The 13 survey indicators accept the project’s 1/2 coding (or supported boolean/text equivalents), and age is restricted to 18–120.

## Tech stack

- Frontend: React 18, Vite 6, Tailwind CSS 3, Lucide React
- Backend: Python, FastAPI, Pydantic, Uvicorn
- ML inference: NumPy and frozen logistic-regression metadata
- Model development/evaluation: scikit-learn and the scripts under `src/`

## Project structure

```text
data/raw/                     source CSV dataset
docs/                         API, reproducibility, and technical documentation
frontend/                     legacy static frontend served by FastAPI
frontend-react/               React/Vite frontend
  src/                        UI components, API client, and app entry point
  public/assets/              frontend assets
models/model_metadata.json    frozen inference parameters and feature schema
reports/                      recorded model evaluation metrics
src/models/                   inference, training, and experiment scripts
src/utils/api.py              FastAPI application
tests/                        API and legacy-frontend integration checks
tools/show_accuracy.ps1       protected accuracy-display utility
requirements.txt              Python dependencies
```

## Installation

Use Python 3.10+ and Node.js with npm.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

Set-Location frontend-react
npm ci
```

## Running the project

Start the API from the repository root:

```powershell
.\.venv\Scripts\python -m uvicorn src.utils.api:app --host 127.0.0.1 --port 8000
```

Start the React frontend in a separate terminal:

```powershell
Set-Location frontend-react
npm run dev
```

Vite is configured for port 3000. Its API client defaults to `http://127.0.0.1:8000`; the Vite `/api` proxy is also available for development.

The API exposes `GET /health`, `GET /model-info`, and `POST /predict`. The FastAPI root route serves the separate legacy static frontend in `frontend/`, not the React Vite build.

## Environment variables

The React app supports:

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | React build-time API base URL; defaults to `http://127.0.0.1:8000` for local development. |
| `CORS_ALLOWED_ORIGINS` | Backend comma-separated frontend origins; local Vite origins are used when unset. |

Use `frontend-react/.env.example` as the React template and the root `.env.example` as the backend template. The backend also reads a root `.env` locally; hosted environments should provide the same variables directly. Replace only placeholder domains and do not commit environment files containing deployment-specific values.

## Validation

From the repository root:

```powershell
.\.venv\Scripts\python src/evaluation/verify_inference.py
.\.venv\Scripts\python tests/test_api.py
.\.venv\Scripts\python tests/test_frontend_integration.py
```

Build the React production bundle:

```powershell
Set-Location frontend-react
npm run build
```

There is no configured JavaScript lint or test script in `frontend-react/package.json`.

## show_accuracy.ps1

`tools/show_accuracy.ps1` is a protected project artifact. It reads `reports/final_model_evaluation.json` and prints the frozen final holdout accuracy. Keep both files in their current relative locations.

Run it from the repository root:

```powershell
.\tools\show_accuracy.ps1
```

## Deployment

Deploy the React build generated by `frontend-react/npm run build` as a static site, and deploy the FastAPI service with access to `models/model_metadata.json`. Set `VITE_API_BASE_URL` to the deployed API URL at build time and `CORS_ALLOWED_ORIGINS` to the deployed frontend origin before production use.

The current FastAPI application separately serves the legacy `frontend/` files. It does not automatically serve `frontend-react/dist`, so a deployment must choose and configure the intended frontend path explicitly.

## Limitations and status

The model is based on a small, imbalanced survey dataset and should only be used for academic demonstration. It is not clinically validated or approved for medical use.

The repository has verified inference, API, integration, and React production-build checks. It is ready for manual Git initialization/commit and deployment configuration; no commit, push, or deployment is performed by this project.
