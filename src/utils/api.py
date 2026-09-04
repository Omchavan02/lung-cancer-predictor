"""
FastAPI Backend Application for Lung Cancer Prediction
Exposes the frozen Phase 5/6 ML inference engine (src/models/predict.py)
Operating Decision Threshold: 0.50 (Server-Controlled)

Endpoints:
- GET  /health      : Service health status and model availability
- GET  /model-info  : Frozen model metadata, feature schema, and threshold
- POST /predict     : Full structured prediction for 15 patient features
- GET  /            : Serves the static frontend (index.html, styles.css, app.js)
"""

import os
import sys
from pathlib import Path
from typing import Any, Literal, Union

# Ensure project root is on sys.path
root_dir = Path(__file__).resolve().parents[2]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

# Local development may use a root .env file; hosted environments provide the
# same variables directly and are not overridden by default.
from dotenv import load_dotenv
load_dotenv(root_dir / ".env")

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field, field_validator

from src.models.predict import (
    FEATURE_ORDER,
    SURVEY_FEATURES,
    LungCancerPredictor,
    ValidationError as MLValidationError,
    get_predictor,
)


def get_cors_origins() -> list[str]:
    """Return configured browser origins, with safe local-development defaults."""
    configured_origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
    if configured_origins.strip():
        return [origin.strip() for origin in configured_origins.split(",") if origin.strip()]
    return ["http://localhost:3000", "http://127.0.0.1:3000"]


# =============================================================================
# PYDANTIC SCHEMAS (Request & Response)
# =============================================================================

class PatientFeaturesRequest(BaseModel):
    """
    Strict Pydantic request schema for the 15 lung cancer risk features.
    Accepts standard numeric codes (1=No/Absent, 2=Yes/Present) or friendly strings.
    """
    model_config = ConfigDict(extra="forbid")

    GENDER: Union[str, int] = Field(
        ...,
        description="Biological sex: 'M'/'F', 'MALE'/'FEMALE', or 1 (Male) / 0 (Female)",
        examples=["M"],
    )
    AGE: float = Field(
        ...,
        ge=18,
        le=120,
        description="Patient age in years (Range: 18 - 120)",
        examples=[65.0],
    )
    SMOKING: Union[int, str, bool] = Field(..., description="Smoking status (1=No, 2=Yes)", examples=[2])
    YELLOW_FINGERS: Union[int, str, bool] = Field(..., description="Yellow fingers / nicotine staining (1=No, 2=Yes)", examples=[2])
    ANXIETY: Union[int, str, bool] = Field(..., description="Anxiety (1=No, 2=Yes)", examples=[1])
    PEER_PRESSURE: Union[int, str, bool] = Field(..., description="Peer pressure (1=No, 2=Yes)", examples=[1])
    CHRONIC_DISEASE: Union[int, str, bool] = Field(..., description="Chronic disease presence (1=No, 2=Yes)", examples=[2])
    FATIGUE: Union[int, str, bool] = Field(..., description="Persistent fatigue (1=No, 2=Yes)", examples=[2])
    ALLERGY: Union[int, str, bool] = Field(..., description="Allergy history (1=No, 2=Yes)", examples=[2])
    WHEEZING: Union[int, str, bool] = Field(..., description="Wheezing (1=No, 2=Yes)", examples=[2])
    ALCOHOL_CONSUMING: Union[int, str, bool] = Field(..., description="Alcohol consumption habit (1=No, 2=Yes)", examples=[2])
    COUGHING: Union[int, str, bool] = Field(..., description="Persistent coughing (1=No, 2=Yes)", examples=[2])
    SHORTNESS_OF_BREATH: Union[int, str, bool] = Field(..., description="Shortness of breath / dyspnea (1=No, 2=Yes)", examples=[2])
    SWALLOWING_DIFFICULTY: Union[int, str, bool] = Field(..., description="Swallowing difficulty / dysphagia (1=No, 2=Yes)", examples=[1])
    CHEST_PAIN: Union[int, str, bool] = Field(..., description="Chest pain (1=No, 2=Yes)", examples=[2])

    @field_validator("GENDER")
    @classmethod
    def validate_gender(cls, v: Any) -> Any:
        if isinstance(v, str):
            clean = v.strip().upper()
            if clean not in ["M", "F", "MALE", "FEMALE", "1", "0"]:
                raise ValueError("GENDER must be 'M', 'F', 'MALE', 'FEMALE', or 1/0")
        elif isinstance(v, int):
            if v not in [0, 1]:
                raise ValueError("GENDER integer must be 1 (Male) or 0 (Female)")
        else:
            raise ValueError("GENDER must be a string or integer")
        return v

    @field_validator(
        "SMOKING", "YELLOW_FINGERS", "ANXIETY", "PEER_PRESSURE", "CHRONIC_DISEASE",
        "FATIGUE", "ALLERGY", "WHEEZING", "ALCOHOL_CONSUMING", "COUGHING",
        "SHORTNESS_OF_BREATH", "SWALLOWING_DIFFICULTY", "CHEST_PAIN"
    )
    @classmethod
    def validate_binary_symptoms(cls, v: Any, info) -> Any:
        if isinstance(v, bool):
            return v
        if isinstance(v, int):
            if v not in [0, 1, 2]:
                raise ValueError(f"{info.field_name} must be 1 (No/Absent) or 2 (Yes/Present)")
            return v
        if isinstance(v, str):
            clean = v.strip().upper()
            if clean not in ["1", "2", "0", "YES", "NO", "TRUE", "FALSE", "PRESENT", "ABSENT", "Y", "N", "HIGH", "LOW"]:
                raise ValueError(f"{info.field_name} must be 1/2, 'YES'/'NO', or boolean")
            return v
        raise ValueError(f"Invalid type for {info.field_name}")


