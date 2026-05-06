using NongDanService.Models.DTOs;

namespace NongDanService.Data
{
    public interface IDonHangDaiLyRepository
    {
        // Đơn hàng
        List<DonHangDaiLyDTO> GetAll();
        DonHangDaiLyDTO? GetById(int id);
        List<DonHangDaiLyDTO> GetByNongDanId(int maNongDan);
        List<DonHangDaiLyDTO> GetByDaiLyId(int maDaiLy);
        int Create(DonHangDaiLyCreateDTO dto);
        bool Update(int id, DonHangDaiLyUpdateDTO dto);
        bool UpdateTrangThai(int id, string trangThai);
        bool XacNhanDon(int id, int maKho);
        bool XacNhanDonChoKiemDuyet(int id, int maNongDan);
        bool XuLyHoanDon(int id, int maNongDan);
        bool HuyDonHang(int id, int maNongDan);
        bool Delete(int id);
        List<DonHangDaiLyDTO> GetDonHangChuaXacNhan(int maNongDan);
        List<DonHangDaiLyDTO> GetDonHangHoanDon(int maNongDan);
        
        // Chi tiết đơn hàng
        List<ChiTietDonHangDTO> GetChiTietDonHang(int maDonHang);
        bool ThemChiTiet(int maDonHang, ChiTietDonHangItemDTO item);
        bool CapNhatChiTiet(int maDonHang, int maLo, ChiTietDonHangItemDTO item);
        bool XoaChiTiet(int maDonHang, int maLo);
    }
}
