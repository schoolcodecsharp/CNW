using NongDanService.Data;
using NongDanService.Models.DTOs;

namespace NongDanService.Services
{
    public class TrangTraiService : ITrangTraiService
    {
        private readonly ITrangTraiRepository _repo;

        public TrangTraiService(ITrangTraiRepository repo)
        {
            _repo = repo;
        }

        public List<TrangTraiDTO> GetAll() => _repo.GetAll();

        public TrangTraiDTO? GetById(int id) => _repo.GetById(id);

        public List<TrangTraiDTO> GetByNongDanId(int maNongDan) => _repo.GetByNongDanId(maNongDan);

        public int Create(TrangTraiCreateDTO dto) => _repo.Create(dto);

        public bool Update(int id, TrangTraiUpdateDTO dto) => _repo.Update(id, dto);

        public bool Delete(int id) => _repo.Delete(id);
    }
}