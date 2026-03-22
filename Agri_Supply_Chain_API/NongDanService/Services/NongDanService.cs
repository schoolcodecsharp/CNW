using NongDanService.Data;
using NongDanService.Models.DTOs;

namespace NongDanService.Services
{
    public class NongDanService : INongDanService
    {
        private readonly INongDanRepository _repo;

        public NongDanService(INongDanRepository repo)
        {
            _repo = repo;
        }

        public List<NongDanDTO> GetAll() => _repo.GetAll();

        public NongDanDTO? GetById(int id) => _repo.GetById(id);

        public int Create(NongDanCreateDTO dto) => _repo.Create(dto);

        public bool Update(int id, NongDanUpdateDTO dto) => _repo.Update(id, dto);

        public bool Delete(int id) => _repo.Delete(id);
    }
}
