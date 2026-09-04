$report = Get-Content -Raw -Path "$PSScriptRoot/../reports/final_model_evaluation.json" | ConvertFrom-Json
$acc = [double]$report.selected_final_model.holdout_test_evaluation_n56.accuracy * 100
Write-Host ("Frozen Final Holdout Accuracy: {0:N2}%" -f $acc)
