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

        // ==================== Ð?I L? MANAGEMENT ====================
        
        public List<DaiLyDto> GetAllDaiLy()
        {
            return _adminRepository.GetAllDaiLy();
        }

        public DaiLyDto? GetDaiLyById(int maDaiLy)
        {
            return _adminRepository.GetDaiLyById(maDaiLy);
        }

        public (bool success, int maDaiLy, string message) CreateDaiLy(CreateDaiLyRequest request)
        {
            return _adminRepository.CreateDaiLy(request);
        }

        public bool UpdateDaiLy(int maDaiLy, UpdateDaiLyRequest request)
        {
            return _adminRepository.UpdateDaiLy(maDaiLy, request);
        }

        public bool DeleteDaiLy(int maDaiLy)
        {
            return _adminRepository.DeleteDaiLy(maDaiLy);
        }

        // ==================== SIÊU TH? MANAGEMENT ====================
        
        public List<SieuThiDto> GetAllSieuThi()
        {
            return _adminRepository.GetAllSieuThi();
        }

        public SieuThiDto? GetSieuThiById(int maSieuThi)
        {
            return _adminRepository.GetSieuThiById(maSieuThi);
        }

        public (bool success, int maSieuThi, string message) CreateSieuThi(CreateSieuThiRequest request)
        {
            return _adminRepository.CreateSieuThi(request);
        }

        public bool UpdateSieuThi(int maSieuThi, UpdateSieuThiRequest request)
        {
            return _adminRepository.UpdateSieuThi(maSieuThi, request);
        }

        public bool DeleteSieuThi(int maSieuThi)
        {
            return _adminRepository.DeleteSieuThi(maSieuThi);
        }
    }
}
