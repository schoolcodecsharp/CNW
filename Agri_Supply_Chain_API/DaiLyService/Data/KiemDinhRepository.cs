using Microsoft.Data.SqlClient;
using DaiLyService.Models.DTOs;
using System.Data;

namespace DaiLyService.Data
{
    public class KiemDinhRepository : IKiemDinhRepository
    {
        private readonly string _connectionString;

        public KiemDinhRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        public List<KiemDinhDTO> GetAll()
        {
            var list = new List<KiemDinhDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_KiemDinh_GetAll", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapToDto(reader));
            }

            return list;
        }

        public KiemDinhDTO? GetById(int maKiemDinh)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_KiemDinh_GetById", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaKiemDinh", maKiemDinh);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            if (!reader.Read()) return null;

            return MapToDto(reader);
        }

        public List<KiemDinhDTO> GetByMaDaiLy(int maDaiLy)
        {
            var list = new List<KiemDinhDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_KiemDinh_GetByMaDaiLy", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDaiLy", maDaiLy);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapToDto(reader));
            }

            return list;
        }

        public List<KiemDinhDTO> GetByMaLo(int maLo)
        {
            var list = new List<KiemDinhDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_KiemDinh_Search", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaLo", maLo);
            cmd.Parameters.AddWithValue("@KetQua", DBNull.Value);
            cmd.Parameters.AddWithValue("@TrangThai", DBNull.Value);
            cmd.Parameters.AddWithValue("@NguoiKiemDinh", DBNull.Value);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapToDto(reader));
            }

            return list;
        }

        public List<LoChoKiemDinhDTO> GetLoChoKiemDinh(int maDaiLy)
        {
            var list = new List<LoChoKiemDinhDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_KiemDinh_GetLoChoKiemDinh", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDaiLy", maDaiLy);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new LoChoKiemDinhDTO
                {
                    MaLo = (int)reader["MaLo"],
                    SoChungNhanLo = reader["SoChungNhanLo"].ToString()!,
                    TenSanPham = reader["TenSanPham"].ToString()!,
                    SoLuongHienTai = (decimal)reader["SoLuongHienTai"],
                    NgayThuHoach = reader["NgayThuHoach"] as DateTime?,
                    TrangThai = reader["TrangThai"].ToString()!,
                    MaDonHang = (int)reader["MaDonHang"],
                    NgayDat = reader["NgayDat"] as DateTime?
                });
            }

            return list;
        }

        public int Create(KiemDinhCreateDTO dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_KiemDinh_Create", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaLo", dto.MaLo);
            cmd.Parameters.AddWithValue("@NguoiKiemDinh", (object?)dto.NguoiKiemDinh ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@MaDaiLy", (object?)dto.MaDaiLy ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@MaSieuThi", (object?)dto.MaSieuThi ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@KetQua", dto.KetQua);
            cmd.Parameters.AddWithValue("@BienBan", (object?)dto.BienBan ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ChuKySo", (object?)dto.ChuKySo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@GhiChu", (object?)dto.GhiChu ?? DBNull.Value);

            var outputParam = new SqlParameter("@MaKiemDinh", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(outputParam);

            conn.Open();
            cmd.ExecuteNonQuery();

            return (int)outputParam.Value;
        }

        public bool Update(int maKiemDinh, KiemDinhUpdateDTO dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_KiemDinh_Update", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaKiemDinh", maKiemDinh);
            cmd.Parameters.AddWithValue("@NguoiKiemDinh", (object?)dto.NguoiKiemDinh ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@KetQua", dto.KetQua);
            cmd.Parameters.AddWithValue("@TrangThai", (object?)dto.TrangThai ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@BienBan", (object?)dto.BienBan ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ChuKySo", (object?)dto.ChuKySo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@GhiChu", (object?)dto.GhiChu ?? DBNull.Value);

            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Delete(int maKiemDinh)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_KiemDinh_Delete", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaKiemDinh", maKiemDinh);

            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        private KiemDinhDTO MapToDto(SqlDataReader reader)
        {
            return new KiemDinhDTO
            {
                MaKiemDinh = (int)reader["MaKiemDinh"],
                MaLo = (int)reader["MaLo"],
                NguoiKiemDinh = reader["NguoiKiemDinh"] as string,
                MaDaiLy = reader["MaDaiLy"] as int?,
                MaSieuThi = reader["MaSieuThi"] as int?,
                NgayKiemDinh = reader["NgayKiemDinh"] as DateTime?,
                KetQua = reader["KetQua"].ToString()!,
                TrangThai = reader["TrangThai"] as string,
                BienBan = reader["BienBan"] as string,
                ChuKySo = reader["ChuKySo"] as string,
                GhiChu = reader["GhiChu"] as string,
                SoChungNhanLo = reader["SoChungNhanLo"] as string,
                TenSanPham = reader["TenSanPham"] as string
            };
        }
    }
}
