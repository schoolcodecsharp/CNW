@echo off
chcp 65001 >nul
echo ========================================
echo   KHỞI ĐỘNG HỆ THỐNG CHUỖI CUNG ỨNG
echo ========================================
echo.

echo Đang khởi động các services...
echo.

start "Gateway" cmd /k "cd Gateway && dotnet run"
timeout /t 2 /nobreak >nul

start "AuthService" cmd /k "cd AuthService && dotnet run"
timeout /t 2 /nobreak >nul

start "AdminService" cmd /k "cd AdminService && dotnet run"
timeout /t 2 /nobreak >nul

start "NongDanService" cmd /k "cd NongDanService && dotnet run"
timeout /t 2 /nobreak >nul

start "DaiLyService" cmd /k "cd DaiLyService && dotnet run"
timeout /t 2 /nobreak >nul

start "SieuThiService" cmd /k "cd SieuThiService && dotnet run"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   TẤT CẢ SERVICES ĐÃ ĐƯỢC KHỞI ĐỘNG!
echo ========================================
echo.
echo Các services đang chạy:
echo   • Gateway: http://localhost:5041
echo   • AuthService: http://localhost:5297
echo   • AdminService: http://localhost:5274
echo   • NongDanService: http://localhost:5251
echo   • DaiLyService: http://localhost:5214
echo   • SieuThiService: http://localhost:5291
echo.
echo Đóng cửa sổ này để dừng script (services vẫn chạy)
echo Đóng từng cửa sổ service để dừng từng service
echo.
pause
