import React, { useState } from 'react';
import { apiService } from '../services/api';
import './Common.css';

function Calculator() {
  const [sumN, setSumN] = useState({ input: '', result: null, loading: false });
  const [sumTwo, setSumTwo] = useState({ a: '', b: '', result: null, loading: false });

  const handleTinhTong = async () => {
    if (!sumN.input) return;
    
    setSumN({ ...sumN, loading: true });
    try {
      const response = await apiService.tinhTong(sumN.input);
      setSumN({ ...sumN, result: response, loading: false });
    } catch (err) {
      console.error('Error:', err);
      setSumN({ ...sumN, loading: false });
    }
  };

  const handleTinhTongHaiSo = async () => {
    if (!sumTwo.a || !sumTwo.b) return;
    
    setSumTwo({ ...sumTwo, loading: true });
    try {
      const response = await apiService.tinhTongHaiSo(sumTwo.a, sumTwo.b);
      setSumTwo({ ...sumTwo, result: response, loading: false });
    } catch (err) {
      console.error('Error:', err);
      setSumTwo({ ...sumTwo, loading: false });
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Công cụ tính toán</h1>

      <div className="calculator-grid">
        <div className="calculator-card">
          <h3>Tính tổng từ 1 đến n</h3>
          <p className="card-description">Nhập số n để tính tổng: 1 + 2 + 3 + ... + n</p>
          
          <div className="form-group">
            <label>Nhập số n:</label>
            <input
              type="number"
              value={sumN.input}
              onChange={(e) => setSumN({ ...sumN, input: e.target.value })}
              placeholder="Ví dụ: 100"
            />
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleTinhTong}
            disabled={sumN.loading}
          >
            {sumN.loading ? 'Đang tính...' : 'Tính toán'}
          </button>

          {sumN.result && (
            <div className="result-box">
              <h4>Kết quả:</h4>
              <p className="result-message">{sumN.result.message}</p>
              <div className="result-detail">
                <span>Input: {sumN.result.input}</span>
                <span className="result-value">{sumN.result.result}</span>
              </div>
            </div>
          )}
        </div>

        <div className="calculator-card">
          <h3>Tính tổng hai số</h3>
          <p className="card-description">Nhập hai số a và b để tính tổng: a + b</p>
          
          <div className="form-group">
            <label>Số thứ nhất (a):</label>
            <input
              type="number"
              value={sumTwo.a}
              onChange={(e) => setSumTwo({ ...sumTwo, a: e.target.value })}
              placeholder="Ví dụ: 25"
            />
          </div>

          <div className="form-group">
            <label>Số thứ hai (b):</label>
            <input
              type="number"
              value={sumTwo.b}
              onChange={(e) => setSumTwo({ ...sumTwo, b: e.target.value })}
              placeholder="Ví dụ: 75"
            />
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleTinhTongHaiSo}
            disabled={sumTwo.loading}
          >
            {sumTwo.loading ? 'Đang tính...' : 'Tính toán'}
          </button>

          {sumTwo.result && (
            <div className="result-box">
              <h4>Kết quả:</h4>
              <p className="result-message">{sumTwo.result.message}</p>
              <div className="result-detail">
                <span>{sumTwo.result.a} + {sumTwo.result.b} =</span>
                <span className="result-value">{sumTwo.result.result}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="info-box">
        <div className="info-icon">💡</div>
        <div>
          <h3>Thông tin</h3>
          <p>Các API này được xây dựng bằng Node.js + TypeScript + Express theo yêu cầu trong tài liệu.</p>
          <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>GET /TinhTong/:id - Tính tổng từ 1 đến n</li>
            <li>POST /TinhTongHaiSo - Tính tổng hai số</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
