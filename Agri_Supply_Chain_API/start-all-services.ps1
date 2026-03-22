# Script để chạy tất cả services cùng lúc
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  KHỞI ĐỘNG HỆ THỐNG CHUỖI CUNG ỨNG" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra .NET SDK
Write-Host "Kiểm tra .NET SDK..." -ForegroundColor Yellow
$dotnetVersion = dotnet --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ .NET SDK version: $dotnetVersion" -ForegroundColor Green
} else {
    Write-Host "✗ .NET SDK không được cài đặt!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Đang khởi động các services..." -ForegroundColor Yellow
Write-Host ""

# Danh sách các services và ports
$services = @(
    @{Name="Gateway"; Path="Gateway"; Port=5041}
    @{Name="AuthService"; Path="AuthService"; Port=5297}
    @{Name="AdminService"; Path="AdminService"; Port=5274}
    @{Name="NongDanService"; Path="NongDanService"; Port=5251}
    @{Name="DaiLyService"; Path="DaiLyService"; Port=5214}
    @{Name="SieuThiService"; Path="SieuThiService"; Port=5291}
)

$jobs = @()

foreach ($service in $services) {
    Write-Host "→ Khởi động $($service.Name) trên port $($service.Port)..." -ForegroundColor Cyan
    
    $job = Start-Job -ScriptBlock {
        param($servicePath, $serviceName)
        Set-Location $servicePath
        dotnet run 2>&1
    } -ArgumentList $service.Path, $service.Name -Name $service.Name
    
    $jobs += $job
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  TẤT CẢ SERVICES ĐÃ ĐƯỢC KHỞI ĐỘNG!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Các services đang chạy:" -ForegroundColor Yellow
foreach ($service in $services) {
    Write-Host "  • $($service.Name): http://localhost:$($service.Port)" -ForegroundColor White
    Write-Host "    Swagger: http://localhost:$($service.Port)/swagger" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Nhấn Ctrl+C để dừng tất cả services..." -ForegroundColor Yellow
Write-Host ""

# Hiển thị output của các services
try {
    while ($true) {
        foreach ($job in $jobs) {
            $output = Receive-Job -Job $job
            if ($output) {
                Write-Host "[$($job.Name)] $output" -ForegroundColor DarkGray
            }
        }
        Start-Sleep -Seconds 2
    }
}
finally {
    Write-Host ""
    Write-Host "Đang dừng tất cả services..." -ForegroundColor Yellow
    $jobs | Stop-Job
    $jobs | Remove-Job
    Write-Host "✓ Đã dừng tất cả services" -ForegroundColor Green
}
