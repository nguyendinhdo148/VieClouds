// components/LinkShareModal.jsx
import { useState } from "react";
import Modal from "./Modal";
import { Copy, CheckCircle } from "lucide-react";

const LinkShareModal = ({
                            isOpen,
                            onClose,
                            link = "",
                            title = "Share Link",
                            message = "Copy the link below to share this file"
                        }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            const textArea = document.createElement('textarea');
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        setCopied(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            size="md"
            // Thêm các props sau để ẩn nút Cancel
            cancelText="" // Truyền chuỗi rỗng
            onConfirm={null} // Truyền null để ẩn nút Confirm
        >
            {/* Message */}
            <p className="text-gray-600 mb-4 text-sm">
                {message}
            </p>

            {/* Link input with copy button */}
            <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={link}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md pr-16 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onClick={(e) => e.target.select()}
                    />
                </div>
                <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        copied
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                >
                    {copied ? (
                        <>
                            <CheckCircle size={16} />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            Copy
                        </>
                    )}
                </button>
            </div>

            {/* Additional information */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
                <p className="font-medium">Bất kỳ ai có liên kết này đều có thể xem tệp</p>
                <p className="text-blue-600 mt-1">Liên kết sẽ vẫn hoạt động miễn là tệp vẫn công khai</p>
            </div>

            {/* Close button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default LinkShareModal;