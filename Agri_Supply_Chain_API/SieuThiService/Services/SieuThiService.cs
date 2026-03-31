using SieuThiService.Data;
using SieuThiService.Models.DTOs;

namespace SieuThiService.Services
{
    public class SieuThiService : ISieuThiService
    {
        private readonly ISieuThiRepository _repository;

        public SieuThiService(ISieuThiRepository repository)
        {
            _repository = repository;
        }

        public List<SieuThiDTO> GetAll()
        {
            return _repository.GetAll();
        }

        public SieuThiDTO? GetById(int id)
        {
            return _repository.GetById(id);
        }

        public int Create(SieuThiTaoMoi dto)
        {
            return _repository.Create(dto);
        }

        public bool Update(int id, SieuThiUpdateDTO dto)
        {
            return _repository.Update(id, dto);
        }

        public bool Delete(int id)
        {
            return _repository.Delete(id);
        }

        public List<SieuThiDTO> Search(string? ten, string? sdt)
        {
            return _repository.Search(ten, sdt);
        }
    }
}
