using DaiLyService.Data;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public class DonHangDaiLyService : IDonHangDaiLyService
    {
        private readonly IDonHangDaiLyRepository _repo;

        public DonHangDaiLyService(IDonHangDaiLyRepository repo)
        {
            _repo = repo;
        }

        public List<DonHangDaiLyDTO> GetAll() => _repo.GetAll();

        public DonHangDaiLyDTO? GetById(int maDonHang) => _repo.GetById(maDonHang);

        public List<DonHangDaiLyDTO> GetByMaDaiLy(int maDaiLy) => _repo.GetByMaDaiLy(maDaiLy);

        public int Create(DonHangDaiLyCreateDTO dto) => _repo.Create(dto);

        public bool UpdateTrangThai(int maDonHang, DonHangDaiLyUpdateDTO dto) 
            => _repo.UpdateTrangThai(maDonHang, dto);

        public bool Delete(int maDonHang) => _repo.Delete(maDonHang);
    }
}
