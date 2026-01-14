const BASE_URL = import.meta.env.VITE_API_URL;

export const apiEndpoints = {
    FETCH_FILES: `${BASE_URL}/files/my`,
    GET_CREDITS: `${BASE_URL}/users/credits`,
    TOGGLE_FILE: (id) => `${BASE_URL}/files/${id}/toggle-public`,
    DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
    DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,
    VIEW_PUBLIC_FILE: (fileId) => `${BASE_URL}/files/public/${fileId}`,
    UPLOAD_FILE: `${BASE_URL}/files/upload`,
}