using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public interface IKhoService
    {
        List<KhoDTO> GetAll();
        KhoDTO? GetById(int maKho);
        List<KhoDTO> GetByMaDaiLy(int maDaiLy);
        List<KhoDTO> GetByMaSieuThi(int maSieuThi);
        int Create(KhoCreateDTO dto);
        bool Update(int maKho, KhoUpdateDTO dto);
        bool Delete(int maKho);
    }
}
