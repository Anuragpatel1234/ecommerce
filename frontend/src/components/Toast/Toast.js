import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 2700); // Start exit animation slightly before removal

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Wait for animation to finish
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <i className="fa-solid fa-circle-check"></i>;
            case 'error':
                return <i className="fa-solid fa-circle-exclamation"></i>;
            case 'warning':
                return <i className="fa-solid fa-triangle-exclamation"></i>;
            default:
                return <i className="fa-solid fa-circle-info"></i>;
        }
    };

    return (
        <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
            <div className="toast-icon">{getIcon()}</div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={handleClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
};

export default Toast;
