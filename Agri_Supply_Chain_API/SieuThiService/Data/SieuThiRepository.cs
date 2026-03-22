using Microsoft.EntityFrameworkCore;
using SieuThiService.Models.DTOs;
using SieuThiService.Models.Entities;
using Microsoft.Data.SqlClient;
using System.Data;

namespace SieuThiService.Data
{
    public class SieuThiRepository : ISieuThiRepository
    {
        private readonly BtlHdv1Context _context;

        public SieuThiRepository(BtlHdv1Context context)
        {
            _context = context;
        }

        public bool CreateDonHangOnly(CreateDonHangRequest request)
        {
            try
            {
                // Kiểm tra siêu thị có tồn tại không bằng stored procedure
                var sieuThiExistsParam = new SqlParameter("@MaSieuThi", request.MaSieuThi);
                var existsResult = _context.Database.SqlQueryRaw<ExistsResult>(
                    "EXEC sp_CheckSieuThiExists @MaSieuThi", sieuThiExistsParam).FirstOrDefault();
                
                if (existsResult == null || existsResult.ExistsCount == 0)
                {
                    return false;
                }

                // Tạo đơn hàng chính (chưa có chi tiết)
                var donHang = new DonHang
                {
                    LoaiDon = "sieu_thi",
                    NgayDat = DateTime.Now,
                    NgayGiao = request.NgayGiao,
                    TrangThai = "chua_nhan",
                    TongSoLuong = 0,
                    TongGiaTri = 0,
                    GhiChu = request.GhiChu
                };

                _context.DonHangs.Add(donHang);
                _context.SaveChanges();

                // Tạo đơn hàng siêu thị
                var donHangSieuThi = new DonHangSieuThi
                {
                    MaDonHang = donHang.MaDonHang,
                    MaSieuThi = request.MaSieuThi,
                    MaDaiLy = request.MaDaiLy
                };

                _context.DonHangSieuThis.Add(donHangSieuThi);
                _context.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool AddChiTietDonHang(CreateChiTietDonHangRequest request)
        {
            try
            {
                // Kiểm tra đơn hàng có tồn tại không bằng stored procedure
                var donHangParam = new SqlParameter("@MaDonHang", request.MaDonHang);
                var donHangInfo = _context.Database.SqlQueryRaw<DonHangStatusInfo>(
                    "EXEC sp_GetDonHangForStatusCheck @MaDonHang", donHangParam).FirstOrDefault();
                
                if (donHangInfo == null)
                {
                    return false;
                }

                // Tính thành tiền
                decimal thanhTien = request.SoLuong * (request.DonGia ?? 0);

                // Tạo chi tiết đơn hàng
                var chiTietDonHang = new ChiTietDonHang
                {
                    MaDonHang = request.MaDonHang,
                    MaLo = request.MaLo,
                    SoLuong = request.SoLuong,
                    DonGia = request.DonGia,
                    ThanhTien = thanhTien
                };

                _context.ChiTietDonHangs.Add(chiTietDonHang);

                // Cập nhật tổng số lượng và tổng giá trị của đơn hàng bằng stored procedure
                var totalsParam = new SqlParameter("@MaDonHang", request.MaDonHang);
                var totals = _context.Database.SqlQueryRaw<DonHangTotals>(
                    "EXEC sp_CalculateDonHangTotals @MaDonHang", totalsParam).FirstOrDefault();

                var donHang = _context.DonHangs.Find(request.MaDonHang);
                if (donHang != null && totals != null)
                {
                    donHang.TongSoLuong = totals.TongSoLuong + request.SoLuong;
                    donHang.TongGiaTri = totals.TongGiaTri + thanhTien;
                }

                _context.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool NhanHang(int maDonHang, NhanHangRequest request)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // Kiểm tra đơn hàng có tồn tại không bằng stored procedure
                var donHangParam = new SqlParameter("@MaDonHang", maDonHang);
                var donHangInfo = _context.Database.SqlQueryRaw<DonHangStatusInfo>(
                    "EXEC sp_GetDonHangForStatusCheck @MaDonHang", donHangParam).FirstOrDefault();
                
                if (donHangInfo == null)
                {
                    return false;
                }

                // Kiểm tra trạng thái đơn hàng có thể nhận không
                if (donHangInfo.TrangThai == "da_huy" || donHangInfo.TrangThai == "da_nhan" || donHangInfo.TrangThai == "da_giao")
                {
                    return false;
                }

                // Kiểm tra kho được chọn có tồn tại và thuộc về siêu thị không bằng stored procedure
                var khoParams = new[]
                {
                    new SqlParameter("@MaKho", request.MaKho),
                    new SqlParameter("@MaSieuThi", donHangInfo.MaSieuThi)
                };
                var khoValidResult = _context.Database.SqlQueryRaw<KhoValidResult>(
                    "EXEC sp_CheckKhoValidForReceive @MaKho, @MaSieuThi", khoParams).FirstOrDefault();

                if (khoValidResult == null || khoValidResult.IsValid == 0)
                {
                    return false;
                }

                // Lấy chi tiết đơn hàng bằng stored procedure
                var chiTietParams = new SqlParameter("@MaDonHang", maDonHang);
                var chiTietList = _context.Database.SqlQueryRaw<ChiTietForReceive>(
                    "EXEC sp_GetChiTietDonHangForReceive @MaDonHang", chiTietParams).ToList();

                // Cập nhật tồn kho cho từng chi tiết đơn hàng
                foreach (var chiTiet in chiTietList)
                {
                    // Kiểm tra xem lô hàng đã có trong kho chưa bằng stored procedure
                    var tonKhoParams = new[]
                    {
                        new SqlParameter("@MaKho", request.MaKho),
                        new SqlParameter("@MaLo", chiTiet.MaLo)
                    };
                    var tonKho = _context.Database.SqlQueryRaw<TonKhoInfo>(
                        "EXEC sp_GetTonKhoByKhoAndLo @MaKho, @MaLo", tonKhoParams).FirstOrDefault();

                    if (tonKho != null)
                    {
                        // Nếu đã có, cộng thêm số lượng
                        var existingTonKho = _context.TonKhos
                            .FirstOrDefault(tk => tk.MaKho == request.MaKho && tk.MaLo == chiTiet.MaLo);
                        if (existingTonKho != null)
                        {
                            existingTonKho.SoLuong += chiTiet.SoLuong;
                            existingTonKho.CapNhatCuoi = DateTime.Now;
                        }
                    }
                    else
                    {
                        // Nếu chưa có, tạo mới
                        var tonKhoMoi = new TonKho
                        {
                            MaKho = request.MaKho,
                            MaLo = chiTiet.MaLo,
                            SoLuong = chiTiet.SoLuong,
                            CapNhatCuoi = DateTime.Now
                        };
                        _context.TonKhos.Add(tonKhoMoi);
                    }
                }

                // Cập nhật trạng thái đơn hàng thành "da_nhan"
                var donHang = _context.DonHangs.Find(maDonHang);
                if (donHang != null)
                {
                    donHang.TrangThai = "da_nhan";
                    
                    // Cập nhật ghi chú nếu có
                    if (!string.IsNullOrEmpty(request.GhiChuNhan))
                    {
                        donHang.GhiChu = string.IsNullOrEmpty(donHang.GhiChu) 
                            ? $"Ghi chú nhận hàng: {request.GhiChuNhan}"
                            : $"{donHang.GhiChu}. Ghi chú nhận hàng: {request.GhiChuNhan}";
                    }
                }

                _context.SaveChanges();
                transaction.Commit();

                return true;
            }
            catch
            {
                transaction.Rollback();
                return false;
            }
        }

        public bool UpdateChiTietDonHang(UpdateChiTietDonHangRequest request)
        {
            try
            {
                // Kiểm tra đơn hàng có tồn tại không bằng stored procedure
                var donHangParam = new SqlParameter("@MaDonHang", request.MaDonHang);
                var donHangInfo = _context.Database.SqlQueryRaw<DonHangStatusInfo>(
                    "EXEC sp_GetDonHangForStatusCheck @MaDonHang", donHangParam).FirstOrDefault();
                
                if (donHangInfo == null)
                {
                    return false;
                }

                // Kiểm tra trạng thái đơn hàng có thể sửa không
                if (donHangInfo.TrangThai == "da_huy" || donHangInfo.TrangThai == "da_giao" || donHangInfo.TrangThai == "dang_giao")
                {
                    return false;
                }

                // Kiểm tra chi tiết đơn hàng có tồn tại không bằng stored procedure
                var chiTietParams = new[]
                {
                    new SqlParameter("@MaDonHang", request.MaDonHang),
                    new SqlParameter("@MaLo", request.MaLo)
                };
                var chiTietExistsResult = _context.Database.SqlQueryRaw<ExistsResult>(
                    "EXEC sp_CheckChiTietDonHangExists @MaDonHang, @MaLo", chiTietParams).FirstOrDefault();

                if (chiTietExistsResult == null || chiTietExistsResult.ExistsCount == 0)
                {
                    return false;
                }

                // Tìm chi tiết đơn hàng cần sửa
                var chiTietDonHang = _context.ChiTietDonHangs
                    .FirstOrDefault(ct => ct.MaDonHang == request.MaDonHang && ct.MaLo == request.MaLo);

                if (chiTietDonHang != null)
                {
                    // Cập nhật giá trị mới
                    chiTietDonHang.SoLuong = request.SoLuong;
                    chiTietDonHang.DonGia = request.DonGia;
                    chiTietDonHang.ThanhTien = request.SoLuong * (request.DonGia ?? 0);
                }

                // Cập nhật tổng số lượng và tổng giá trị của đơn hàng bằng stored procedure
                var totalsParam = new SqlParameter("@MaDonHang", request.MaDonHang);
                var totals = _context.Database.SqlQueryRaw<DonHangTotals>(
                    "EXEC sp_CalculateDonHangTotals @MaDonHang", totalsParam).FirstOrDefault();

                var donHang = _context.DonHangs.Find(request.MaDonHang);
                if (donHang != null && totals != null)
                {
                    donHang.TongSoLuong = totals.TongSoLuong;
                    donHang.TongGiaTri = totals.TongGiaTri;
                }

                _context.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteChiTietDonHang(DeleteChiTietDonHangRequest request)
        {
            try
            {
                // Kiểm tra đơn hàng có tồn tại không bằng stored procedure
                var donHangParam = new SqlParameter("@MaDonHang", request.MaDonHang);
                var donHangInfo = _context.Database.SqlQueryRaw<DonHangStatusInfo>(
                    "EXEC sp_GetDonHangForStatusCheck @MaDonHang", donHangParam).FirstOrDefault();
                
                if (donHangInfo == null)
                {
                    return false;
                }

                // Kiểm tra trạng thái đơn hàng có thể xóa chi tiết không
                if (donHangInfo.TrangThai == "da_huy" || donHangInfo.TrangThai == "da_giao" || donHangInfo.TrangThai == "dang_giao")
                {
                    return false;
                }

                // Kiểm tra chi tiết đơn hàng có tồn tại không bằng stored procedure
                var chiTietParams = new[]
                {
                    new SqlParameter("@MaDonHang", request.MaDonHang),
                    new SqlParameter("@MaLo", request.MaLo)
                };
                var chiTietExistsResult = _context.Database.SqlQueryRaw<ExistsResult>(
                    "EXEC sp_CheckChiTietDonHangExists @MaDonHang, @MaLo", chiTietParams).FirstOrDefault();

                if (chiTietExistsResult == null || chiTietExistsResult.ExistsCount == 0)
                {
                    return false;
                }

                // Kiểm tra xem đơn hàng có ít nhất 2 chi tiết không (không được xóa hết) bằng stored procedure
                var countParam = new SqlParameter("@MaDonHang", request.MaDonHang);
                var countResult = _context.Database.SqlQueryRaw<ChiTietCountResult>(
                    "EXEC sp_CountChiTietDonHang @MaDonHang", countParam).FirstOrDefault();

                if (countResult == null || countResult.SoChiTiet <= 1)
                {
                    return false;
                }

                // Tìm và xóa chi tiết đơn hàng
                var chiTietDonHang = _context.ChiTietDonHangs
                    .FirstOrDefault(ct => ct.MaDonHang == request.MaDonHang && ct.MaLo == request.MaLo);

                if (chiTietDonHang != null)
                {
                    _context.ChiTietDonHangs.Remove(chiTietDonHang);
                }

                // Cập nhật lại tổng số lượng và tổng giá trị của đơn hàng bằng stored procedure
                var totalsParams = new[]
                {
                    new SqlParameter("@MaDonHang", request.MaDonHang),
                    new SqlParameter("@MaLo", request.MaLo)
                };
                var totals = _context.Database.SqlQueryRaw<DonHangTotals>(
                    "EXEC sp_CalculateDonHangTotalsExcludeLo @MaDonHang, @MaLo", totalsParams).FirstOrDefault();

                var donHang = _context.DonHangs.Find(request.MaDonHang);
                if (donHang != null && totals != null)
                {
                    donHang.TongSoLuong = totals.TongSoLuong;
                    donHang.TongGiaTri = totals.TongGiaTri;
                }

                _context.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool HuyDonHang(int maDonHang)
        {
            try
            {
                // Kiểm tra đơn hàng có tồn tại không bằng stored procedure
                var donHangParam = new SqlParameter("@MaDonHang", maDonHang);
                var donHangInfo = _context.Database.SqlQueryRaw<DonHangStatusInfo>(
                    "EXEC sp_GetDonHangForStatusCheck @MaDonHang", donHangParam).FirstOrDefault();
                
                if (donHangInfo == null)
                {
                    return false;
                }

                // Kiểm tra trạng thái đơn hàng có thể hủy không
                if (donHangInfo.TrangThai == "da_huy" || donHangInfo.TrangThai == "da_giao" || donHangInfo.TrangThai == "dang_giao")
                {
                    return false;
                }

                // Cập nhật trạng thái đơn hàng thành "da_huy"
                var donHang = _context.DonHangs.Find(maDonHang);
                if (donHang != null)
                {
                    donHang.TrangThai = "da_huy";
                }
                
                _context.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool CreateDonHang(CreateDonHangSieuThiRequest request)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // Kiểm tra siêu thị có tồn tại không
                var sieuThi = _context.SieuThis
                    .FirstOrDefault(st => st.MaSieuThi == request.MaSieuThi);
                
                if (sieuThi == null)
                {
                    return false;
                }

                // Tính tổng số lượng và tổng giá trị
                decimal tongSoLuong = request.ChiTietDonHangs.Sum(ct => ct.SoLuong);
                decimal tongGiaTri = request.ChiTietDonHangs.Sum(ct => ct.SoLuong * (ct.DonGia ?? 0));

                // Tạo đơn hàng chính
                var donHang = new DonHang
                {
                    LoaiDon = "sieu_thi",
                    NgayDat = DateTime.Now,
                    NgayGiao = request.NgayGiao,
                    TrangThai = "chua_nhan",
                    TongSoLuong = tongSoLuong,
                    TongGiaTri = tongGiaTri,
                    GhiChu = request.GhiChu
                };

                _context.DonHangs.Add(donHang);
                _context.SaveChanges();

                // Tạo đơn hàng siêu thị
                var donHangSieuThi = new DonHangSieuThi
                {
                    MaDonHang = donHang.MaDonHang,
                    MaSieuThi = request.MaSieuThi,
                    MaDaiLy = request.MaDaiLy
                };

                _context.DonHangSieuThis.Add(donHangSieuThi);

                // Tạo chi tiết đơn hàng
                foreach (var chiTiet in request.ChiTietDonHangs)
                {
                    var chiTietDonHang = new ChiTietDonHang
                    {
                        MaDonHang = donHang.MaDonHang,
                        MaLo = chiTiet.MaLo,
                        SoLuong = chiTiet.SoLuong,
                        DonGia = chiTiet.DonGia,
                        ThanhTien = chiTiet.SoLuong * (chiTiet.DonGia ?? 0)
                    };

                    _context.ChiTietDonHangs.Add(chiTietDonHang);
                }

                _context.SaveChanges();
                transaction.Commit();

                return true;
            }
            catch
            {
                transaction.Rollback();
                return false;
            }
        }

        public DonHangSieuThiResponse? GetDonHangById(int maDonHang)
        {
            try
            {
                // Lấy thông tin đơn hàng bằng stored procedure
                var donHangParam = new SqlParameter("@MaDonHang", maDonHang);
                var donHangInfo = _context.Database.SqlQueryRaw<DonHangInfo>(
                    "EXEC sp_GetDonHangById @MaDonHang", donHangParam).FirstOrDefault();

                if (donHangInfo == null)
                    return null;

                // Lấy chi tiết đơn hàng bằng stored procedure
                var chiTietParam = new SqlParameter("@MaDonHang", maDonHang);
                var chiTietList = _context.Database.SqlQueryRaw<ChiTietDonHangInfo>(
                    "EXEC sp_GetChiTietDonHangByMaDonHang @MaDonHang", chiTietParam).ToList();

                return new DonHangSieuThiResponse
                {
                    MaDonHang = donHangInfo.MaDonHang,
                    MaSieuThi = donHangInfo.MaSieuThi,
                    MaDaiLy = donHangInfo.MaDaiLy,
                    LoaiDon = donHangInfo.LoaiDon,
                    NgayDat = donHangInfo.NgayDat,
                    NgayGiao = donHangInfo.NgayGiao,
                    TrangThai = donHangInfo.TrangThai,
                    TongSoLuong = donHangInfo.TongSoLuong,
                    TongGiaTri = donHangInfo.TongGiaTri,
                    GhiChu = donHangInfo.GhiChu,
                    TenSieuThi = donHangInfo.TenSieuThi,
                    ChiTietDonHangs = chiTietList.Select(ct => new ChiTietDonHangResponse
                    {
                        MaLo = ct.MaLo,
                        SoLuong = ct.SoLuong,
                        DonGia = ct.DonGia,
                        ThanhTien = ct.ThanhTien
                    }).ToList()
                };
            }
            catch
            {
                return null;
            }
        }

        public List<DonHangSieuThiResponse> GetDonHangsBySieuThi(int maSieuThi)
        {
            try
            {
                // Lấy danh sách đơn hàng bằng stored procedure
                var sieuThiParam = new SqlParameter("@MaSieuThi", maSieuThi);
                var donHangList = _context.Database.SqlQueryRaw<DonHangInfo>(
                    "EXEC sp_GetDonHangsBySieuThi @MaSieuThi", sieuThiParam).ToList();

                var result = new List<DonHangSieuThiResponse>();

                foreach (var donHangInfo in donHangList)
                {
                    // Lấy chi tiết đơn hàng cho từng đơn hàng
                    var chiTietParam = new SqlParameter("@MaDonHang", donHangInfo.MaDonHang);
                    var chiTietList = _context.Database.SqlQueryRaw<ChiTietDonHangInfo>(
                        "EXEC sp_GetChiTietDonHangByMaDonHang @MaDonHang", chiTietParam).ToList();

                    result.Add(new DonHangSieuThiResponse
                    {
                        MaDonHang = donHangInfo.MaDonHang,
                        MaSieuThi = donHangInfo.MaSieuThi,
                        MaDaiLy = donHangInfo.MaDaiLy,
                        LoaiDon = donHangInfo.LoaiDon,
                        NgayDat = donHangInfo.NgayDat,
                        NgayGiao = donHangInfo.NgayGiao,
                        TrangThai = donHangInfo.TrangThai,
                        TongSoLuong = donHangInfo.TongSoLuong,
                        TongGiaTri = donHangInfo.TongGiaTri,
                        GhiChu = donHangInfo.GhiChu,
                        TenSieuThi = donHangInfo.TenSieuThi,
                        ChiTietDonHangs = chiTietList.Select(ct => new ChiTietDonHangResponse
                        {
                            MaLo = ct.MaLo,
                            SoLuong = ct.SoLuong,
                            DonGia = ct.DonGia,
                            ThanhTien = ct.ThanhTien
                        }).ToList()
                    });
                }

                return result;
            }
            catch
            {
                return new List<DonHangSieuThiResponse>();
            }
        }

        public List<KhoSimpleInfo> GetDanhSachKhoBySieuThi(int maSieuThi)
        {
            try
            {
                // Kiểm tra siêu thị có tồn tại không bằng stored procedure
                var sieuThiExistsParam = new SqlParameter("@MaSieuThi", maSieuThi);
                var existsResult = _context.Database.SqlQueryRaw<ExistsResult>(
                    "EXEC sp_CheckSieuThiExists @MaSieuThi", sieuThiExistsParam).FirstOrDefault();
                
                if (existsResult == null || existsResult.ExistsCount == 0)
                {
                    return new List<KhoSimpleInfo>();
                }

                // Lấy danh sách kho của siêu thị bằng stored procedure
                var khoParam = new SqlParameter("@MaSieuThi", maSieuThi);
                var danhSachKho = _context.Database.SqlQueryRaw<KhoSimpleInfo>(
                    "EXEC sp_GetDanhSachKhoBySieuThi @MaSieuThi", khoParam).ToList();

                return danhSachKho;
            }
            catch
            {
                return new List<KhoSimpleInfo>();
            }
        }

        public KhoHangResponse? GetKhoHangById(int maKho)
        {
            try
            {
                // Lấy thông tin kho bằng stored procedure
                var khoParam = new SqlParameter("@MaKho", maKho);
                var khoInfo = _context.Database.SqlQueryRaw<KhoInfo>(
                    "EXEC sp_GetKhoHangById @MaKho", khoParam).FirstOrDefault();

                if (khoInfo == null)
                {
                    return null;
                }

                // Lấy tồn kho bằng stored procedure (sử dụng cùng stored procedure)
                var tonKhoList = _context.Database.SqlQueryRaw<TonKhoDetail>(
                    "EXEC sp_GetKhoHangById @MaKho", khoParam).ToList();

                var tonKhoResponses = tonKhoList.Select(tk => new TonKhoResponse
                {
                    MaLo = tk.MaLo,
                    SoLuong = tk.SoLuong,
                    CapNhatCuoi = tk.CapNhatCuoi,
                    TenSanPham = $"Sản phẩm lô {tk.MaLo}", // Tạm thời
                    DonViTinh = "kg", // Tạm thời
                    TrangThaiLo = tk.TrangThaiLo
                }).ToList();

                return new KhoHangResponse
                {
                    MaKho = khoInfo.MaKho,
                    TenKho = khoInfo.TenKho,
                    LoaiKho = khoInfo.LoaiKho,
                    DiaChi = khoInfo.DiaChi,
                    TrangThai = khoInfo.TrangThai,
                    NgayTao = khoInfo.NgayTao,
                    TonKhos = tonKhoResponses,
                    TongSoLoHang = tonKhoResponses.Count,
                    TongSoLuong = tonKhoResponses.Sum(tk => tk.SoLuong)
                };
            }
            catch
            {
                return null;
            }
        }

        public bool CreateKho(CreateKhoRequest request)
        {
            try
            {
                // Kiểm tra siêu thị có tồn tại không bằng stored procedure
                var sieuThiExistsParam = new SqlParameter("@MaSieuThi", request.MaSieuThi);
                var existsResult = _context.Database.SqlQueryRaw<ExistsResult>(
                    "EXEC sp_CheckSieuThiExists @MaSieuThi", sieuThiExistsParam).FirstOrDefault();
                
                if (existsResult == null || existsResult.ExistsCount == 0)
                {
                    return false;
                }

                // Kiểm tra tên kho đã tồn tại trong siêu thị chưa bằng stored procedure
                var khoNameParams = new[]
                {
                    new SqlParameter("@MaSieuThi", request.MaSieuThi),
                    new SqlParameter("@TenKho", request.TenKho)
                };
                var nameExistsResult = _context.Database.SqlQueryRaw<ExistsResult>(
                    "EXEC sp_CheckKhoNameExists @MaSieuThi, @TenKho", khoNameParams).FirstOrDefault();

                if (nameExistsResult != null && nameExistsResult.ExistsCount > 0)
                {
                    return false;
                }

                // Tạo kho mới
                var newKho = new Kho
                {
                    MaSieuThi = request.MaSieuThi,
                    TenKho = request.TenKho,
                    LoaiKho = request.LoaiKho,
                    DiaChi = request.DiaChi,
                    TrangThai = request.TrangThai ?? "hoat_dong",
                    NgayTao = DateTime.Now
                };

                _context.Khos.Add(newKho);
                _context.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool UpdateKho(UpdateKhoRequest request)
        {
            try
            {
                // Tìm kho cần cập nhật
                var kho = _context.Khos
                    .FirstOrDefault(k => k.MaKho == request.MaKho);
                
                if (kho == null)
                {
                    return false;
                }

                // Kiểm tra tên kho mới có trùng với kho khác trong cùng siêu thị không bằng stored procedure
                if (kho.TenKho != request.TenKho)
                {
                    var khoNameParams = new[]
                    {
                        new SqlParameter("@MaSieuThi", kho.MaSieuThi),
                        new SqlParameter("@TenKho", request.TenKho),
                        new SqlParameter("@MaKho", request.MaKho)
                    };
                    var nameExistsResult = _context.Database.SqlQueryRaw<ExistsResult>(
                        "EXEC sp_CheckKhoNameExists @MaSieuThi, @TenKho, @MaKho", khoNameParams).FirstOrDefault();

                    if (nameExistsResult != null && nameExistsResult.ExistsCount > 0)
                    {
                        return false;
                    }
                }

                // Cập nhật thông tin mới
                kho.TenKho = request.TenKho;
                kho.LoaiKho = request.LoaiKho;
                kho.DiaChi = request.DiaChi;
                kho.TrangThai = request.TrangThai;

                _context.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteKho(int maKho)
        {
            try
            {
                // Tìm kho cần xóa
                var kho = _context.Khos
                    .Include(k => k.TonKhos)
                    .FirstOrDefault(k => k.MaKho == maKho);
                
                if (kho == null)
                {
                    return false;
                }

                // Kiểm tra kho có tồn kho không
                if (kho.TonKhos.Any())
                {
                    return false;
                }

                // Xóa kho
                _context.Khos.Remove(kho);
                _context.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteTonKho(DeleteTonKhoRequest request)
        {
            try
            {
                // Kiểm tra kho có tồn tại không
                var kho = _context.Khos
                    .FirstOrDefault(k => k.MaKho == request.MaKho);
                
                if (kho == null)
                {
                    return false;
                }

                // Tìm tồn kho cần xóa
                var tonKho = _context.TonKhos
                    .FirstOrDefault(tk => tk.MaKho == request.MaKho && tk.MaLo == request.MaLo);

                if (tonKho == null)
                {
                    return false;
                }

                // Xóa tồn kho
                _context.TonKhos.Remove(tonKho);
                _context.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool GetSieuThiById(int maSieuThi)
        {
            try
            {
                return _context.SieuThis
                    .FirstOrDefault(st => st.MaSieuThi == maSieuThi) != null;
            }
            catch
            {
                return false;
            }
        }
    }
}