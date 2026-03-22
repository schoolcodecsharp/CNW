using NongDanService.Data;
using NongDanService.Models.DTOs;

namespace NongDanService.Services
{
    public class LoNongSanService : ILoNongSanService
    {
        private readonly ILoNongSanRepository _repo;

        public LoNongSanService(ILoNongSanRepository repo)
        {
            _repo = repo;
        }

        public List<LoNongSanDTO> GetAll() => _repo.GetAll();

        public LoNongSanDTO? GetById(int id) => _repo.GetById(id);

        public List<LoNongSanDTO> GetByTrangTraiId(int maTrangTrai) => _repo.GetByTrangTraiId(maTrangTrai);

        public List<LoNongSanDTO> GetByNongDanId(int maNongDan) => _repo.GetByNongDanId(maNongDan);

        public int Create(LoNongSanCreateDTO dto) => _repo.Create(dto);

        public bool Update(int id, LoNongSanUpdateDTO dto) => _repo.Update(id, dto);

        public bool Delete(int id) => _repo.Delete(id);
    }
}