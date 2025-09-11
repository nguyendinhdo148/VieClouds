import { UploadCloud, X, FileText, Loader2, AlertCircle, CreditCard } from "lucide-react";
import { useCallback, useState } from "react";

const UploadBox = ({
                       files,
                       onFileChange,
                       onUpload,
                       uploading,
                       onRemoveFile,
                       remainingCredits,
                       isUploadDisabled
                   }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
    }, [isDragging]);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        if (isDragging) setIsDragging(false);
    }, [isDragging]);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFiles = Array.from(e.dataTransfer.files);
            if (droppedFiles.length > 0) {
                onFileChange({ target: { files: e.dataTransfer.files } });
            }
        },
        [onFileChange]
    );

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
                    <UploadCloud className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Tải Lên Tệp
                </h2>
                <p className="text-gray-600 text-lg">Tải lên tối đa 5 tệp cùng lúc</p>
            </div>

            {/* Credits Card */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Số Credit Khả Dụng</p>
                            <p className="text-xs text-gray-500">Credit cần thiết để tải lên</p>
                        </div>
                    </div>
                    <span className={`text-2xl font-bold ${remainingCredits === 0 ? 'text-red-600' : 'text-blue-600'}`}>
            {remainingCredits}
          </span>
                </div>
                {remainingCredits === 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-700 font-medium">Bạn cần credit để tải lên tệp</p>
                    </div>
                )}
            </div>

            {/* Drop Zone */}
            <label
                htmlFor="file-upload"
                className={`relative group border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                    isDragging
                        ? 'border-blue-400 bg-blue-50 scale-[1.02] shadow-lg'
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-25'
                } ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ minHeight: '200px' }}
            >
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={onFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading || remainingCredits === 0}
                />

                <div className="space-y-5 flex flex-col items-center justify-center">
                    <div className="relative inline-flex">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                            isDragging ? 'bg-blue-100 scale-110' : 'bg-gray-100 group-hover:bg-blue-100'
                        }`}>
                            <UploadCloud className={`h-10 w-10 transition-colors duration-300 ${
                                isDragging ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                            }`} />
                        </div>
                    </div>

                    <div className="space-y-2 text-center">
                        <p className="text-lg font-semibold text-gray-900">
                            {isDragging ? 'Thả tệp vào đây' : 'Kéo & thả tệp vào đây'}
                        </p>
                        <p className="text-sm text-gray-500">hoặc nhấp để chọn tệp</p>
                    </div>

                    <p className="text-xs text-gray-400 font-medium text-center max-w-md">
                        Hỗ trợ nhiều tệp • Tối đa 5 tệp • Tối đa 5MB mỗi tệp
                    </p>
                </div>
            </label>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Tệp Đã Chọn</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {files.length} tệp{files.length !== 1 ? '' : ''}
            </span>
                    </div>

                    <div className="space-y-3">
                        {files.map((file, index) => (
                            <div
                                key={`${file.name}-${index}-${file.lastModified}`}
                                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 group"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onRemoveFile(index)}
                                    disabled={uploading}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all duration-200 disabled:opacity-30 ml-2"
                                    title="Xóa tệp"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Button */}
            <div className="mt-8">
                <button
                    onClick={onUpload}
                    disabled={isUploadDisabled}
                    className="w-full group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-blue-600 disabled:hover:to-blue-700 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-lg">Đang tải lên...</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="h-5 w-5" />
                            <span className="text-lg">Tải Lên Tệp</span>
                            {files.length > 0 && (
                                <span className="text-blue-200 text-sm font-medium bg-blue-800/20 px-2 py-1 rounded-full ml-2">
                  {files.length} tệp{files.length !== 1 ? '' : ''}
                </span>
                            )}
                        </>
                    )}
                </button>
            </div>

            {/* Warnings */}
            <div className="mt-6 space-y-3">
                {files.length > 0 && remainingCredits > 0 && files.length > remainingCredits && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-amber-900">Không Đủ Credit</p>
                            <p className="text-sm text-amber-700 mt-1">
                                Bạn cần {files.length} credit nhưng chỉ có {remainingCredits} credit khả dụng
                            </p>
                        </div>
                    </div>
                )}

                {files.length > 5 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-red-900">Vượt Quá Số Tệp Tối Đa</p>
                            <p className="text-sm text-red-700 mt-1">
                                Tối đa 5 tệp được phép. Vui lòng xóa {files.length - 5} tệp{files.length - 5 !== 1 ? '' : ''}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadBox;