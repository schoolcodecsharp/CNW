using DaiLyService.Models.DTOs;

namespace DaiLyService.Services
{
    public interface IDaiLyService
    {
        List<DaiLyPhanHoi> GetAll();
        DaiLyPhanHoi? GetById(int maDaiLy);
        int Create(DaiLyTaoMoi dto);
        bool Update(int maDaiLy, DaiLyUpdateDTO dto);
        bool Delete(int maDaiLy);
        List<DaiLyPhanHoi> Search(string? tenDaiLy, string? soDienThoai);
    }
}
