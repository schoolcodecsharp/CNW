import { Request, Response } from 'express';
import express = require('express');
import cors = require('cors');

const app = express();
const port = 6000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Agricultural Supply Chain API',
    version: '1.0.0',
    endpoints: [
      'GET /',
      'GET /TinhTong/:id',
      'POST /TinhTongHaiSo',
      'GET /api/nongdan',
      'GET /api/trangtrai',
      'GET /api/lonongsan'
    ]
  });
});

// Tính tổng từ 1 đến n
app.get('/TinhTong/:id', (req: Request, res: Response) => {
  const n = +req.params.id;
  let s: number = 0;
  for (let i = 1; i <= n; ++i) {
    s += i;
  }
  res.json({ 
    input: n,
    result: s,
    message: `Tổng từ 1 đến ${n} là: ${s}` 
  });
});

// Tính tổng hai số
app.post('/TinhTongHaiSo', (req: Request, res: Response) => {
  const obj = req.body as { a: any; b: any };
  const s: number = Number(obj.a) + Number(obj.b);
  res.json({ 
    a: obj.a,
    b: obj.b,
    result: s,
    message: `Tổng của ${obj.a} và ${obj.b} là: ${s}` 
  });
});

// API endpoints cho hệ thống nông sản
app.get('/api/nongdan', (req: Request, res: Response) => {
  // Mock data - sẽ kết nối với database thật sau
  res.json({
    success: true,
    data: [
      { maNongDan: 'ND001', hoTen: 'Nguyễn Văn A', soDienThoai: '0901234567', email: 'nva@example.com', diaChi: 'Hà Nội' },
      { maNongDan: 'ND002', hoTen: 'Trần Thị B', soDienThoai: '0907654321', email: 'ttb@example.com', diaChi: 'Hải Phòng' }
    ]
  });
});

app.get('/api/trangtrai', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { maTrangTrai: 'TT001', tenTrangTrai: 'Trang trại A', dienTich: '10 ha', viTri: 'Hà Nội', maNongDan: 'ND001', trangThai: 'hoat_dong' },
      { maTrangTrai: 'TT002', tenTrangTrai: 'Trang trại B', dienTich: '15 ha', viTri: 'Hải Phòng', maNongDan: 'ND002', trangThai: 'hoat_dong' }
    ]
  });
});

app.get('/api/lonongsan', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { maLoNongSan: 'LNS001', tenLoNongSan: 'Lúa gạo', soLuong: 1000, donVi: 'kg', maTrangTrai: 'TT001', ngayThu: '2024-01-15' },
      { maLoNongSan: 'LNS002', tenLoNongSan: 'Rau xanh', soLuong: 500, donVi: 'kg', maTrangTrai: 'TT002', ngayThu: '2024-01-20' }
    ]
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/`);
});
