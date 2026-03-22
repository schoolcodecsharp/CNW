using DaiLyService.Data;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public class DonHangSieuThiService : IDonHangSieuThiService
    {
        private readonly IDonHangSieuThiRepository _repo;

        public DonHangSieuThiService(IDonHangSieuThiRepository repo)
        {
            _repo = repo;
        }

        public List<DonHangSieuThiDTO> GetByMaDaiLy(int maDaiLy) => _repo.GetByMaDaiLy(maDaiLy);

        public DonHangSieuThiDTO? GetById(int maDonHang) => _repo.GetById(maDonHang);

        public bool UpdateTrangThai(int maDonHang, DonHangSieuThiUpdateDTO dto) 
            => _repo.UpdateTrangThai(maDonHang, dto);
    }
}
