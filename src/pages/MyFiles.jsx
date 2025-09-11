import DashboardLayout from "../layout/DashboardLayout.jsx";
import {useEffect, useState, useContext} from "react";
import {
    Copy,
    Download,
    Eye,
    File,
    FileIcon,
    FileText,
    Globe,
    Grid,
    Image,
    List,
    Lock,
    Music,
    Share,
    Trash2,
    Video,
    Upload,
    X
} from "lucide-react";
import {useAuth} from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import FileCard from "../components/FileCard.jsx";
import {apiEndpoints} from "../util/apiEndpoints.js";
import ConfirmationDialog from "../components/ConfirmationDialog.jsx";
import LinkShareModal from "../components/LinkShareModal.jsx";
import {UserCreditsContext} from "../context/UserCreditsContext.jsx";

const MyFiles = () => {
    const [files, setFiles] = useState([]); //
    const [viewMode, setViewMode] = useState("list");
    const {getToken} = useAuth();
    const navigate = useNavigate();
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        fileId: null,
    });
    const [shareModal, setShareModal] = useState({
        isOpen: false,
        fileId: null,
        link:""
    });
    
    // Drag and drop states
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadQueue, setUploadQueue] = useState([]);
    
    // Credits context
    const userCreditsContext = useContext(UserCreditsContext);
    const credits = userCreditsContext?.credits || 0;
    const setCredits = userCreditsContext?.setCredits;

    //fetching the files for a logged in user
    const fetchFiles = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(apiEndpoints.FETCH_FILES, {headers: {Authorization: `Bearer ${token}`}});
            if(response.status === 200) {
                console.log(response.data);
                setFiles(response.data)
            }
        } catch (error) {
            console.error('Error fetching the files from server', error);
            toast.error('Error fetching the files from server: ',error.message);
        }
    }

    //Toggle the public/private status of a file

    const togglePublic = async (fileToUpdate) => {
        try {
            const token = await getToken();
            await axios.patch(apiEndpoints.TOGGLE_FILE(fileToUpdate.id), {}, {headers: {Authorization: `Bearer ${token}`}});

            setFiles(files.map((file) => file.id === fileToUpdate.id ? {...file, isPublic: !file.isPublic}: file));
        } catch (error) {
            console.error('Error toggling file status', error);
            toast.error('Error toggling file status: ',error.message);
        }
    }

    //handle P2P share
    const handleP2PShare = (file) => {
        // Tạo URL với file parameters
        const fileData = {
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream',
            downloadUrl: apiEndpoints.DOWNLOAD_FILE(file.id)
        };
        
        // Encode file data as URL parameter
        const encodedFileData = encodeURIComponent(JSON.stringify(fileData));
        const p2pUrl = `http://localhost:3000?preselectedFile=${encodedFileData}`;
        
        // Mở P2P sharing với file đã được chọn sẵn
        window.open(p2pUrl, '_blank');
        toast.success(`Đang mở P2P sharing cho file: ${file.name}`);
    }

    // Drag and Drop handlers
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Only set drag over to false if leaving the main container
        if (e.target === e.currentTarget) {
            setIsDragOver(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            handleFileUpload(droppedFiles);
        }
    };

    // File upload handler
    const handleFileUpload = async (filesToUpload) => {
        const MAX_FILES = 5;
        
        if (filesToUpload.length > MAX_FILES) {
            toast.error(`Chỉ có thể upload tối đa ${MAX_FILES} files cùng lúc`);
            return;
        }

        if (filesToUpload.length > credits) {
            toast.error("Không đủ credits để upload các files này");
            return;
        }

        setUploading(true);
        setUploadQueue(filesToUpload.map(file => ({ file, status: 'uploading', progress: 0 })));
        
        // Trừ credits ngay khi bắt đầu upload
        if (setCredits) {
            setCredits((prev) => prev - filesToUpload.length);
        }

        const formData = new FormData();
        filesToUpload.forEach((file) => formData.append("files", file));

        try {
            const token = await getToken();
            const response = await axios.post(apiEndpoints.UPLOAD_FILE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadQueue(queue => 
                        queue.map(item => ({ ...item, progress }))
                    );
                }
            });

            // Cập nhật credits từ server
            if (response.data && response.data.remainingCredits !== undefined && setCredits) {
                setCredits(response.data.remainingCredits);
            }

            // Cập nhật upload queue thành success
            setUploadQueue(queue => 
                queue.map(item => ({ ...item, status: 'success', progress: 100 }))
            );

            toast.success(`${filesToUpload.length} file(s) uploaded successfully!`);
            
            // Refresh file list
            fetchFiles();
            
            // Clear upload queue after 3 seconds
            setTimeout(() => {
                setUploadQueue([]);
            }, 3000);

        } catch (error) {
            console.error("Error uploading files: ", error);
            const errorMessage = error.response?.data?.message || "Error uploading files. Please try again.";
            
            // Hoàn credits nếu upload thất bại
            if (setCredits) {
                setCredits((prev) => prev + filesToUpload.length);
            }
            
            // Cập nhật upload queue thành error
            setUploadQueue(queue => 
                queue.map(item => ({ ...item, status: 'error' }))
            );
            
            toast.error(errorMessage);
            
            // Clear upload queue after 5 seconds
            setTimeout(() => {
                setUploadQueue([]);
            }, 5000);
        } finally {
            setUploading(false);
        }
    };

    // Remove file from upload queue
    const removeFromQueue = (index) => {
        setUploadQueue(queue => queue.filter((_, i) => i !== index));
    };

    const handleDownload = async (file) => {
        try {
            const token = await getToken();
            const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(file.id), {headers: {Authorization: `Bearer ${token}`},responseType: 'blob'});

            //create a blob url and trigger download

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed', error);
            toast.error('Error downloading file', error.message);
        }
    }

    //closes the delete confirmation modal
    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            fileId: null
        })
    }

    //Open the delete confirmation modal
    const openDeleteConfirmation = (fileId) => {
        setDeleteConfirmation({
            isOpen: true,
            fileId
        })
    }

    //opens the share link modal
    const openShareModal = (fileId) => {
        const link = `${window.location.origin}/file/${fileId}`;
        setShareModal({
            isOpen: true,
            fileId,
            link,
        })
    }

    //close the share link modal
    const closeShareModal = () => {
        setShareModal({
            isOpen: false,
            fileId: null,
            link: ""
        })
    }
    //Delete a file after confirmation
    const handleDelete = async () => {
        const fileId = deleteConfirmation.fileId;
        if (!fileId) return;

        try {
            const token = await getToken();
            const response = await axios.delete(apiEndpoints.DELETE_FILE(fileId), {headers: {Authorization: `Bearer ${token}`}})
            if (response.status === 204) {
                setFiles(files.filter((file) => file.id !== fileId));
                closeDeleteConfirmation();
            } else {
                toast.error('Error deleting file');
            }
        } catch (error) {
            console.error('Error deleting file', error);
            toast.error('Error deleting file', error.message);
        }
    }

    useEffect(() => {
        fetchFiles();
    }, [getToken]);

    const getFileIcon = (file) => {
        const extenstion = file.name.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extenstion)) {
            return <Image size={24} className="text-purple-500" />
        }

        if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extenstion)) {
            return <Video size={24} className="text-blue-500" />
        }

        if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extenstion)) {
            return <Music size={24} className="text-green-500" />
        }
        if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extenstion)) {
            return <FileText size={24} className="text-amber-500" />
        }

        return  <FileIcon size={24} className="text-purple-500"/>
    }

    return (
        <DashboardLayout activeMenu="My Files">
            <div 
                className="p-6 relative min-h-screen"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {/* Drag Overlay */}
                {isDragOver && (
                    <div className="fixed inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 text-center shadow-2xl border-2 border-dashed border-blue-500">
                            <Upload size={48} className="text-blue-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Thả file để upload</h3>
                            <p className="text-gray-600">Hỗ trợ tất cả định dạng file</p>
                        </div>
                    </div>
                )}

                {/* Upload Queue */}
                {uploadQueue.length > 0 && (
                    <div className="mb-6 bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Upload size={20} className="text-blue-500" />
                            Đang upload {uploadQueue.length} file(s)
                        </h3>
                        <div className="space-y-3">
                            {uploadQueue.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        {item.status === 'uploading' && (
                                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        {item.status === 'success' && (
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        {item.status === 'error' && (
                                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                                <X size={16} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800">{item.file.name}</div>
                                        <div className="text-sm text-gray-600">{(item.file.size / 1024).toFixed(1)} KB</div>
                                        {item.status === 'uploading' && (
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div 
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                                    style={{ width: `${item.progress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0">
                                        {item.status === 'success' && (
                                            <span className="text-green-600 font-medium">Hoàn thành</span>
                                        )}
                                        {item.status === 'error' && (
                                            <span className="text-red-600 font-medium">Lỗi</span>
                                        )}
                                        {item.status === 'uploading' && (
                                            <span className="text-blue-600 font-medium">{item.progress}%</span>
                                        )}
                                        <button
                                            onClick={() => removeFromQueue(index)}
                                            className="ml-2 text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        Tệp của tôi {files.length}
                    </h2>
                    <div className="flex items-center gap-3">
                        <List
                            onClick={() => setViewMode("list")}
                            size={24}
                            className={`cursor-pointer transition-colors ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        />
                        <Grid
                            size={24}
                            onClick={() => setViewMode("grid")}
                            className={`cursor-pointer transition-colors ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        />
                    </div>
                </div>

                {files.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
                        <File
                            size = {60}
                            className = "text-purple-300 mb-4"
                        />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            Chưa có tập tin nào được tải lên
                        </h3>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            Bắt đầu tải tệp lên để xem chúng được liệt kê ở đây. Bạn có thể <strong>kéo thả file</strong> vào đây hoặc tải lên tài liệu, hình ảnh và các tệp khác để chia sẻ và quản lý chúng một cách an toàn.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/upload')}
                                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                                Tải lên
                            </button>
                            <div className="text-gray-400 self-center">hoặc</div>
                            <div className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500">
                                Kéo thả file vào đây
                            </div>
                        </div>
                    </div>
                ): viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {files.map((file) => (
                            <FileCard
                                key = {file.id}
                                file = {file}
                            />
                        ))}
                    </div>
                ): (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full">
                            <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên file</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kích thước</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tải lên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chia sẻ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {files.map((file) => (
                                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            <div className="flex items-center gap-2">
                                                {getFileIcon(file)}
                                                {file.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {(file.size/1024).toFixed(1)} KB
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(file.uploadedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => togglePublic(file)}
                                                    className="flex items-center gap-2 cursor-pointer group">
                                                    {file.isPublic ? (
                                                        <>
                                                            <Globe size={16} className="text-green-500"/>
                                                            <span className="group-hover:underline">
                                                                Công khai
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock size={16} className="text-gray-500"/>
                                                            <span className="group-hover:underline">
                                                                Chỉ mình tôi
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                                {file.isPublic && (
                                                    <button
                                                        onClick={() => openShareModal(file.id)}
                                                        className="flex items-center gap-2 cursor-pointer group text-blue-600">
                                                        <Copy size={16}/>
                                                        <span className="group-hover:underline">
                                                            Chia sẻ đường dẫn
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="grid grid-cols-4 gap-3">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleDownload(file)}
                                                        title="Download"
                                                        className="text-gray-500 hover:text-blue-600 cursor-pointer">
                                                        <Download size={18} />
                                                    </button>
                                                </div>
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleP2PShare(file)}
                                                        title="P2P Share"
                                                        className="text-gray-500 hover:text-green-600 cursor-pointer">
                                                        <Share size={18} />
                                                    </button>
                                                </div>
                                                <div className="flex justify-center ">
                                                    <button
                                                        onClick={() => openDeleteConfirmation(file.id)}
                                                        title="Delete"
                                                        className="text-gray-500 hover:text-red-600 cursor-pointer">
                                                        <Trash2 size={18}/>
                                                    </button>
                                                </div>
                                                <div className="flex justify-center">
                                                    {file.isPublic ? (
                                                        <a
                                                            href={`/file/${file.id}`}
                                                            title="View File"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-gray-500 hover:text-blue-600"
                                                        >
                                                            <Eye size={18}/>
                                                        </a>
                                                    ) : (
                                                        <span className="w-[18px]"></span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/*Delete confirmation dialog*/}

                <ConfirmationDialog
                    isOpen={deleteConfirmation.isOpen}
                    onClose={closeDeleteConfirmation}
                    title="Delete File"
                    message="Bạn có chắc muốn xoá tệp này? đây là hành động không thể phục hồi. "
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDelete}
                    confirmationButtonClass="bg-red-600 hover:bg-red-700"
                />
            </div>

            {/*Share link modal*/}

            <LinkShareModal
                isOpen = {shareModal.isOpen}
                onClose = {closeShareModal}
                link={shareModal.link}
                title="Share File"
            />
        </DashboardLayout>
    );
};

export default MyFiles;
