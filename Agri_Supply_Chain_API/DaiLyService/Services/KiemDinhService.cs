using DaiLyService.Data;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public class KiemDinhService : IKiemDinhService
    {
        private readonly IKiemDinhRepository _repo;

        public KiemDinhService(IKiemDinhRepository repo)
        {
            _repo = repo;
        }

        public List<KiemDinhDTO> GetAll() => _repo.GetAll();

        public KiemDinhDTO? GetById(int maKiemDinh) => _repo.GetById(maKiemDinh);

        public List<KiemDinhDTO> GetByMaDaiLy(int maDaiLy) => _repo.GetByMaDaiLy(maDaiLy);

        public int Create(KiemDinhCreateDTO dto) => _repo.Create(dto);

        public bool Update(int maKiemDinh, KiemDinhUpdateDTO dto) => _repo.Update(maKiemDinh, dto);

        public bool Delete(int maKiemDinh) => _repo.Delete(maKiemDinh);
    }
}
