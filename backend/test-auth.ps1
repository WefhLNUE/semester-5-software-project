# Test Authentication Script
# This script will register a test user and then try to login

Write-Host "=== Testing Authentication ===" -ForegroundColor Green

# 1. Register a test user
Write-Host "`n1. Registering test user..." -ForegroundColor Yellow

$registerBody = @{
    firstName = "Test"
    lastName = "User"
    nationalId = "TEST123456"
    password = "Password123!"
    dateOfHire = "2024-01-01"
    workEmail = "test@example.com"
    roles = @("DEPARTMENT_EMPLOYEE")
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/auth/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json" `
        -SessionVariable session

    Write-Host "✅ User registered successfully!" -ForegroundColor Green
    Write-Host "Employee Number: $($registerResponse.user.employeeNumber)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# 2. Try to login
Write-Host "`n2. Testing login..." -ForegroundColor Yellow

$loginBody = @{
    workEmail = "test@example.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -WebSession $session

    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Message: $($loginResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
