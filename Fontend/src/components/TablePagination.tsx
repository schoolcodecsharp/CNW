import React from 'react';
import { Pagination } from 'antd';
import 'antd/dist/reset.css';

interface TablePaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({ 
  current, 
  total, 
  pageSize,
  onChange 
}) => {
  if (total === 0) return null;

  return (
    <div style={{ 
      marginTop: '20px', 
      display: 'flex', 
      justifyContent: 'center',
      padding: '0 16px'
    }}>
      <Pagination 
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
      />
    </div>
  );
};

export default TablePagination;