class PredictionResponse(BaseModel):
    """Structured response schema returned to clients."""
    status: Literal["success"] = "success"
    prediction: Literal["YES", "NO"]
    prediction_label: str
    positive_probability: float
    negative_probability: float
    decision_threshold: float
    model_name: str
    model_version: str
    is_high_risk: bool
    validated_input: dict[str, Any]


class ModelInfoResponse(BaseModel):
    """Metadata response describing the frozen model and server configuration."""
    model_name: str
    pipeline_type: str
    decision_threshold: float
    feature_count: int
    expected_features: list[str]
    academic_disclaimer: str


class HealthResponse(BaseModel):
    """Health check response."""
    status: Literal["healthy"] = "healthy"
    model_loaded: bool
    service: str


# =============================================================================
# FASTAPI APPLICATION SETUP
# =============================================================================

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Lung Cancer Predictor API",
        description="Production inference backend serving the frozen Phase 5 Logistic Regression model.",
        version="1.0.0",
    )

    # Production origins are supplied through CORS_ALLOWED_ORIGINS as a
    # comma-separated environment variable.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_cors_origins(),
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    # Initialize predictor once at startup
    predictor = get_predictor()

    @app.exception_handler(MLValidationError)
    async def ml_validation_exception_handler(request: Request, exc: MLValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "status": "error",
                "error_type": "ValidationError",
                "detail": str(exc),
            },
        )

    @app.get("/health", response_model=HealthResponse, tags=["System"])
    async def health_check():
        """Check system and model health."""
        return HealthResponse(
            status="healthy",
            model_loaded=predictor is not None,
            service="Lung Cancer Predictor Inference API",
        )

    @app.get("/model-info", response_model=ModelInfoResponse, tags=["System"])
    async def get_model_info():
        """Retrieve frozen model metadata and feature schema."""
        return ModelInfoResponse(
            model_name=predictor.model_name,
            pipeline_type="StandardScaler -> LogisticRegression(C=0.1, class_weight='balanced')",
            decision_threshold=predictor.decision_threshold,
            feature_count=len(predictor.expected_features),
            expected_features=predictor.expected_features,
            academic_disclaimer=(
                "Educational / Coursework ML Model. NOT a certified clinical diagnostic system."
            ),
        )

    @app.post("/predict", response_model=PredictionResponse, tags=["Inference"])
    async def predict_endpoint(payload: PatientFeaturesRequest):
        """
        Execute prediction on 15 patient features using the frozen inference layer.
        """
        try:
            raw_dict = payload.model_dump()
            result = predictor.predict(raw_dict)
            return PredictionResponse(
                status="success",
                prediction=result.prediction,  # type: ignore
                prediction_label=result.prediction_label,
                positive_probability=result.positive_probability,
                negative_probability=result.negative_probability,
                decision_threshold=result.decision_threshold,
                model_name=result.model_name,
                model_version=result.model_version,
                is_high_risk=result.is_high_risk,
                validated_input=result.validated_input,
            )
        except MLValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(e),
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Inference processing failed on the server.",
            )

    # Mount static frontend directory if present
    frontend_dir = root_dir / "frontend"
    if frontend_dir.exists():
        app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")

    return app


# Application entry point
app = create_app()
