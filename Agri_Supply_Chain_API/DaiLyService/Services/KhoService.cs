using DaiLyService.Data;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public class KhoService : IKhoService
    {
        private readonly IKhoRepository _repo;

        public KhoService(IKhoRepository repo)
        {
            _repo = repo;
        }

        public List<KhoDTO> GetAll() => _repo.GetAll();

        public KhoDTO? GetById(int maKho) => _repo.GetById(maKho);

        public List<KhoDTO> GetByMaDaiLy(int maDaiLy) => _repo.GetByMaDaiLy(maDaiLy);

        public int Create(KhoCreateDTO dto) => _repo.Create(dto);

        public bool Update(int maKho, KhoUpdateDTO dto) => _repo.Update(maKho, dto);

        public bool Delete(int maKho) => _repo.Delete(maKho);
    }
}
