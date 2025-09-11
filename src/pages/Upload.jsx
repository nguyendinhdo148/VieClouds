import DashboardLayout from "../layout/DashboardLayout.jsx";
import { useContext, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext.jsx";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import UploadBox from "../components/UploadBox.jsx";

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUpLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const { getToken } = useAuth();
    const userCreditsContext = useContext(UserCreditsContext);
    const MAX_FILES = 5;

    // Lấy credits từ context
    const credits = userCreditsContext?.credits || 0;
    const setCredits = userCreditsContext?.setCredits;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (files.length + selectedFiles.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType("error");
            return;
        }

        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setMessageType("");
        setMessage("");
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessageType("error");
            setMessage("Please select at least one file to upload");
            return;
        }

        if (files.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
            setMessageType("error");
            return;
        }

        if (files.length > credits) {
            setMessageType("error");
            setMessage("Not enough credits to upload these files");
            return;
        }

        setUpLoading(true);
        setMessage("Uploading files...");
        setMessageType("info");

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        // ⚡ Trừ credits ngay khi bấm upload
        if (setCredits) {
            setCredits((prev) => prev - files.length);
        }

        try {
            const token = await getToken();
            const response = await axios.post(apiEndpoints.UPLOAD_FILE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            // Đồng bộ credits với server (chuẩn xác)
            if (response.data && response.data.remainingCredits !== undefined && setCredits) {
                setCredits(response.data.remainingCredits);
            }

            setMessage("Files uploaded successfully");
            setMessageType("success");
            setFiles([]);
            toast.success("Files uploaded successfully!");
        } catch (error) {
            console.error("Error uploading files: ", error);
            const errorMessage =
                error.response?.data?.message || "Error uploading files. Please try again.";
            toast.error(errorMessage);
            setMessage(errorMessage);
            setMessageType("error");

            // ❌ Nếu lỗi thì rollback credits
            if (setCredits) {
                setCredits((prev) => prev + files.length);
            }
        } finally {
            setUpLoading(false);
        }
    };

    const isUploadDisabled =
        files.length === 0 ||
        files.length > MAX_FILES ||
        credits <= 0 ||
        files.length > credits ||
        uploading;

    return (
        <DashboardLayout activeMenu="Upload">
            <div className="p-6">
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                            messageType === "error"
                                ? "bg-red-50 text-red-700"
                                : messageType === "success"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-blue-50 text-blue-700"
                        }`}
                    >
                        {messageType === "error" && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}

                <UploadBox
                    files={files}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onRemoveFile={handleRemoveFile}
                    remainingCredits={credits}
                    isUploadDisabled={isUploadDisabled}
                />
            </div>
        </DashboardLayout>
    );
};

export default Upload;
