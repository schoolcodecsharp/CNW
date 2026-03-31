using SieuThiService.Models.DTOs;

namespace SieuThiService.Services
{
    public interface ISieuThiService
    {
        List<SieuThiDTO> GetAll();
        SieuThiDTO? GetById(int id);
        int Create(SieuThiTaoMoi dto);
        bool Update(int id, SieuThiUpdateDTO dto);
        bool Delete(int id);
        List<SieuThiDTO> Search(string? ten, string? sdt);
    }
}
