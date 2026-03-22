using SieuThiService.Models.DTOs;
using SieuThiService.Models.Entities;

namespace SieuThiService.Data
{
    public interface ISieuThiRepository
    {
        // API gộp (hiện tại)
        bool CreateDonHang(CreateDonHangSieuThiRequest request);
        DonHangSieuThiResponse? GetDonHangById(int maDonHang);
        List<DonHangSieuThiResponse> GetDonHangsBySieuThi(int maSieuThi);
        
        // API riêng biệt cho quản lý
        bool CreateDonHangOnly(CreateDonHangRequest request);
        bool AddChiTietDonHang(CreateChiTietDonHangRequest request);
        bool UpdateChiTietDonHang(UpdateChiTietDonHangRequest request);
        bool DeleteChiTietDonHang(DeleteChiTietDonHangRequest request);
        bool HuyDonHang(int maDonHang);
        bool NhanHang(int maDonHang, NhanHangRequest request);
        
        // API kho hàng
        List<KhoSimpleInfo> GetDanhSachKhoBySieuThi(int maSieuThi);
        KhoHangResponse? GetKhoHangById(int maKho);
        bool CreateKho(CreateKhoRequest request);
        bool UpdateKho(UpdateKhoRequest request);
        bool DeleteKho(int maKho);
        bool DeleteTonKho(DeleteTonKhoRequest request);
        
        bool GetSieuThiById(int maSieuThi);
    }
}
