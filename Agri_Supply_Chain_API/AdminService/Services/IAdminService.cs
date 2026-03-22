using AdminService.Models.DTOs;

namespace AdminService.Services
{
    public interface IAdminService
    {
        List<TaiKhoanDto> GetAllTaiKhoan();
        TaiKhoanDto? GetTaiKhoanById(int maTaiKhoan);
        bool UpdateTaiKhoan(int maTaiKhoan, UpdateTaiKhoanRequest request);
        (bool success, string message) DeleteTaiKhoan(int maTaiKhoan);
    }
}
