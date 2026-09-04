/**
 * Lung Cancer Predictor — Frontend Application Logic
 * Communicates with FastAPI backend /predict endpoint.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("prediction-form");
  const submitBtn = document.getElementById("submit-btn");
  const btnSpinner = document.getElementById("btn-spinner");
  const btnText = document.getElementById("btn-text");
  const resetBtn = document.getElementById("reset-btn");
  const errorAlert = document.getElementById("error-alert");

  const resultSection = document.getElementById("result-section");
  const resultTitle = document.getElementById("result-title");
  const resultBadge = document.getElementById("result-badge");
  const metricPred = document.getElementById("metric-pred");
  const metricPosProb = document.getElementById("metric-pos-prob");
  const metricNegProb = document.getElementById("metric-neg-prob");
  const metricThreshold = document.getElementById("metric-threshold");
  const barLabelPos = document.getElementById("bar-label-pos");
  const barLabelNeg = document.getElementById("bar-label-neg");
  const probBarPos = document.getElementById("prob-bar-pos");
  const probBarNeg = document.getElementById("prob-bar-neg");
  const metaModelName = document.getElementById("meta-model-name");
  const metaModelVer = document.getElementById("meta-model-ver");

  // Helper: Display error message
  function showError(message) {
    errorAlert.textContent = message;
    errorAlert.style.display = "block";
    errorAlert.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Helper: Clear error message
  function clearError() {
    errorAlert.textContent = "";
    errorAlert.style.display = "none";
  }

  // Helper: Set UI Loading State
  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      btnSpinner.style.display = "inline-block";
      btnText.textContent = "Calculating Risk...";
    } else {
      submitBtn.disabled = false;
      btnSpinner.style.display = "none";
      btnText.textContent = "Generate Prediction";
    }
  }

  // Helper: Extract form values and validate
  function getValidatedFormData() {
    const formData = new FormData(form);

    // 1. Validate GENDER
    const gender = formData.get("GENDER");
    if (!gender || !["M", "F"].includes(gender)) {
      throw new Error("Please select a valid gender (Male or Female).");
    }

    // 2. Validate AGE
    const ageRaw = formData.get("AGE");
    if (!ageRaw || isNaN(ageRaw)) {
      throw new Error("Please enter a valid numeric age.");
    }
    const age = parseFloat(ageRaw);
    if (age < 18 || age > 120) {
      throw new Error("Patient age must be between 18 and 120 years.");
    }

    // 3. Validate Binary Survey Symptoms
    const binaryKeys = [
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
    ];

    const payload = {
      GENDER: gender,
      AGE: age,
    };

    for (const key of binaryKeys) {
      const val = formData.get(key);
      if (!val || !["1", "2"].includes(val)) {
        throw new Error(`Please select Yes or No for all symptoms (${key.replace("_", " ")}).`);
      }
      payload[key] = parseInt(val, 10);
    }

    return payload;
  }

  // Helper: Render Prediction Result Card
  function displayResult(data) {
    const isPositive = data.prediction === "YES";
    const posPct = (data.positive_probability * 100).toFixed(2);
    const negPct = (data.negative_probability * 100).toFixed(2);
    const thPct = (data.decision_threshold * 100).toFixed(1);

    // Update Result Card class styling
    resultSection.classList.remove("positive", "negative");
    resultSection.classList.add(isPositive ? "positive" : "negative");

    // Update Badge & Title
    resultBadge.className = "result-tag " + (isPositive ? "tag-positive" : "tag-negative");
    resultBadge.textContent = isPositive ? "Positive Risk" : "Low Risk";
    resultTitle.textContent = isPositive
      ? "Positive Risk Classification (YES)"
      : "Low Risk Classification (NO)";

    // Update Metric Boxes
    metricPred.textContent = data.prediction;
    metricPred.className = "metric-value " + (isPositive ? "positive-color" : "negative-color");
    metricPosProb.textContent = `${posPct}%`;
    metricNegProb.textContent = `${negPct}%`;
    metricThreshold.textContent = `${thPct}%`;

    // Update Progress Bar
    barLabelPos.textContent = `${posPct}%`;
    barLabelNeg.textContent = `${negPct}%`;
    probBarPos.style.width = `${posPct}%`;
    probBarNeg.style.width = `${negPct}%`;

    // Update Model Metadata
    metaModelName.textContent = data.model_name || "Logistic Regression (Balanced)";
    metaModelVer.textContent = data.model_version || "1.0.0";

    // Show result card and scroll smoothly
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Form Submit Handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    let payload;
    try {
      payload = getValidatedFormData();
    } catch (valErr) {
      showError(valErr.message);
      return;
    }

    setLoading(true);

    const targetUrl = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.PREDICT}`;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMsg = `Server error (${response.status})`;
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMsg = errorData.detail.map((d) => d.msg || JSON.stringify(d)).join(", ");
          } else {
            errorMsg = errorData.detail;
          }
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      displayResult(result);
    } catch (err) {
      console.error("Prediction API Error:", err);
      showError(`Prediction request failed: ${err.message}. Ensure the backend API is running at ${CONFIG.API_BASE_URL}.`);
    } finally {
      setLoading(false);
    }
  });

  // Form Reset Handler
  resetBtn.addEventListener("click", () => {
    form.reset();
    clearError();
    resultSection.style.display = "none";
    resultSection.classList.remove("positive", "negative");
  });
});
