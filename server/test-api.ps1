# Quick API Test Script
Write-Host "Testing SnapStim Backend API..." -ForegroundColor Cyan

$baseUrl = "http://localhost:8787"
$userId = "test-user-123"
$clientId = "test-client-456"
$programId = "test-program-789"

function Test-Endpoint {
    param($method, $url, $body = $null)
    try {
        $params = @{
            Uri = $url
            Method = $method
            UseBasicParsing = $true
            ContentType = "application/json"
        }
        if ($body) { $params.Body = ($body | ConvertTo-Json -Depth 10) }
        
        $response = Invoke-WebRequest @params -ErrorAction Stop
        Write-Host "✅ $method $url - Status: $($response.StatusCode)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $method $url - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "`nCore Endpoints:" -ForegroundColor Yellow
Test-Endpoint "GET" "$baseUrl/api/health"

Write-Host "`nProgram Endpoints:" -ForegroundColor Yellow
Test-Endpoint "GET" "$baseUrl/api/program/list?userId=$userId"
Test-Endpoint "GET" "$baseUrl/api/program/list?userId=$userId&clientId=$clientId"

Write-Host "`nSession Endpoints:" -ForegroundColor Yellow
Test-Endpoint "GET" "$baseUrl/api/sessions?userId=$userId"

Write-Host "`nStimuli Endpoints:" -ForegroundColor Yellow
Test-Endpoint "GET" "$baseUrl/api/stimuli/list?userId=$userId&programId=$programId"
Test-Endpoint "GET" "$baseUrl/api/stimuli/history?userId=$userId&limit=10"

Write-Host "`nClient Endpoints:" -ForegroundColor Yellow
Test-Endpoint "GET" "$baseUrl/api/client/list?userId=$userId"

Write-Host "`n✨ Backend server is operational!" -ForegroundColor Cyan
