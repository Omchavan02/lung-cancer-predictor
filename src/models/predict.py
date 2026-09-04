"""
ML Inference Layer for Lung Cancer Prediction
Frozen Production Model: Logistic Regression (Balanced, C=0.1, solver='lbfgs')
Operating Decision Threshold: 0.50

This module provides a robust, standalone inference interface for the frozen
model pipeline. It validates input feature dictionaries, standardizes values,
preserves exact feature ordering, computes calibrated probabilities, and
applies the frozen decision threshold to produce structured prediction results.
"""

from dataclasses import asdict, dataclass
import json
from pathlib import Path
from typing import Any, Union
import numpy as np


# The exact feature ordering established during training
FEATURE_ORDER = [
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
    "CHEST_PAIN",
]

SURVEY_FEATURES = [
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
    "CHEST_PAIN",
]


class ValidationError(ValueError):
    """Raised when inference input fails schema or range validation."""
    pass


@dataclass(frozen=True)
class PredictionResult:
    """Structured output returned by the inference engine."""
    prediction: str                      # 'YES' or 'NO'
    prediction_label: str                # Human-readable diagnostic label
    positive_probability: float          # P(LUNG_CANCER = YES)
    negative_probability: float          # P(LUNG_CANCER = NO)
    decision_threshold: float            # Frozen threshold (0.50)
    model_name: str                      # Model identifier
    model_version: str                   # Pipeline version
    is_high_risk: bool                   # True if positive_probability >= threshold
    validated_input: dict[str, Any]      # Standardized input features passed to model

    def to_dict(self) -> dict[str, Any]:
        """Convert result to standard Python dictionary."""
        return asdict(self)


