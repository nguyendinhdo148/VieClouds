// components/FileView.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {apiEndpoints} from "../util/apiEndpoints.js";
import {Download} from "lucide-react";


const FileView = () => {
    const { fileId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [fileInfo, setFileInfo] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const token = await getToken();

                // Lấy thông tin file
                const infoResponse = await axios.get(apiEndpoints.VIEW_PUBLIC_FILE(fileId), {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (infoResponse.status === 200) {
                    setFileInfo(infoResponse.data);

                    // Lấy file content để xem trước
                    const fileResponse = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileId), {
                        headers: { Authorization: `Bearer ${token}` },
                        responseType: 'blob'
                    });

                    const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
                    setFileUrl(url);
                }
            } catch (error) {
                console.error('Error fetching file:', error);
                toast.error('Cannot access file');
                navigate('/my-files');
            } finally {
                setLoading(false);
            }
        };

        fetchFile();

        // Cleanup
        return () => {
            if (fileUrl) {
                window.URL.revokeObjectURL(fileUrl);
            }
        };
    }, [fileId, getToken, navigate]);

    const getFilePreview = () => {
        if (!fileInfo || !fileUrl) return null;

        const extension = fileInfo.name.split('.').pop().toLowerCase();

        // Xem trước hình ảnh
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
            return (
                <div className="flex justify-center">
                    <img
                        src={fileUrl}
                        alt={fileInfo.name}
                        className="max-w-full max-h-96 object-contain"
                    />
                </div>
            );
        }

        // Xem trước PDF
        if (extension === 'pdf') {
            return (
                <div className="w-full h-96">
                    <iframe
                        src={fileUrl}
                        title={fileInfo.name}
                        className="w-full h-full border-none"
                    />
                </div>
            );
        }

        // Xem trước text files
        if (['txt', 'md', 'html', 'css', 'js', 'json'].includes(extension)) {
            return (
                <div className="w-full h-96">
                    <iframe
                        src={fileUrl}
                        title={fileInfo.name}
                        className="w-full h-full border-none"
                    />
                </div>
            );
        }

        // Không hỗ trợ xem trước - hiển thị thông tin file
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 mb-4">File preview not available</p>
                <p className="text-sm text-gray-400">This file type cannot be previewed in the browser</p>
            </div>
        );
    };

    const handleDownload = () => {
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', fileInfo.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <button
                    onClick={() => navigate('/my-files')}
                    className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                    ← Back to My Files
                </button>

                {fileInfo && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">{fileInfo.name}</h1>
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Download size={18} />
                                Download
                            </button>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">File Size</p>
                                <p className="font-medium">{(fileInfo.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Upload Date</p>
                                <p className="font-medium">{new Date(fileInfo.uploadedAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Visibility</p>
                                <p className="font-medium">{fileInfo.isPublic ? 'Public' : 'Private'}</p>
                            </div>
                        </div>

                        {/* File Preview Area */}
                        <div className="border rounded-lg p-4 bg-gray-50">
                            {getFilePreview()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileView;