import { useState, useEffect, useContext } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    FileText,
    Grid,
    List,
    Download,
    Trash2,
    Eye,
    Globe,
    Lock,
    Copy,
    UploadCloud,
    X,
    Loader2,
    AlertCircle,
    CreditCard,
    BarChart3,
    PieChart,
    FolderOpen,
    HardDrive,
    Users,
    Calendar,
    Search,
    Filter,
    MoreVertical
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import FileCard from "../components/FileCard.jsx";
import ConfirmationDialog from "../components/ConfirmationDialog.jsx";
import LinkShareModal from "../components/LinkShareModal.jsx";
import { apiEndpoints } from "../util/apiEndpoints.js";
import { UserCreditsContext } from "../context/UserCreditsContext.jsx";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [files, setFiles] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const userCreditsContext = useContext(UserCreditsContext);
    const credits = userCreditsContext?.credits || 0;

    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        fileId: null,
    });

    const [shareModal, setShareModal] = useState({
        isOpen: false,
        fileId: null,
        link: ""
    });

    // Statistics data
    const stats = [
        { label: "Tổng số tệp", value: files.length, icon: <FileText size={20} className="text-blue-500" /> },
        { label: "Đã sử dụng", value: `${(files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)} MB`, icon: <HardDrive size={20} className="text-purple-500" /> },
        { label: "Credit còn lại", value: credits, icon: <CreditCard size={20} className="text-green-500" /> },
        { label: "Tệp công khai", value: files.filter(f => f.isPublic).length, icon: <Users size={20} className="text-amber-500" /> }
    ];

    // Fetch files
    const fetchFiles = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(apiEndpoints.FETCH_FILES, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                setFiles(response.data);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
            toast.error('Lỗi khi tải danh sách tệp');
        }
    };

    // Filter files based on search and filter
    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === "all" ||
            (filterType === "public" && file.isPublic) ||
            (filterType === "private" && !file.isPublic);

        return matchesSearch && matchesFilter;
    });

    useEffect(() => {
        fetchFiles();
    }, [getToken]);

    // File type icon mapping
    const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        const iconProps = { size: 20 };

        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
            return <div className="p-2 bg-blue-100 rounded-lg"><FileText {...iconProps} className="text-blue-600" /></div>;
        }
        if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
            return <div className="p-2 bg-red-100 rounded-lg"><FileText {...iconProps} className="text-red-600" /></div>;
        }
        if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
            return <div className="p-2 bg-green-100 rounded-lg"><FileText {...iconProps} className="text-green-600" /></div>;
        }
        if (['pdf'].includes(extension)) {
            return <div className="p-2 bg-amber-100 rounded-lg"><FileText {...iconProps} className="text-amber-600" /></div>;
        }
        if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
            return <div className="p-2 bg-indigo-100 rounded-lg"><FileText {...iconProps} className="text-indigo-600" /></div>;
        }

        return <div className="p-2 bg-gray-100 rounded-lg"><FileText {...iconProps} className="text-gray-600" /></div>;
    };

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Quản lý và theo dõi các tệp của bạn</p>
                    </div>

                    <button
                        onClick={() => navigate('/upload')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <UploadCloud size={18} />
                        Tải lên tệp mới
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        {[
                            { id: "overview", label: "Tổng quan", icon: <BarChart3 size={18} /> },
                            { id: "files", label: "Tệp của tôi", icon: <FolderOpen size={18} /> },
                            { id: "analytics", label: "Phân tích", icon: <PieChart size={18} /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-1 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-600">{stat.label}</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                        </div>
                                        <div className="p-3 bg-gray-100 rounded-lg">
                                            {stat.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Files */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">Tệp gần đây</h2>
                                <button
                                    onClick={() => setActiveTab("files")}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Xem tất cả
                                </button>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {files.slice(0, 5).map(file => (
                                    <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {getFileIcon(file)}
                                            <div>
                                                <p className="font-medium text-gray-900">{file.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(file.uploadedAt).toLocaleDateString()} • {(file.size/1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {file.isPublic ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                          <Globe size={12} /> Công khai
                        </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center gap-1">
                          <Lock size={12} /> Riêng tư
                        </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {files.length === 0 && (
                                    <div className="p-8 text-center text-gray-500">
                                        <FolderOpen className="mx-auto h-12 w-12 text-gray-300" />
                                        <p className="mt-3">Chưa có tệp nào được tải lên</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "files" && (
                    <div className="space-y-6">
                        {/* Filters and Search */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row gap-4 justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm tệp..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="public">Công khai</option>
                                        <option value="private">Riêng tư</option>
                                    </select>

                                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                        >
                                            <Grid size={20} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                        >
                                            <List size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Files List/Grid */}
                        {filteredFiles.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
                                <FileText size={60} className="text-gray-300 mb-4" />
                                <h3 className="text-xl font-medium text-gray-700 mb-2">
                                    {files.length === 0 ? "Chưa có tập tin nào được tải lên" : "Không tìm thấy tệp phù hợp"}
                                </h3>
                                <p className="text-gray-500 text-center max-w-md mb-6">
                                    {files.length === 0
                                        ? "Bắt đầu tải tệp lên để xem chúng được liệt kê ở đây. Bạn có thể tải lên tài liệu, hình ảnh và các tệp khác để chia sẻ và quản lý chúng một cách an toàn."
                                        : "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn."}
                                </p>
                                {files.length === 0 && (
                                    <button
                                        onClick={() => navigate('/upload')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Tải lên tệp
                                    </button>
                                )}
                            </div>
                        ) : viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {filteredFiles.map((file) => (
                                    <FileCard key={file.id} file={file} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên file</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kích thước</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tải lên</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {filteredFiles.map((file) => (
                                        <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {getFileIcon(file)}
                                                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {(file.size/1024).toFixed(1)} KB
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(file.uploadedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {file.isPublic ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1 w-fit">
                              <Globe size={12} /> Công khai
                            </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center gap-1 w-fit">
                              <Lock size={12} /> Riêng tư
                            </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                                                        title="Tải xuống"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    <button
                                                        className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    {file.isPublic && (
                                                        <button
                                                            className="text-gray-500 hover:text-purple-600 transition-colors p-1 rounded hover:bg-purple-50"
                                                            title="Chia sẻ"
                                                        >
                                                            <Copy size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "analytics" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Phân tích</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 border border-gray-200 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-3">Phân loại tệp</h3>
                                <div className="space-y-3">
                                    {['Hình ảnh', 'Tài liệu', 'Âm thanh', 'Video', 'Khác'].map((type, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">{type}</span>
                                            <span className="text-sm font-medium text-gray-900">
                        {files.filter(f => {
                            const ext = f.name.split('.').pop().toLowerCase();
                            if (type === 'Hình ảnh') return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);
                            if (type === 'Tài liệu') return ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext);
                            if (type === 'Âm thanh') return ['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext);
                            if (type === 'Video') return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext);
                            return true;
                        }).length}
                      </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border border-gray-200 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-3">Hoạt động gần đây</h3>
                                <div className="space-y-4">
                                    {files.slice(0, 3).map(file => (
                                        <div key={file.id} className="flex items-start gap-3">
                                            <div className="mt-1">
                                                {getFileIcon(file)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">Tải lên {new Date(file.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, fileId: null })}
                title="Xóa tệp"
                message="Bạn có chắc muốn xoá tệp này? Đây là hành động không thể phục hồi."
                confirmText="Xóa"
                cancelText="Hủy"
                confirmationButtonClass="bg-red-600 hover:bg-red-700"
            />

            {/* Share Link Modal */}
            <LinkShareModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ isOpen: false, fileId: null, link: "" })}
                link={shareModal.link}
                title="Chia sẻ tệp"
            />
        </DashboardLayout>
    );
};

export default Dashboard;