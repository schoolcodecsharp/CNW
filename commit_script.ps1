# Script để commit code lên GitHub với nhiều commits nhỏ
# Chạy script này trong PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMMIT CODE LÊN GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra git đã init chưa
if (-not (Test-Path ".git")) {
    Write-Host "Khởi tạo Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Đã khởi tạo Git" -ForegroundColor Green
}

# Thêm .gitignore
Write-Host "Commit 1: Add .gitignore" -ForegroundColor Yellow
git add .gitignore
git commit -m "chore: add .gitignore file"

# Backend - Database Setup
Write-Host "Commit 2-5: Database setup" -ForegroundColor Yellow
git add "Agri_Supply_Chain_API/Database_Setup.sql"
git commit -m "feat(database): add database setup script"

git add "Agri_Supply_Chain_API/SETUP_DATABASE_QUICK.sql"
git commit -m "feat(database): add quick setup script with sample accounts"

git add "Agri_Supply_Chain_API/INSERT_SAMPLE_DATA.sql"
git commit -m "feat(database): add sample data insertion script"

git add "Agri_Supply_Chain_API/TEST_CONNECTION.sql"
git commit -m "test(database): add connection test script"

# Backend - Solution and Projects
Write-Host "Commit 6-10: Backend solution setup" -ForegroundColor Yellow
git add "Agri_Supply_Chain_API/*.sln"
git commit -m "feat(backend): add solution file"

git add "Agri_Supply_Chain_API/Gateway/*.csproj" "Agri_Supply_Chain_API/Gateway/Program.cs"
git commit -m "feat(gateway): initialize API Gateway project"

git add "Agri_Supply_Chain_API/Gateway/ocelot.json"
git commit -m "feat(gateway): configure Ocelot routing"

git add "Agri_Supply_Chain_API/Gateway/JwtMiddleware.cs" "Agri_Supply_Chain_API/Gateway/Helpers/"
git commit -m "feat(gateway): add JWT authentication middleware"

git add "Agri_Supply_Chain_API/Gateway/appsettings.json"
git commit -m "config(gateway): add application settings"

# AuthService
Write-Host "Commit 11-15: AuthService" -ForegroundColor Yellow
git add "Agri_Supply_Chain_API/AuthService/*.csproj" "Agri_Supply_Chain_API/AuthService/Program.cs"
git commit -m "feat(auth): initialize AuthService project"

git add "Agri_Supply_Chain_API/AuthService/Controllers/"
git commit -m "feat(auth): add authentication controllers"

git add "Agri_Supply_Chain_API/AuthService/Data/"
git commit -m "feat(auth): add data access layer"

git add "Agri_Supply_Chain_API/AuthService/Models/"
git commit -m "feat(auth): add authentication models"

git add "Agri_Supply_Chain_API/AuthService/appsettings.json"
git commit -m "config(auth): add application settings"

# AdminService
Write-Host "Commit 16-22: AdminService" -ForegroundColor Yellow
git add "Agri_Supply_Chain_API/AdminService/*.csproj" "Agri_Supply_Chain_API/AdminService/Program.cs"
git commit -m "feat(admin): initialize AdminService project"

git add "Agri_Supply_Chain_API/AdminService/Controllers/AdminController.cs"
git commit -m "feat(admin): add admin controller"

git add "Agri_Supply_Chain_API/AdminService/Controllers/UserController.cs"
git commit -m "feat(admin): add user management controller"

git add "Agri_Supply_Chain_API/AdminService/Data/"
git commit -m "feat(admin): add data repositories"

git add "Agri_Supply_Chain_API/AdminService/Services/"
git commit -m "feat(admin): add business services"

git add "Agri_Supply_Chain_API/AdminService/Models/"
git commit -m "feat(admin): add data models and DTOs"

git add "Agri_Supply_Chain_API/AdminService/appsettings.json"
git commit -m "config(admin): add application settings"

# NongDanService
Write-Host "Commit 23-32: NongDanService" -ForegroundColor Yellow
git add "Agri_Supply_Chain_API/NongDanService/*.csproj" "Agri_Supply_Chain_API/NongDanService/Program.cs"
git commit -m "feat(nongdan): initialize NongDanService project"

git add "Agri_Supply_Chain_API/NongDanService/Controllers/NongDanController.cs"
git commit -m "feat(nongdan): add farmer controller"

git add "Agri_Supply_Chain_API/NongDanService/Controllers/TrangTraiController.cs"
git commit -m "feat(nongdan): add farm controller"

git add "Agri_Supply_Chain_API/NongDanService/Controllers/LoNongSanController.cs"
git commit -m "feat(nongdan): add batch controller"

