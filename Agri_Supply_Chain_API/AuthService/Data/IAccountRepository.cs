namespace AuthService.Data
{
    public interface IAccountRepository
    {
        (bool success, string? loaiTaiKhoan, int? maTaiKhoan) Login(string tenDangNhap, string matKhau);
    }
}
