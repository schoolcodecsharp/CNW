using DaiLyService.Models.DTOs;

namespace DaiLyService.Data
{
    public interface IDonHangSieuThiRepository
    {
        List<DonHangSieuThiDTO> GetByMaDaiLy(int maDaiLy);
        DonHangSieuThiDTO? GetById(int maDonHang);
        bool UpdateTrangThai(int maDonHang, DonHangSieuThiUpdateDTO dto);
    }
}