git add "Agri_Supply_Chain_API/NongDanService/Controllers/SanPhamController.cs"
git commit -m "feat(nongdan): add product controller"

git add "Agri_Supply_Chain_API/NongDanService/Controllers/DonHangDaiLyController.cs"
git commit -m "feat(nongdan): add order controller"

git add "Agri_Supply_Chain_API/NongDanService/Data/"
git commit -m "feat(nongdan): add data repositories"

git add "Agri_Supply_Chain_API/NongDanService/Services/"
git commit -m "feat(nongdan): add business services"

git add "Agri_Supply_Chain_API/NongDanService/Models/"
git commit -m "feat(nongdan): add data models"

git add "Agri_Supply_Chain_API/NongDanService/appsettings.json"
git commit -m "config(nongdan): add application settings"

# DaiLyService
Write-Host "Commit 33-42: DaiLyService" -ForegroundColor Yellow
git add "Agri_Supply_Chain_API/DaiLyService/*.csproj" "Agri_Supply_Chain_API/DaiLyService/Program.cs"
git commit -m "feat(daily): initialize DaiLyService project"

git add "Agri_Supply_Chain_API/DaiLyService/Controllers/DaiLyController.cs"
git commit -m "feat(daily): add distributor controller"

git add "Agri_Supply_Chain_API/DaiLyService/Controllers/KhoController.cs"
git commit -m "feat(daily): add warehouse controller"

git add "Agri_Supply_Chain_API/DaiLyService/Controllers/KiemDinhController.cs"
git commit -m "feat(daily): add inspection controller"

git add "Agri_Supply_Chain_API/DaiLyService/Controllers/DonHangDaiLyController.cs"
git commit -m "feat(daily): add distributor order controller"

git add "Agri_Supply_Chain_API/DaiLyService/Controllers/DonHangSieuThiController.cs"
git commit -m "feat(daily): add supermarket order controller"

git add "Agri_Supply_Chain_API/DaiLyService/Data/"
git commit -m "feat(daily): add data repositories"

git add "Agri_Supply_Chain_API/DaiLyService/Services/"
git commit -m "feat(daily): add business services"

git add "Agri_Supply_Chain_API/DaiLyService/Models/"
git commit -m "feat(daily): add data models"

git add "Agri_Supply_Chain_API/DaiLyService/appsettings.json"
git commit -m "config(daily): add application settings"

# SieuThiService
Write-Host "Commit 43-50: SieuThiService" -ForegroundColor Yellow
git add "Agri_Supply_Chain_API/SieuThiService/*.csproj" "Agri_Supply_Chain_API/SieuThiService/Program.cs"
git commit -m "feat(sieuthi): initialize SieuThiService project"

git add "Agri_Supply_Chain_API/SieuThiService/Controllers/"
git commit -m "feat(sieuthi): add supermarket controllers"

git add "Agri_Supply_Chain_API/SieuThiService/Data/"
git commit -m "feat(sieuthi): add data repositories"

git add "Agri_Supply_Chain_API/SieuThiService/Models/"
git commit -m "feat(sieuthi): add data models"

git add "Agri_Supply_Chain_API/SieuThiService/appsettings.json"
git commit -m "config(sieuthi): add application settings"

# Frontend - Setup
Write-Host "Commit 51-55: Frontend setup" -ForegroundColor Yellow
git add "frontend/package.json" "frontend/server.js"
git commit -m "feat(frontend): initialize Node.js backend server"

git add "frontend/client/package.json"
git commit -m "feat(frontend): initialize React client"

git add "frontend/client/public/"
git commit -m "feat(frontend): add public assets"

git add "frontend/client/src/index.js" "frontend/client/src/index.css"
git commit -m "feat(frontend): add React entry point"

git add "frontend/client/src/App.jsx" "frontend/client/src/App.css"
git commit -m "feat(frontend): add main App component with routing"

# Frontend - Context & Services
Write-Host "Commit 56-58: Frontend context and services" -ForegroundColor Yellow
git add "frontend/client/src/context/"
git commit -m "feat(frontend): add authentication context"

git add "frontend/client/src/services/apiConfig.js"
git commit -m "feat(frontend): add API configuration"

git add "frontend/client/src/services/authService.js"
git commit -m "feat(frontend): add authentication service"

# Frontend - Auth Pages
Write-Host "Commit 59-62: Frontend auth pages" -ForegroundColor Yellow
git add "frontend/client/src/pages/LandingPage.jsx" "frontend/client/src/pages/LandingPage.css"
git commit -m "feat(frontend): add landing page"

