using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public interface ITonKhoService
    {
        List<TonKhoDTO> GetAll();
        List<TonKhoDTO> GetByMaDaiLy(int maDaiLy);
        List<TonKhoDTO> GetByMaKho(int maKho);
    }
}
