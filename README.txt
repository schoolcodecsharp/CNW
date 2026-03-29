═══════════════════════════════════════════════════════════════════
  HỆ THỐNG QUẢN LÝ CHUỖI CUNG ỨNG NÔNG SẢN
═══════════════════════════════════════════════════════════════════

📁 CẤU TRÚC DỰ ÁN:
─────────────────────────────────────────────────────────────────

1. Agri_Supply_Chain_API/     - Backend .NET Core (5 microservices)
   • AuthService (Port 5001)
   • AdminService (Port 5002)
   • NongDanService (Port 5003)
   • DaiLyService (Port 5004)
   • SieuThiService (Port 5005)

2. frontend/                   - Frontend mới (Node.js + React)
   • Backend: Node.js + TypeScript + Express (Port 6000)
   • Frontend: React (Port 3000)

3. API/                        - API cũ (nếu có)
4. BTL_HDV/                    - Tài liệu/Database

═══════════════════════════════════════════════════════════════════
  KHỞI ĐỘNG NHANH
═══════════════════════════════════════════════════════════════════

🚀 FRONTEND MỚI (Node.js + React):
   1. Double-click: INSTALL_FRONTEND.bat (lần đầu tiên)
   2. Double-click: START_FRONTEND.bat
   3. Truy cập: http://localhost:3000
   4. Login: admin / admin123

🔧 BACKEND .NET CORE (nếu cần):
   Mở 5 terminals và chạy:
   • cd Agri_Supply_Chain_API/AuthService && dotnet run
   • cd Agri_Supply_Chain_API/AdminService && dotnet run
   • cd Agri_Supply_Chain_API/NongDanService && dotnet run
   • cd Agri_Supply_Chain_API/DaiLyService && dotnet run
   • cd Agri_Supply_Chain_API/SieuThiService && dotnet run

═══════════════════════════════════════════════════════════════════
  TÀI LIỆU
═══════════════════════════════════════════════════════════════════

📖 KHOI_DONG_FRONTEND_MOI.html  - Hướng dẫn chi tiết (mở bằng browser)
📄 HUONG_DAN_FRONTEND_MOI.txt   - Hướng dẫn text
📘 frontend/README.md           - Documentation frontend

═══════════════════════════════════════════════════════════════════
  YÊU CẦU HỆ THỐNG
═══════════════════════════════════════════════════════════════════

✅ Node.js >= 14.x
✅ npm >= 6.x
✅ .NET Core 8.0 (cho backend .NET)
✅ SQL Server (cho backend .NET)

═══════════════════════════════════════════════════════════════════