git add "frontend/client/src/pages/LoginPage.jsx" "frontend/client/src/pages/AuthPages.css"
git commit -m "feat(frontend): add login page"

git add "frontend/client/src/pages/RegisterPage.jsx"
git commit -m "feat(frontend): add registration page"

git add "frontend/client/src/pages/ForgotPasswordPage.jsx"
git commit -m "feat(frontend): add forgot password page"

# Frontend - Admin Dashboard
Write-Host "Commit 63-65: Admin dashboard" -ForegroundColor Yellow
git add "frontend/client/src/pages/admin/AdminDashboard.jsx" "frontend/client/src/pages/admin/AdminDashboard.css"
git commit -m "feat(admin-ui): add admin dashboard layout"

git add "frontend/client/src/pages/admin/AdminOverview.jsx"
git commit -m "feat(admin-ui): add admin overview page"

git add "frontend/client/src/pages/admin/UserManagement.jsx"
git commit -m "feat(admin-ui): add user management page"

# Frontend - NongDan Dashboard
Write-Host "Commit 66-71: NongDan dashboard" -ForegroundColor Yellow
git add "frontend/client/src/pages/nongdan/NongDanDashboard.jsx" "frontend/client/src/pages/nongdan/NongDanDashboard.css"
git commit -m "feat(nongdan-ui): add farmer dashboard with modern design"

git add "frontend/client/src/pages/nongdan/NongDanOverview.jsx"
git commit -m "feat(nongdan-ui): add farmer overview page"

git add "frontend/client/src/pages/nongdan/FarmManagement.jsx"
git commit -m "feat(nongdan-ui): add farm management page"

git add "frontend/client/src/pages/nongdan/BatchManagement.jsx"
git commit -m "feat(nongdan-ui): add batch management page"

git add "frontend/client/src/pages/nongdan/OrderManagement.jsx"
git commit -m "feat(nongdan-ui): add order management page"

git add "frontend/client/src/pages/nongdan/ProductList.jsx"
git commit -m "feat(nongdan-ui): add product list page"

# Frontend - DaiLy Dashboard
Write-Host "Commit 72-76: DaiLy dashboard" -ForegroundColor Yellow
git add "frontend/client/src/pages/daily/DaiLyDashboard.jsx" "frontend/client/src/pages/daily/DaiLyDashboard.css"
git commit -m "feat(daily-ui): add distributor dashboard with blue theme"

git add "frontend/client/src/pages/daily/DaiLyOverview.jsx"
git commit -m "feat(daily-ui): add distributor overview page"

git add "frontend/client/src/pages/daily/WarehouseManagement.jsx"
git commit -m "feat(daily-ui): add warehouse management page"

git add "frontend/client/src/pages/daily/OrderManagement.jsx"
git commit -m "feat(daily-ui): add order management page"

git add "frontend/client/src/pages/daily/PlaceOrder.jsx"
git commit -m "feat(daily-ui): add place order page"

# Frontend - SieuThi Dashboard
Write-Host "Commit 77-80: SieuThi dashboard" -ForegroundColor Yellow
git add "frontend/client/src/pages/sieuthi/SieuThiDashboard.jsx" "frontend/client/src/pages/sieuthi/SieuThiDashboard.css"
git commit -m "feat(sieuthi-ui): add supermarket dashboard with purple theme"

git add "frontend/client/src/pages/sieuthi/SieuThiOverview.jsx"
git commit -m "feat(sieuthi-ui): add supermarket overview page"

git add "frontend/client/src/pages/sieuthi/WarehouseManagement.jsx"
git commit -m "feat(sieuthi-ui): add warehouse management page"

git add "frontend/client/src/pages/sieuthi/OrderManagement.jsx" "frontend/client/src/pages/sieuthi/PlaceOrder.jsx"
git commit -m "feat(sieuthi-ui): add order management and place order pages"

# Frontend - Components
Write-Host "Commit 81: Components" -ForegroundColor Yellow
git add "frontend/client/src/components/"
git commit -m "feat(frontend): add reusable components"

# README
Write-Host "Commit 82: Documentation" -ForegroundColor Yellow
git add "README.md"
git commit -m "docs: add project documentation"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ ĐÃ TẠO 82 COMMITS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Bước tiếp theo:" -ForegroundColor Yellow
Write-Host "1. Tạo repository trên GitHub" -ForegroundColor White
Write-Host "2. Chạy: git remote add origin <URL-repo-của-bạn>" -ForegroundColor White
Write-Host "3. Chạy: git branch -M main" -ForegroundColor White
Write-Host "4. Chạy: git push -u origin main" -ForegroundColor White
Write-Host ""
