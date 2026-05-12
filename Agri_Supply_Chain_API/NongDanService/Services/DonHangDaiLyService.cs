using NongDanService.Data;
using NongDanService.Models.DTOs;

namespace NongDanService.Services
{
    public class DonHangDaiLyService : IDonHangDaiLyService
    {
        private readonly IDonHangDaiLyRepository _repo;

        public DonHangDaiLyService(IDonHangDaiLyRepository repo)
        {
            _repo = repo;
        }

        // Đơn hàng
        public List<DonHangDaiLyDTO> GetAll() => _repo.GetAll();
        public DonHangDaiLyDTO? GetById(int id) => _repo.GetById(id);
        public List<DonHangDaiLyDTO> GetByNongDanId(int maNongDan) => _repo.GetByNongDanId(maNongDan);
        public List<DonHangDaiLyDTO> GetByDaiLyId(int maDaiLy) => _repo.GetByDaiLyId(maDaiLy);
        public int Create(DonHangDaiLyCreateDTO dto) => _repo.Create(dto);
        public bool Update(int id, DonHangDaiLyUpdateDTO dto) => _repo.Update(id, dto);
        public bool UpdateTrangThai(int id, string trangThai) => _repo.UpdateTrangThai(id, trangThai);
        public bool XacNhanDonChoKiemDuyet(int id, int maNongDan) => _repo.XacNhanDonChoKiemDuyet(id, maNongDan);
        public bool XuLyHoanDon(int id, int maNongDan) => _repo.XuLyHoanDon(id, maNongDan);
        public bool HuyDonHang(int id, int maNongDan) => _repo.HuyDonHang(id, maNongDan);
        public bool XuatDon(int id) => _repo.UpdateTrangThai(id, "da_xuat");
        public bool Delete(int id) => _repo.Delete(id);
        public List<DonHangDaiLyDTO> GetDonHangChuaXacNhan(int maNongDan) => _repo.GetDonHangChuaXacNhan(maNongDan);
        public List<DonHangDaiLyDTO> GetDonHangHoanDon(int maNongDan) => _repo.GetDonHangHoanDon(maNongDan);

        // Chi tiết đơn hàng
        public List<ChiTietDonHangDTO> GetChiTietDonHang(int maDonHang) => _repo.GetChiTietDonHang(maDonHang);
        public bool ThemChiTiet(int maDonHang, ChiTietDonHangItemDTO item) => _repo.ThemChiTiet(maDonHang, item);
        public bool CapNhatChiTiet(int maDonHang, int maLo, ChiTietDonHangItemDTO item) => _repo.CapNhatChiTiet(maDonHang, maLo, item);
        public bool XoaChiTiet(int maDonHang, int maLo) => _repo.XoaChiTiet(maDonHang, maLo);
    }
}
