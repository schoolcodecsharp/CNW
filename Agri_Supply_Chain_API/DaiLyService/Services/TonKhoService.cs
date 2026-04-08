using DaiLyService.Data;
using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public class TonKhoService : ITonKhoService
    {
        private readonly ITonKhoRepository _repository;

        public TonKhoService(ITonKhoRepository repository)
        {
            _repository = repository;
        }

        public List<TonKhoDTO> GetAll()
        {
            return _repository.GetAll();
        }

        public List<TonKhoDTO> GetByMaDaiLy(int maDaiLy)
        {
            return _repository.GetByMaDaiLy(maDaiLy);
        }

        public List<TonKhoDTO> GetByMaKho(int maKho)
        {
            return _repository.GetByMaKho(maKho);
        }
    }
}
