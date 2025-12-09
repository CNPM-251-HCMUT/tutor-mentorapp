import React, { useEffect } from 'react';
import './Logbar.css'; // Đảm bảo bạn đã có file css

// 1. Định nghĩa kiểu dữ liệu cho Props
interface LogbarProps {
  message: string;
  type: 'success' | 'error'; // Giới hạn chỉ nhận 2 giá trị này
  onClose: () => void;       // Đây là một hàm không trả về gì
}

// 2. Gán type vào Component
const Logbar: React.FC<LogbarProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    // Lưu ý: ClassName phải khớp với file CSS của bạn
    <div className={`toast toast-${type}`}> 
      <div className="toast-icon">
        {type === 'success' ? '✅' : '❌'}
      </div>
      <div className="toast-body">
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Logbar;