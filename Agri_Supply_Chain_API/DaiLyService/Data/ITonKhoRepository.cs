using DaiLyService.Models.DTOs;

namespace DaiLyService.Data
{
    public interface ITonKhoRepository
    {
        List<TonKhoDTO> GetAll();
        List<TonKhoDTO> GetByMaDaiLy(int maDaiLy);
        List<TonKhoDTO> GetByMaKho(int maKho);
    }
}
