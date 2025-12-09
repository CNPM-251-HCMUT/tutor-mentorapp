import React, { useEffect } from 'react';
import './Logbar.css'; 

interface LogbarProps {
  message: string;
  type: 'success' | 'error'; 
  onClose: () => void;       
}

const Logbar: React.FC<LogbarProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
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
