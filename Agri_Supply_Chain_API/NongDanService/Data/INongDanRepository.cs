using NongDanService.Models.DTOs;

namespace NongDanService.Data
{
    public interface INongDanRepository
    {
        List<NongDanDTO> GetAll();
        List<NongDanDTO> GetAllAdmin();
        NongDanDTO? GetById(int id);
        int Create(NongDanCreateDTO dto);
        bool Update(int id, NongDanUpdateDTO dto);
        bool Delete(int id);
    }
}
