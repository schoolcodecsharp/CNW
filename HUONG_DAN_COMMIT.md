# 📝 HƯỚNG DẪN COMMIT CODE LÊN GITHUB

## Bước 1: Chuẩn Bị

1. Tạo repository mới trên GitHub (không tích "Initialize with README")
2. Copy URL của repository (ví dụ: https://github.com/username/repo-name.git)

## Bước 2: Chạy Script Commit

Mở PowerShell tại thư mục dự án và chạy:

```powershell
# Cho phép chạy script
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# Chạy script commit
.\commit_script.ps1
```

Script sẽ tự động tạo 82 commits với các message rõ ràng.

## Bước 3: Push Lên GitHub

Sau khi script chạy xong, thực hiện:

```bash
# Thêm remote repository
git remote add origin <URL-repo-của-bạn>

# Đổi tên branch thành main
git branch -M main

# Push code lên GitHub
git push -u origin main
```

## Kết Quả

Bạn sẽ có 82 commits được tổ chức theo:
- Commits 1-5: Database setup
- Commits 6-10: Gateway setup
- Commits 11-15: AuthService
- Commits 16-22: AdminService
- Commits 23-32: NongDanService
- Commits 33-42: DaiLyService
- Commits 43-50: SieuThiService
- Commits 51-58: Frontend setup & services
- Commits 59-62: Auth pages
- Commits 63-65: Admin dashboard
- Commits 66-71: NongDan dashboard
- Commits 72-76: DaiLy dashboard
- Commits 77-80: SieuThi dashboard
- Commits 81-82: Components & Documentation

## Lưu Ý

- File .gitignore đã được cấu hình để không commit:
  - node_modules/
  - bin/, obj/, Debug/, Release/
  - .vs/, .vscode/
  - Các file test HTML
  - Các file hướng dẫn .txt
  - Các file .bat, .docx

- Chỉ commit code nguồn và file cấu hình cần thiết
