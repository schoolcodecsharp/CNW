using DaiLyService.Models.DTOs;

namespace DaiLyService.Data
{
    public interface IKhoRepository
    {
        List<KhoDTO> GetAll();
        KhoDTO? GetById(int maKho);
        List<KhoDTO> GetByMaDaiLy(int maDaiLy);
        int Create(KhoCreateDTO dto);
        bool Update(int maKho, KhoUpdateDTO dto);
        bool Delete(int maKho);
    }
}
