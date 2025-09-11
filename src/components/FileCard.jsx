import { useState } from "react";
import { Copy, Download, Eye, FileIcon, FileText, Globe, Image, Lock, Music, Trash2, Video } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints.js";

const FileCard = ({ file, onFileUpdate, onFileDelete }) => {
    const [showActions, setShowActions] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentFile, setCurrentFile] = useState(file); // Local state for real-time updates
    const { getToken } = useAuth();

    const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
            return <Image size={24} className="text-purple-500" />
        }

        if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
            return <Video size={24} className="text-blue-500" />
        }

        if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
            return <Music size={24} className="text-green-500" />
        }
        if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
            return <FileText size={24} className="text-amber-500" />
        }

        return <FileIcon size={24} className="text-purple-500" />
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Toggle public/private status
    const togglePublic = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            const token = await getToken();
            await axios.patch(apiEndpoints.TOGGLE_FILE(currentFile.id), {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state immediately for real-time UI update
            const updatedFile = { ...currentFile, isPublic: !currentFile.isPublic };
            setCurrentFile(updatedFile);

            // Notify parent component about the update
            if (onFileUpdate) onFileUpdate(updatedFile);

            toast.success(`File is now ${updatedFile.isPublic ? 'public' : 'private'}`);
        } catch (error) {
            console.error('Error toggling file status', error);
            toast.error('Error toggling file status: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    }

    // Handle file download
    const handleDownload = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            const token = await getToken();
            const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(currentFile.id), {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            // Create a blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", currentFile.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Download started');
        } catch (error) {
            console.error('Download failed', error);
            toast.error('Error downloading file: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    }

    // Handle file deletion
    const handleDelete = async () => {
        if (isProcessing) return;

        if (!window.confirm("Bạn có chắc muốn xoá tệp này? Đây là hành động không thể phục hồi.")) {
            return;
        }

        setIsProcessing(true);
        try {
            const token = await getToken();
            const response = await axios.delete(apiEndpoints.DELETE_FILE(currentFile.id), {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 204) {
                // Notify parent component about the deletion
                if (onFileDelete) onFileDelete(currentFile.id);
                toast.success('File deleted successfully');
            } else {
                toast.error('Error deleting file');
            }
        } catch (error) {
            console.error('Error deleting file', error);
            toast.error('Error deleting file: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    }

    // Copy share link to clipboard
    const copyShareLink = () => {
        const link = `${window.location.origin}/file/${currentFile.id}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                toast.success('Link copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                toast.error('Failed to copy link');
            });
    }

    return (
        <div
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            className="relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
        >
            {/* File preview area */}
            <div className="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
                {getFileIcon(currentFile)}
            </div>

            {/* Public/private badge - updates in real-time */}
            <div className="absolute top-2 right-2">
                <div
                    className={`rounded-full p-1.5 ${currentFile.isPublic ? 'bg-green-100' : 'bg-gray-100'}`}
                    title={currentFile.isPublic ? "Public" : "Private"}
                >
                    {currentFile.isPublic ? (
                        <Globe size={20} className="text-green-600" />
                    ) : (
                        <Lock size={20} className="text-gray-600" />
                    )}
                </div>
            </div>

            {/* File info */}
            <div className="p-4">
                <div className="overflow-hidden">
                    <h3 title={currentFile.name} className="font-medium text-gray-900 truncate text-sm">
                        {currentFile.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(currentFile.size)} • {formatDate(currentFile.uploadedAt)}
                    </p>
                </div>
            </div>

            {/* Action buttons */}
            <div
                className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="flex gap-3 w-full justify-center">
                    {currentFile.isPublic && (
                        <button
                            onClick={copyShareLink}
                            title="Copy Share Link"
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-purple-500 hover:text-purple-600"
                            disabled={isProcessing}
                        >
                            <Copy size={18} />
                        </button>
                    )}

                    {currentFile.isPublic && (
                        <a
                            href={`/file/${currentFile.id}`}
                            title="View File"
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-700 hover:text-gray-900"
                        >
                            <Eye size={18} />
                        </a>
                    )}

                    <button
                        onClick={handleDownload}
                        title="Download"
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-green-600 hover:text-green-700"
                        disabled={isProcessing}
                    >
                        <Download size={18} />
                    </button>

                    <button
                        onClick={togglePublic}
                        title={currentFile.isPublic ? "Make Private" : "Make Public"}
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-amber-600 hover:text-amber-700"
                        disabled={isProcessing}
                    >
                        {currentFile.isPublic ? <Lock size={18} /> : <Globe size={18} />}
                    </button>

                    <button
                        onClick={handleDelete}
                        title="Delete"
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-red-600 hover:text-red-700"
                        disabled={isProcessing}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Processing overlay */}
            {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            )}
        </div>
    )
}

export default FileCard;