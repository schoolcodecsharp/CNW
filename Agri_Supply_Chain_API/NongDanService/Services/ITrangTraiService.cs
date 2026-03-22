using NongDanService.Models.DTOs;

namespace NongDanService.Services
{
    public interface ITrangTraiService
    {
        List<TrangTraiDTO> GetAll();
        TrangTraiDTO? GetById(int id);
        List<TrangTraiDTO> GetByNongDanId(int maNongDan);
        int Create(TrangTraiCreateDTO dto);
        bool Update(int id, TrangTraiUpdateDTO dto);
        bool Delete(int id);
    }
}