using NongDanService.Models.DTOs;

namespace NongDanService.Data
{
    public interface ILoNongSanRepository
    {
        List<LoNongSanDTO> GetAll();
        LoNongSanDTO? GetById(int id);
        List<LoNongSanDTO> GetByTrangTraiId(int maTrangTrai);
        List<LoNongSanDTO> GetByNongDanId(int maNongDan);
        int Create(LoNongSanCreateDTO dto);
        bool Update(int id, LoNongSanUpdateDTO dto);
        bool Delete(int id);
    }
}