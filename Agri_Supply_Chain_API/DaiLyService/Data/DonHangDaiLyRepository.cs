using Microsoft.Data.SqlClient;
using DaiLyService.Models.DTOs;
using System.Data;

namespace DaiLyService.Data
{
    public class DonHangDaiLyRepository : IDonHangDaiLyRepository
    {
        private readonly string _connectionString;

        public DonHangDaiLyRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        public List<DonHangDaiLyDTO> GetAll()
        {
            var list = new List<DonHangDaiLyDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DonHangDaiLy_GetAll", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapToDto(reader));
            }

            return list;
        }

        public DonHangDaiLyDTO? GetById(int maDonHang)
        {
            using var conn = new SqlConnection(_connectionString);
            conn.Open();

            // Lấy thông tin đơn hàng
            using var cmd = new SqlCommand("sp_DonHangDaiLy_GetById", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDonHang", maDonHang);

            DonHangDaiLyDTO? donHang = null;
            using (var reader = cmd.ExecuteReader())
            {
                if (reader.Read())
                {
                    donHang = MapToDto(reader);
                }
            }

            if (donHang == null) return null;

            // Lấy chi tiết đơn hàng
            donHang.ChiTietDonHang = GetChiTietDonHang(conn, maDonHang);

            return donHang;
        }

        public List<DonHangDaiLyDTO> GetByMaDaiLy(int maDaiLy)
        {
            var list = new List<DonHangDaiLyDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DonHangDaiLy_GetByDaiLy", conn);
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

        public List<DonHangDaiLyDTO> GetByMaNongDan(int maNongDan)
        {
            var list = new List<DonHangDaiLyDTO>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DonHangDaiLy_GetByNongDan", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaNongDan", maNongDan);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(MapToDto(reader));
            }

            return list;
        }

