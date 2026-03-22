using NongDanService.Data;
using NongDanService.Models.DTOs;

namespace NongDanService.Services
{
    public class SanPhamService : ISanPhamService
    {
        private readonly ISanPhamRepository _repo;

        public SanPhamService(ISanPhamRepository repo)
        {
            _repo = repo;
        }

        public List<SanPhamDTO> GetAll() => _repo.GetAll();

        public SanPhamDTO? GetById(int id) => _repo.GetById(id);

        public int Create(SanPhamCreateDTO dto) => _repo.Create(dto);

        public bool Update(int id, SanPhamUpdateDTO dto)
            => _repo.Update(id, dto);

        public bool Delete(int id) => _repo.Delete(id);
    }
}
