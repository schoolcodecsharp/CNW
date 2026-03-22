using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public interface IDonHangSieuThiService
    {
        List<DonHangSieuThiDTO> GetByMaDaiLy(int maDaiLy);
        DonHangSieuThiDTO? GetById(int maDonHang);
        bool UpdateTrangThai(int maDonHang, DonHangSieuThiUpdateDTO dto);
    }
}