class LungCancerPredictor:
    """
    Inference service for the frozen Lung Cancer Predictor model.
    Loads serialized model metadata, coefficients, and scaling parameters.
    """

    def __init__(self, metadata_path: Union[str, Path, None] = None):
        if metadata_path is None:
            # Resolve relative to current project layout
            candidates = [
                Path("models/model_metadata.json"),
                Path(__file__).resolve().parents[2] / "models" / "model_metadata.json",
                Path.cwd() / "models" / "model_metadata.json",
            ]
            for p in candidates:
                if p.exists():
                    metadata_path = p
                    break
            if metadata_path is None:
                metadata_path = candidates[0]

        self.metadata_path = Path(metadata_path)
        if not self.metadata_path.exists():
            raise FileNotFoundError(f"Model metadata not found at: {self.metadata_path.resolve()}")

        with open(self.metadata_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        self.model_name = self.metadata.get("model_name", "Logistic Regression (Balanced)")
        self.decision_threshold = float(self.metadata.get("operating_threshold", 0.50))
        self.expected_features = self.metadata.get("feature_names", FEATURE_ORDER)
        self.intercept = float(self.metadata.get("intercept", 0.8142))

        # Build fast lookup arrays for scaling and coefficients
        coef_map = {item["Feature"]: item for item in self.metadata["feature_coefficients"]}
        self.means = np.array([coef_map[feat]["Feature Mean"] for feat in self.expected_features], dtype=np.float64)
        self.stds = np.array([coef_map[feat]["Feature Std"] for feat in self.expected_features], dtype=np.float64)
        self.weights = np.array([coef_map[feat]["Standardized Coefficient (Log-Odds)"] for feat in self.expected_features], dtype=np.float64)

    @staticmethod
    def _normalize_key(key: str) -> str:
        """Normalize dictionary key names (trim whitespace, uppercase, space to underscore)."""
        return key.strip().replace(" ", "_").upper()

    def validate_and_transform_inputs(self, raw_inputs: dict[str, Any]) -> tuple[np.ndarray, dict[str, Any]]:
        """
        Validate input feature values against domain schema and return ordered numpy vector.
        """
        if not isinstance(raw_inputs, dict):
            raise ValidationError(f"Expected input as a dictionary, got {type(raw_inputs).__name__}")

        # Normalize key names
        normalized_inputs = {self._normalize_key(k): v for k, v in raw_inputs.items()}

        # Check for missing features
        missing_features = [f for f in self.expected_features if f not in normalized_inputs]
        if missing_features:
            raise ValidationError(f"Missing required feature(s): {', '.join(missing_features)}")

        processed_features: dict[str, Any] = {}

        # 1. Validate and encode GENDER (M -> 1, F -> 0)
        gender_raw = normalized_inputs["GENDER"]
        if isinstance(gender_raw, str):
            gender_clean = gender_raw.strip().upper()
            if gender_clean in ["M", "MALE", "1"]:
                gender_val = 1
            elif gender_clean in ["F", "FEMALE", "0"]:
                gender_val = 0
            else:
                raise ValidationError(f"Invalid GENDER value '{gender_raw}'. Expected 'M', 'F', 'MALE', or 'FEMALE'.")
        elif isinstance(gender_raw, (int, np.integer)):
            if gender_raw in [1, 0]:
                gender_val = int(gender_raw)
            else:
                raise ValidationError(f"Invalid integer for GENDER: {gender_raw}. Expected 1 (Male) or 0 (Female).")
        else:
            raise ValidationError(f"Invalid type for GENDER: {type(gender_raw).__name__}. Expected string or integer.")
        processed_features["GENDER"] = gender_val

        # 2. Validate AGE (Continuous / Integer, Range: 18 to 120)
        age_raw = normalized_inputs["AGE"]
        try:
            age_val = float(age_raw)
        except (ValueError, TypeError):
            raise ValidationError(f"Invalid AGE '{age_raw}'. Must be a valid numerical value.")

        if not (18 <= age_val <= 120):
            raise ValidationError(f"AGE out of realistic domain: {age_val}. Expected range [18, 120].")
        processed_features["AGE"] = age_val

        # 3. Validate Survey Binary Features (1 = NO / ABSENT, 2 = YES / PRESENT)
        for feature in SURVEY_FEATURES:
            val_raw = normalized_inputs[feature]

            if isinstance(val_raw, bool):
                val = 2 if val_raw else 1
            elif isinstance(val_raw, (int, np.integer, float, np.floating)):
                int_val = int(val_raw)
                if int_val in [1, 2]:
                    val = int_val
                elif int_val == 0:  # Allow 0/1 boolean coding gracefully mapped to 1/2
                    val = 1
                else:
                    raise ValidationError(
                        f"Invalid numeric value for '{feature}': {val_raw}. "
                        "Expected 1 (No/Absent) or 2 (Yes/Present)."
                    )
            elif isinstance(val_raw, str):
                s = val_raw.strip().upper()
                if s in ["2", "YES", "TRUE", "PRESENT", "HIGH", "Y"]:
                    val = 2
                elif s in ["1", "0", "NO", "FALSE", "ABSENT", "LOW", "N"]:
                    val = 1
                else:
                    raise ValidationError(
                        f"Invalid string value for '{feature}': '{val_raw}'. "
                        "Expected 'YES'/'NO', '1'/'2', or True/False."
                    )
            else:
                raise ValidationError(
                    f"Unsupported type for '{feature}': {type(val_raw).__name__}."
                )

            processed_features[feature] = val

        # Assemble strictly ordered numeric feature vector
        vector = np.array([processed_features[feat] for feat in self.expected_features], dtype=np.float64)
        return vector, processed_features

    def predict_proba(self, raw_inputs: dict[str, Any]) -> float:
        """
        Compute P(LUNG_CANCER = YES) for a single input dictionary.
        """
        feature_vector, _ = self.validate_and_transform_inputs(raw_inputs)
        # Apply StandardScaler transformation: z = (x - mean) / std
        standardized_vector = (feature_vector - self.means) / self.stds
        # Compute logit: log_odds = intercept + dot(weights, standardized_vector)
        log_odds = self.intercept + np.dot(self.weights, standardized_vector)
        # Sigmoid function
        prob_yes = 1.0 / (1.0 + np.exp(-log_odds))
        return float(prob_yes)

    def predict(self, raw_inputs: dict[str, Any]) -> PredictionResult:
        """
        Execute full inference pipeline and return structured prediction result.
        """
        feature_vector, processed_inputs = self.validate_and_transform_inputs(raw_inputs)

        # Standardize and compute probability
        standardized_vector = (feature_vector - self.means) / self.stds
        log_odds = self.intercept + np.dot(self.weights, standardized_vector)
        prob_yes = float(1.0 / (1.0 + np.exp(-log_odds)))
        prob_no = float(1.0 - prob_yes)

        # Apply frozen decision threshold
        is_positive = prob_yes >= self.decision_threshold
        prediction_str = "YES" if is_positive else "NO"
        label_str = "Lung Cancer (Positive Risk)" if is_positive else "No Lung Cancer (Low Risk)"

        return PredictionResult(
            prediction=prediction_str,
            prediction_label=label_str,
            positive_probability=round(prob_yes, 4),
            negative_probability=round(prob_no, 4),
            decision_threshold=self.decision_threshold,
            model_name=self.model_name,
            model_version="1.0.0 (Phase 5 Frozen)",
            is_high_risk=is_positive,
            validated_input=processed_inputs,
        )


# Global helper instance
_default_predictor: Union[LungCancerPredictor, None] = None


def get_predictor() -> LungCancerPredictor:
    """Return singleton instance of the predictor."""
    global _default_predictor
    if _default_predictor is None:
        _default_predictor = LungCancerPredictor()
    return _default_predictor


def predict(raw_inputs: dict[str, Any]) -> dict[str, Any]:
    """Convenience function returning prediction dictionary."""
    predictor = get_predictor()
    result = predictor.predict(raw_inputs)
    return result.to_dict()
