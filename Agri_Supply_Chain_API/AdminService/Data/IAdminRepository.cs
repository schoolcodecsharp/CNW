using AdminService.Models.DTOs;

namespace AdminService.Data
{
    public interface IAdminRepository
    {
        List<TaiKhoanDto> GetAllTaiKhoan();
        TaiKhoanDto? GetTaiKhoanById(int maTaiKhoan);
        bool UpdateTaiKhoan(int maTaiKhoan, UpdateTaiKhoanRequest request);
        (bool success, string message) DeleteTaiKhoan(int maTaiKhoan);

        // Đại lý management
        List<DaiLyDto> GetAllDaiLy();
        DaiLyDto? GetDaiLyById(int maDaiLy);
        (bool success, int maDaiLy, string message) CreateDaiLy(CreateDaiLyRequest request);
        bool UpdateDaiLy(int maDaiLy, UpdateDaiLyRequest request);
        bool DeleteDaiLy(int maDaiLy);

        // Siêu thị management
        List<SieuThiDto> GetAllSieuThi();
        SieuThiDto? GetSieuThiById(int maSieuThi);
        (bool success, int maSieuThi, string message) CreateSieuThi(CreateSieuThiRequest request);
        bool UpdateSieuThi(int maSieuThi, UpdateSieuThiRequest request);
        bool DeleteSieuThi(int maSieuThi);
    }
}
