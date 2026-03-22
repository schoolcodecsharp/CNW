using Gateway.Helpers;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Gateway
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly AppSettings _appSettings;
        private readonly string _connectionString;

        public JwtMiddleware(RequestDelegate next, IOptions<AppSettings> appSettings, IConfiguration configuration)
        {
            _next = next;
            _appSettings = appSettings.Value;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public Task Invoke(HttpContext context)
        {
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Response.Headers.Add("Access-Control-Expose-Headers", "*");

            if (!context.Request.Path.Equals("/api/login", StringComparison.Ordinal))
            {
                return _next(context);
            }

            if (context.Request.Method.Equals("POST") && context.Request.HasFormContentType)
            {
                return GenerateToken(context);
            }

            context.Response.StatusCode = 400;
            return context.Response.WriteAsync("Bad request.");
        }

        public async Task GenerateToken(HttpContext context)
        {
            var tenDangNhap = context.Request.Form["TenDangNhap"].ToString();
            var matKhau = context.Request.Form["MatKhau"].ToString();

            // Lấy thông tin user từ database
            var user = GetUser(tenDangNhap, matKhau);

            if (user == null)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                var result = JsonConvert.SerializeObject(new { 
                    code = (int)HttpStatusCode.BadRequest, 
                    error = "Tài khoản hoặc mật khẩu không đúng" 
                });
                await context.Response.WriteAsync(result);
                return;
            }

            // Tạo JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.MaTaiKhoan.ToString()),
                    new Claim(ClaimTypes.Name, user.TenDangNhap),
                    new Claim(ClaimTypes.Role, user.LoaiTaiKhoan)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var response = new
            {
                MaTaiKhoan = user.MaTaiKhoan,
                TenDangNhap = user.TenDangNhap,
                LoaiTaiKhoan = user.LoaiTaiKhoan,
                Token = tokenString
            };

            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(response, Formatting.Indented));
        }

        private UserInfo? GetUser(string tenDangNhap, string matKhau)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(@"
                SELECT MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai
                FROM TaiKhoan 
                WHERE TenDangNhap = @TenDangNhap AND MatKhau = @MatKhau AND TrangThai = 'hoat_dong'", conn);

            cmd.Parameters.AddWithValue("@TenDangNhap", tenDangNhap);
            cmd.Parameters.AddWithValue("@MatKhau", matKhau);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            if (!reader.Read()) return null;

            return new UserInfo
            {
                MaTaiKhoan = (int)reader["MaTaiKhoan"],
                TenDangNhap = reader["TenDangNhap"].ToString()!,
                LoaiTaiKhoan = reader["LoaiTaiKhoan"].ToString()!
            };
        }
    }

    public class UserInfo
    {
        public int MaTaiKhoan { get; set; }
        public string TenDangNhap { get; set; } = string.Empty;
        public string LoaiTaiKhoan { get; set; } = string.Empty;
    }
}
