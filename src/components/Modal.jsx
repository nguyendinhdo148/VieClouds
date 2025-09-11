// Modal.jsx
import { useEffect } from "react";

const Modal = ({
                   isOpen,
                   onClose,
                   children,
                   title = "",
                   confirmText = "",
                   cancelText = "",
                   onConfirm,
                   confirmationButtonClass = "bg-blue-600 hover:bg-blue-700",
                   size = "md", // sm, md, lg
                   overlayClass = "fixed inset-0 flex items-center justify-center p-4 z-50",
                   modalClass = "bg-white rounded-lg shadow-xl mx-auto p-6"
               }) => {
    // Đóng modal khi nhấn phím Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.keyCode === 27) onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = 'hidden'; // Ngăn cuộn nền
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Xử lý đóng modal khi click bên ngoài
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Xác định kích thước modal
    const getSizeClass = () => {
        switch (size) {
            case "sm":
                return "max-w-md";
            case "md":
                return "max-w-lg";
            case "lg":
                return "max-w-2xl";
            default:
                return "max-w-lg";
        }
    };

    // Kiểm tra xem có nên hiển thị nút Cancel không
    const shouldShowCancel = onClose && cancelText !== null && cancelText !== "";

    if (!isOpen) return null;

    return (
        <div className={overlayClass} onClick={handleOverlayClick}>
            <div className={`${modalClass} ${getSizeClass()}`}>
                {/* Header với tiêu đề và nút đóng */}
                {(title || onClose) && (
                    <div className="flex items-center justify-between mb-4">
                        {title && (
                            <h2 className="text-xl font-semibold text-gray-800">
                                {title}
                            </h2>
                        )}
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                )}

                {/* Nội dung modal */}
                <div className="mb-6">
                    {children}
                </div>

                {/* Footer với các nút hành động */}
                {(onConfirm || shouldShowCancel) && (
                    <div className="flex justify-end space-x-3">
                        {shouldShowCancel && (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {cancelText}
                            </button>
                        )}
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${confirmationButtonClass}`}
                            >
                                {confirmText || "Confirm"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;