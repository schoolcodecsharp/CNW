using DaiLyService.Data;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public class DaiLyBusinessService : IDaiLyService
    {
        private readonly IDaiLyRepository _repo;

        public DaiLyBusinessService(IDaiLyRepository repo)
        {
            _repo = repo;
        }

        public List<DaiLyPhanHoi> GetAll() => _repo.GetAll();

        public DaiLyPhanHoi? GetById(int maDaiLy) => _repo.GetById(maDaiLy);

        public int Create(DaiLyTaoMoi dto) => _repo.Create(dto);

        public bool Update(int maDaiLy, DaiLyUpdateDTO dto) => _repo.Update(maDaiLy, dto);

        public bool Delete(int maDaiLy) => _repo.Delete(maDaiLy);

        public List<DaiLyPhanHoi> Search(string? tenDaiLy, string? soDienThoai) 
            => _repo.Search(tenDaiLy, soDienThoai);
    }
}
