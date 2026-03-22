using NongDanService.Models.DTOs;

namespace NongDanService.Services
{
    public interface ISanPhamService
    {
        List<SanPhamDTO> GetAll();
        SanPhamDTO? GetById(int id);
        int Create(SanPhamCreateDTO dto);
        bool Update(int id, SanPhamUpdateDTO dto);
        bool Delete(int id);
    }
}
