using DaiLyService.Models.DTOs;

namespace DaiLyService.Data
{
    public interface IKiemDinhRepository
    {
        List<KiemDinhDTO> GetAll();
        KiemDinhDTO? GetById(int maKiemDinh);
        List<KiemDinhDTO> GetByMaDaiLy(int maDaiLy);
        int Create(KiemDinhCreateDTO dto);
        bool Update(int maKiemDinh, KiemDinhUpdateDTO dto);
        bool Delete(int maKiemDinh);
    }
}
