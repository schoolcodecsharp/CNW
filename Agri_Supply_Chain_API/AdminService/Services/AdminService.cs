using AdminService.Data;
using AdminService.Models.DTOs;

namespace AdminService.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;

        public AdminService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public List<TaiKhoanDto> GetAllTaiKhoan()
        {
            return _adminRepository.GetAllTaiKhoan();
        }

        public TaiKhoanDto? GetTaiKhoanById(int maTaiKhoan)
        {
            return _adminRepository.GetTaiKhoanById(maTaiKhoan);
        }

        public bool UpdateTaiKhoan(int maTaiKhoan, UpdateTaiKhoanRequest request)
        {
            return _adminRepository.UpdateTaiKhoan(maTaiKhoan, request);
        }

        public (bool success, string message) DeleteTaiKhoan(int maTaiKhoan)
        {
            return _adminRepository.DeleteTaiKhoan(maTaiKhoan);
        }
    }
}
