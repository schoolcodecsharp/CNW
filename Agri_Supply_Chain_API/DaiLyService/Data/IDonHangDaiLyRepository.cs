using DaiLyService.Models.DTOs;

namespace DaiLyService.Data
{
    public interface IDonHangDaiLyRepository
    {
        List<DonHangDaiLyDTO> GetAll();
        DonHangDaiLyDTO? GetById(int maDonHang);
        List<DonHangDaiLyDTO> GetByMaDaiLy(int maDaiLy);
        List<DonHangDaiLyDTO> GetByMaNongDan(int maNongDan);
        int Create(DonHangDaiLyCreateDTO dto);
        bool UpdateTrangThai(int maDonHang, DonHangDaiLyUpdateDTO dto);
        bool Delete(int maDonHang);
    }
}
