using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public interface IDonHangDaiLyService
    {
        List<DonHangDaiLyDTO> GetAll();
        DonHangDaiLyDTO? GetById(int maDonHang);
        List<DonHangDaiLyDTO> GetByMaDaiLy(int maDaiLy);
        List<DonHangDaiLyDTO> GetByMaNongDan(int maNongDan);
        int Create(DonHangDaiLyCreateDTO dto);
        bool UpdateTrangThai(int maDonHang, DonHangDaiLyUpdateDTO dto);
        bool Delete(int maDonHang);
        bool XacNhanDon(int maDonHang, int maKho);
        bool HuyDon(int maDonHang);
        bool XuatDon(int maDonHang, XuatDonRequest request);
    }
}
