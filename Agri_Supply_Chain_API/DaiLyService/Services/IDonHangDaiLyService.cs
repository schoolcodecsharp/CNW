using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public interface IDonHangDaiLyService
    {
        List<DonHangDaiLyDTO> GetAll();
        DonHangDaiLyDTO? GetById(int maDonHang);
        List<DonHangDaiLyDTO> GetByMaDaiLy(int maDaiLy);
        int Create(DonHangDaiLyCreateDTO dto);
        bool UpdateTrangThai(int maDonHang, DonHangDaiLyUpdateDTO dto);
        bool Delete(int maDonHang);
    }
}