        public int Create(DonHangDaiLyCreateDTO dto)
        {
            using var conn = new SqlConnection(_connectionString);
            conn.Open();

            // Tính tổng số lượng và tổng giá trị
            decimal tongSoLuong = dto.ChiTietDonHang.Sum(x => x.SoLuong);
            decimal tongGiaTri = dto.ChiTietDonHang.Sum(x => x.SoLuong * (x.DonGia ?? 0));

            // 1. Tạo DonHang bằng SP
            using var cmdDonHang = new SqlCommand("sp_DonHangDaiLy_Create", conn);
            cmdDonHang.CommandType = CommandType.StoredProcedure;

            cmdDonHang.Parameters.AddWithValue("@MaDaiLy", dto.MaDaiLy);
            cmdDonHang.Parameters.AddWithValue("@MaNongDan", dto.MaNongDan);
            cmdDonHang.Parameters.AddWithValue("@TongSoLuong", tongSoLuong);
            cmdDonHang.Parameters.AddWithValue("@TongGiaTri", tongGiaTri);
            cmdDonHang.Parameters.AddWithValue("@GhiChu", (object?)dto.GhiChu ?? DBNull.Value);

            var outputParam = new SqlParameter("@MaDonHang", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmdDonHang.Parameters.Add(outputParam);

            cmdDonHang.ExecuteNonQuery();
            int maDonHang = (int)outputParam.Value;

            // 2. Tạo ChiTietDonHang bằng SP
            foreach (var chiTiet in dto.ChiTietDonHang)
            {
                using var cmdChiTiet = new SqlCommand("sp_ChiTietDonHang_Create", conn);
                cmdChiTiet.CommandType = CommandType.StoredProcedure;

                cmdChiTiet.Parameters.AddWithValue("@MaDonHang", maDonHang);
                cmdChiTiet.Parameters.AddWithValue("@MaLo", chiTiet.MaLo);
                cmdChiTiet.Parameters.AddWithValue("@SoLuong", chiTiet.SoLuong);
                cmdChiTiet.Parameters.AddWithValue("@DonGia", (object?)chiTiet.DonGia ?? DBNull.Value);
                cmdChiTiet.ExecuteNonQuery();
            }

            return maDonHang;
        }

        public bool UpdateTrangThai(int maDonHang, DonHangDaiLyUpdateDTO dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DonHang_UpdateTrangThai", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@MaDonHang", maDonHang);
            cmd.Parameters.AddWithValue("@TrangThai", (object?)dto.TrangThai ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@NgayGiao", (object?)dto.NgayGiao ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@GhiChu", (object?)dto.GhiChu ?? DBNull.Value);

            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Delete(int maDonHang)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_DonHangDaiLy_Delete", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDonHang", maDonHang);

            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool XacNhanDon(int maDonHang)
        {
            using var conn = new SqlConnection(_connectionString);
            conn.Open();
            using var transaction = conn.BeginTransaction();

            try
            {
                // 1. Lấy thông tin đại lý từ đơn hàng
                int maDaiLy;
                using (var cmdGetDaiLy = new SqlCommand(@"
                    SELECT MaDaiLy FROM DonHangDaiLy WHERE MaDonHang = @MaDonHang", conn, transaction))
                {
                    cmdGetDaiLy.Parameters.AddWithValue("@MaDonHang", maDonHang);
                    var result = cmdGetDaiLy.ExecuteScalar();
                    if (result == null)
                    {
                        transaction.Rollback();
                        return false;
                    }
                    maDaiLy = (int)result;
                }

                // 2. Lấy kho của đại lý (lấy kho đầu tiên nếu có nhiều kho)
                int maKho;
                using (var cmdGetKho = new SqlCommand(@"
                    SELECT TOP 1 MaKho FROM Kho 
                    WHERE MaDaiLy = @MaDaiLy AND LoaiKho = 'daily' AND TrangThai = N'hoat_dong'", conn, transaction))
                {
                    cmdGetKho.Parameters.AddWithValue("@MaDaiLy", maDaiLy);
                    var result = cmdGetKho.ExecuteScalar();
                    if (result == null)
                    {
                        // Nếu chưa có kho, tạo kho mới cho đại lý
                        using var cmdCreateKho = new SqlCommand(@"
                            INSERT INTO Kho (LoaiKho, MaDaiLy, TenKho, TrangThai)
                            OUTPUT INSERTED.MaKho
                            VALUES ('daily', @MaDaiLy, N'Kho đại lý', N'hoat_dong')", conn, transaction);
                        cmdCreateKho.Parameters.AddWithValue("@MaDaiLy", maDaiLy);
                        maKho = (int)cmdCreateKho.ExecuteScalar()!;
                    }
                    else
                    {
                        maKho = (int)result;
                    }
                }

                // 3. Lấy chi tiết đơn hàng
                var chiTietList = new List<(int MaLo, decimal SoLuong)>();
                using (var cmdGetChiTiet = new SqlCommand(@"
                    SELECT MaLo, SoLuong FROM ChiTietDonHang WHERE MaDonHang = @MaDonHang", conn, transaction))
                {
                    cmdGetChiTiet.Parameters.AddWithValue("@MaDonHang", maDonHang);
                    using var reader = cmdGetChiTiet.ExecuteReader();
                    while (reader.Read())
                    {
                        chiTietList.Add((reader.GetInt32(0), reader.GetDecimal(1)));
                    }
                }

                // 4. Cập nhật tồn kho cho từng lô
                foreach (var (maLo, soLuong) in chiTietList)
                {
                    // Kiểm tra xem đã có tồn kho chưa
                    using var cmdCheckTonKho = new SqlCommand(@"
                        SELECT COUNT(*) FROM TonKho WHERE MaKho = @MaKho AND MaLo = @MaLo", conn, transaction);
                    cmdCheckTonKho.Parameters.AddWithValue("@MaKho", maKho);
                    cmdCheckTonKho.Parameters.AddWithValue("@MaLo", maLo);
                    
                    int count = (int)cmdCheckTonKho.ExecuteScalar()!;

                    if (count > 0)
                    {
                        // Cập nhật tồn kho hiện có
                        using var cmdUpdateTonKho = new SqlCommand(@"
                            UPDATE TonKho 
                            SET SoLuong = SoLuong + @SoLuong,
                                CapNhatCuoi = GETDATE()
                            WHERE MaKho = @MaKho AND MaLo = @MaLo", conn, transaction);
                        cmdUpdateTonKho.Parameters.AddWithValue("@MaKho", maKho);
                        cmdUpdateTonKho.Parameters.AddWithValue("@MaLo", maLo);
                        cmdUpdateTonKho.Parameters.AddWithValue("@SoLuong", soLuong);
                        cmdUpdateTonKho.ExecuteNonQuery();
                    }
                    else
                    {
                        // Thêm mới tồn kho
                        using var cmdInsertTonKho = new SqlCommand(@"
                            INSERT INTO TonKho (MaKho, MaLo, SoLuong, CapNhatCuoi)
                            VALUES (@MaKho, @MaLo, @SoLuong, GETDATE())", conn, transaction);
                        cmdInsertTonKho.Parameters.AddWithValue("@MaKho", maKho);
                        cmdInsertTonKho.Parameters.AddWithValue("@MaLo", maLo);
                        cmdInsertTonKho.Parameters.AddWithValue("@SoLuong", soLuong);
                        cmdInsertTonKho.ExecuteNonQuery();
                    }
                }

                // 5. Cập nhật trạng thái đơn hàng
                using (var cmdUpdateDonHang = new SqlCommand(@"
                    UPDATE DonHang 
                    SET TrangThai = N'da_nhan'
                    WHERE MaDonHang = @MaDonHang", conn, transaction))
                {
                    cmdUpdateDonHang.Parameters.AddWithValue("@MaDonHang", maDonHang);
                    cmdUpdateDonHang.ExecuteNonQuery();
                }

                transaction.Commit();
                return true;
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }

        public bool HuyDon(int maDonHang)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(@"
                UPDATE DonHang 
                SET TrangThai = N'da_huy'
                WHERE MaDonHang = @MaDonHang", conn);
            
            cmd.Parameters.AddWithValue("@MaDonHang", maDonHang);

            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool XuatDon(int maDonHang, XuatDonRequest request)
        {
            using var conn = new SqlConnection(_connectionString);
            conn.Open();
            using var transaction = conn.BeginTransaction();

            try
            {
                // 1. Cập nhật trạng thái đơn hàng
                using var cmdUpdate = new SqlCommand(@"
                    UPDATE DonHang 
                    SET TrangThai = N'dang_giao',
                        GhiChu = CASE 
                            WHEN @GhiChu IS NOT NULL THEN @GhiChu 
                            ELSE GhiChu 
                        END
                    WHERE MaDonHang = @MaDonHang", conn, transaction);
                
                cmdUpdate.Parameters.AddWithValue("@MaDonHang", maDonHang);
                cmdUpdate.Parameters.AddWithValue("@GhiChu", (object?)request.GhiChu ?? DBNull.Value);
                cmdUpdate.ExecuteNonQuery();

                // 2. Lấy chi tiết đơn hàng để trừ tồn kho
                using var cmdGetChiTiet = new SqlCommand(@"
                    SELECT MaLo, SoLuong 
                    FROM ChiTietDonHang 
                    WHERE MaDonHang = @MaDonHang", conn, transaction);
                
                cmdGetChiTiet.Parameters.AddWithValue("@MaDonHang", maDonHang);
                
                var chiTietList = new List<(int MaLo, decimal SoLuong)>();
                using (var reader = cmdGetChiTiet.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        chiTietList.Add((
                            reader.GetInt32(0),
                            reader.GetDecimal(1)
                        ));
                    }
                }

                // 3. Trừ tồn kho cho từng lô
                foreach (var (maLo, soLuong) in chiTietList)
                {
                    using var cmdUpdateKho = new SqlCommand(@"
                        UPDATE TonKho 
                        SET SoLuongTon = SoLuongTon - @SoLuong
                        WHERE MaKho = @MaKho AND MaLo = @MaLo", conn, transaction);
                    
                    cmdUpdateKho.Parameters.AddWithValue("@MaKho", request.MaKho);
                    cmdUpdateKho.Parameters.AddWithValue("@MaLo", maLo);
                    cmdUpdateKho.Parameters.AddWithValue("@SoLuong", soLuong);
                    cmdUpdateKho.ExecuteNonQuery();
                }

                transaction.Commit();
                return true;
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }

        private List<ChiTietDonHangDTO> GetChiTietDonHang(SqlConnection conn, int maDonHang)
        {
            var list = new List<ChiTietDonHangDTO>();

            using var cmd = new SqlCommand("sp_ChiTietDonHang_GetByMaDonHang", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MaDonHang", maDonHang);

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new ChiTietDonHangDTO
                {
                    MaLo = (int)reader["MaLo"],
                    TenSanPham = reader["TenSanPham"] as string,
                    SoLuong = (decimal)reader["SoLuong"],
                    DonGia = reader["DonGia"] as decimal?,
                    ThanhTien = reader["ThanhTien"] as decimal?
                });
            }

            return list;
        }

        private DonHangDaiLyDTO MapToDto(SqlDataReader reader)
        {
            return new DonHangDaiLyDTO
            {
                MaDonHang = (int)reader["MaDonHang"],
                MaDaiLy = (int)reader["MaDaiLy"],
                MaNongDan = (int)reader["MaNongDan"],
                TenNongDan = reader["TenNongDan"] as string,
                TenDaiLy = reader["TenDaiLy"] as string,
                NgayDat = reader["NgayDat"] as DateTime?,
                NgayGiao = reader["NgayGiao"] as DateTime?,
                TrangThai = reader["TrangThai"] as string,
                TongSoLuong = reader["TongSoLuong"] as decimal?,
                TongGiaTri = reader["TongGiaTri"] as decimal?,
                GhiChu = reader["GhiChu"] as string
            };
        }
    }
}
