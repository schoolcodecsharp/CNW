import React, { useState } from 'react';

function AuditLogs() {
  // Mock audit logs
  const [logs] = useState([
    { id: 1, time: '2024-03-24 10:30:00', user: 'admin', action: 'Đăng nhập hệ thống', ip: '192.168.1.1' },
    { id: 2, time: '2024-03-24 10:25:00', user: 'nongdan1', action: 'Tạo lô nông sản mới', ip: '192.168.1.2' },
    { id: 3, time: '2024-03-24 10:20:00', user: 'daily1', action: 'Cập nhật trạng thái đơn hàng', ip: '192.168.1.3' },
    { id: 4, time: '2024-03-24 10:15:00', user: 'sieuthi1', action: 'Tạo đơn hàng mới', ip: '192.168.1.4' },
    { id: 5, time: '2024-03-24 10:10:00', user: 'nongdan2', action: 'Cập nhật thông tin trang trại', ip: '192.168.1.5' }
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Audit / Log</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">📥 Xuất log</button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Thời gian</th>
              <th>Người dùng</th>
              <th>Hành động</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.time}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogs;
