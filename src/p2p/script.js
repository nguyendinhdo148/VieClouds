// Main Application Entry Point
// P2P File Transfer using PeerJS with MDUI interface
// Modern Material Design interface inspired by PairDrop

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 VieCloud Share initializing...');

    // Initialize device info after utils.js is loaded
    if (typeof getSystemInfo === 'function') {
        window.deviceInfo = getSystemInfo();
        console.log('Device info initialized:', window.deviceInfo);

        // Update local device display with initial device name and system info
        if (typeof updateLocalDeviceDisplay === 'function') {
            updateLocalDeviceDisplay();
        }

        // Display detailed system information
        updateSystemInfoDisplay();
    } else {
        console.warn('getSystemInfo function not found');
    }

    // Load saved language first
    loadSavedLanguage();

    // Initialize QR Scanner
    if (typeof initializeQRScanner === 'function') {
        initializeQRScanner();
    }

    // Start device discovery first to get peer ID from server
    // PeerJS will be initialized after receiving peer ID from signaling server
    if (typeof startDeviceDiscovery === 'function') {
        startDeviceDiscovery();
    }

    // Setup all event listeners
    setupEventListeners();

    // Load saved settings after a short delay to ensure MDUI components are initialized
    setTimeout(() => {
        loadSettings();

        // Initialize persistent connections system
        if (typeof initializePersistentConnections === 'function') {
            initializePersistentConnections();
        }
    }, 200);

    // Update UI language after everything is loaded
    setTimeout(() => {
        updateUILanguage();
        // Initialize connected devices display
        if (typeof updateConnectedDevicesDisplay === 'function') {
            updateConnectedDevicesDisplay();
        }
    }, 100);

    // Check for room code in URL
    checkRoomCodeInURL();

    // Check for preselected file in URL
    checkPreselectedFileInURL();

    // Setup cleanup on page unload
    setupCleanup();

    console.log('✅ VieCloud Share initialized successfully');
});

// Load saved settings from localStorage
function loadSettings() {
    // Load device name
    const savedName = localStorage.getItem('device_name');
    if (savedName) {
        const deviceNameInput = document.getElementById('device-name-input');
        if (deviceNameInput) {
            deviceNameInput.value = savedName;
        }

        // Update device info and display
        if (window.deviceInfo) {
            window.deviceInfo.name = savedName;
        }

        // Update local device display
        if (typeof updateLocalDeviceDisplay === 'function') {
            updateLocalDeviceDisplay();
        }
    }

    // Load auto-accept setting
    const autoAccept = localStorage.getItem('auto_accept_files') === 'true';
    const autoAcceptSwitch = document.getElementById('auto-accept-switch');
    if (autoAcceptSwitch) {
        autoAcceptSwitch.checked = autoAccept;
        // For MDUI switches, also set the attribute
        if (autoAccept) {
            autoAcceptSwitch.setAttribute('checked', '');
        } else {
            autoAcceptSwitch.removeAttribute('checked');
        }
        console.log('✅ Auto-accept setting loaded:', autoAccept);
    }

    // Load sound notifications setting (default: true)
    const soundNotifications = localStorage.getItem('sound_notifications');
    const soundSwitch = document.getElementById('sound-notifications-switch');
    if (soundSwitch) {
        const soundEnabled = soundNotifications !== 'false';
        soundSwitch.checked = soundEnabled;
        // For MDUI switches, also set the attribute
        if (soundEnabled) {
            soundSwitch.setAttribute('checked', '');
        } else {
            soundSwitch.removeAttribute('checked');
        }
        console.log('✅ Sound notifications setting loaded:', soundEnabled);
    }




}

// Check for room code in URL parameters
function checkRoomCodeInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    if (roomCode && joinRoomCodeInput) {
        joinRoomCodeInput.value = roomCode;
        showNotification('Room code detected in URL!');
    }
}

// Setup cleanup handlers
function setupCleanup() {
    window.addEventListener('beforeunload', () => {
        console.log('🧹 Cleaning up before page unload...');
        stopDeviceDiscovery();
    });

    // Handle visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('📱 Page hidden, reducing activity...');
        } else {
            console.log('👀 Page visible, resuming activity...');
            // Refresh device discovery when page becomes visible again
            if (isConnected) {
                requestNearbyDevices();
            }
        }
    });
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('💥 Global error:', event.error);
    showNotification('An unexpected error occurred', 'error');
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Unhandled promise rejection:', event.reason);
    showNotification('An unexpected error occurred', 'error');
    event.preventDefault();
});

// Export initialization function for manual initialization if needed
window.initializeApp = () => {
    console.log('🔄 Manual app initialization...');
    loadSavedLanguage();
    initializePeer();
    setupEventListeners();
    loadSettings();
    updateUILanguage();
    checkRoomCodeInURL();
    setupCleanup();
}

// Update system information display
function updateSystemInfoDisplay() {
    const deviceDetailsElement = document.getElementById('device-details');
    if (!deviceDetailsElement) return;

    try {
        const systemInfo = getSystemInfo();

        // Create detailed system information
        const details = [];

        // Browser and OS info
        if (systemInfo.browser) {
            details.push(systemInfo.browser);
        }

        if (systemInfo.os && systemInfo.osVersion) {
            details.push(`${systemInfo.os} ${systemInfo.osVersion}`);
        } else if (systemInfo.os) {
            details.push(systemInfo.os);
        }

        // Hardware info
        if (systemInfo.hardwareConcurrency && systemInfo.hardwareConcurrency !== 'Unknown') {
            details.push(`${systemInfo.hardwareConcurrency} cores`);
        }

        if (systemInfo.memory && systemInfo.memory !== 'Unknown') {
            details.push(`${systemInfo.memory} RAM`);
        }

        // Screen info
        if (systemInfo.screenResolution) {
            details.push(`${systemInfo.screenResolution}`);
        }

        // Network info
        if (systemInfo.connection && systemInfo.connection.effectiveType) {
            details.push(`${systemInfo.connection.effectiveType.toUpperCase()}`);
        }

        // Display the information
        deviceDetailsElement.innerHTML = details.join(' • ');

        // Log detailed system info for debugging
        console.log('📱 System Information:', systemInfo);

    } catch (error) {
        console.error('Error getting system info:', error);
        deviceDetailsElement.innerHTML = 'System info unavailable';
    }
}

// Export initialization function for manual initialization if needed
window.initializeApp = () => {
    console.log('🔄 Manual app initialization...');
    loadSavedLanguage();
    initializePeer();
    setupEventListeners();
    loadSettings();
    updateUILanguage();
    checkRoomCodeInURL();
    setupCleanup();
};

// Export system info function
window.updateSystemInfoDisplay = updateSystemInfoDisplay;

// Check for preselected file in URL parameters
function checkPreselectedFileInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedFileData = urlParams.get('preselectedFile');
    
    if (preselectedFileData) {
        try {
            const fileData = JSON.parse(decodeURIComponent(preselectedFileData));
            console.log('🎯 Preselected file detected:', fileData);
            
            // Wait for file input to be available
            setTimeout(() => {
                createPreselectedFile(fileData);
            }, 1000);
            
            // Remove parameter from URL for cleaner experience
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            
        } catch (error) {
            console.error('❌ Error parsing preselected file data:', error);
        }
    }
}

// Create a virtual file object from preselected file data
async function createPreselectedFile(fileData) {
    try {
        // Show loading indicator
        showNotification(`📁 Đang tải file: ${fileData.name}`, 'info');
        
        // For P2P client, we need to handle authentication differently
        // Since we don't have access to user token in P2P client,
        // we'll need to fetch the file through a different approach
        
        // Check if file is public first, if not we'll need to prompt user for alternative method
        let blob;
        
        try {
            // Try to fetch file directly (this will work for public files)
            const response = await fetch(fileData.downloadUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            blob = await response.blob();
        } catch (error) {
            // If direct fetch fails (likely due to authentication), 
            // we'll show instructions to user
            showFileShareInstructions(fileData);
            return;
        }
        
        // Create File object with proper metadata
        const file = new File([blob], fileData.name, {
            type: fileData.type,
            lastModified: Date.now()
        });
        
        // Add file to the file input (simulate file selection)
        const fileInput = document.getElementById('file-input');
        const fileList = document.getElementById('file-list');
        
        if (fileInput && fileList) {
            // Create DataTransfer to simulate file selection
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            // Đồng bộ selectedFiles toàn cục
            if (typeof updateSelectedFilesFromInput === 'function') {
                updateSelectedFilesFromInput();
            }

            // Trigger file list update
            if (typeof handleFileSelect === 'function') {
                handleFileSelect({ target: { files: [file] } });
            } else if (typeof handleFiles === 'function') {
                handleFiles([file]);
            } else {
                // Fallback: manually update file list display
                updateFileListDisplay([file]);
            }
            
            // Show success notification
            showNotification(`✅ File sẵn sàng: ${fileData.name}`, 'success');
            
            // Scroll to file transfer area
            setTimeout(() => {
                const fileTransferArea = document.getElementById('file-transfer');
                if (fileTransferArea) {
                    fileTransferArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
            
        } else {
            console.error('❌ File input or file list element not found');
        }
        
    } catch (error) {
        console.error('❌ Error loading preselected file:', error);
        showNotification(`❌ Không thể tải file: ${error.message}`, 'error');
    }
}

// Show instructions to user when file can't be auto-loaded
function showFileShareInstructions(fileData) {
    const instructionDialog = createInstructionDialog(fileData);
    document.body.appendChild(instructionDialog);
    instructionDialog.open = true;
}

// Create instruction dialog for manual file selection
function createInstructionDialog(fileData) {
    const dialog = document.createElement('mdui-dialog');
    dialog.headline = 'File Share Instructions';
    dialog.innerHTML = `
        <div style="padding: 0 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <mdui-icon name="info" style="font-size: 3rem; color: #2196f3; margin-bottom: 16px;"></mdui-icon>
                <h3 style="margin: 0 0 16px 0;">Hướng dẫn chia sẻ file</h3>
                <p style="color: #666; margin: 0;">
                    Để chia sẻ file <strong>"${fileData.name}"</strong> qua P2P, 
                    vui lòng làm theo các bước sau:
                </p>
            </div>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="margin-bottom: 16px;">
                    <div style="font-weight: 500; margin-bottom: 8px; color: #2196f3;">
                        📱 Bước 1: Mở VieClouds Dashboard
                    </div>
                    <div style="font-size: 0.9rem; color: #666;">
                        Quay lại tab VieClouds Dashboard và tải file xuống máy
                    </div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <div style="font-weight: 500; margin-bottom: 8px; color: #2196f3;">
                        📁 Bước 2: Chọn file trong P2P
                    </div>
                    <div style="font-size: 0.9rem; color: #666;">
                        Nhấn "Select Files" ở trang này và chọn file vừa tải xuống
                    </div>
                </div>
                
                <div>
                    <div style="font-weight: 500; margin-bottom: 8px; color: #2196f3;">
                        🚀 Bước 3: Gửi file
                    </div>
                    <div style="font-size: 0.9rem; color: #666;">
                        Chọn thiết bị muốn gửi và bắt đầu transfer
                    </div>
                </div>
            </div>
            
            <div style="background: #e3f2fd; padding: 16px; border-radius: 8px;">
                <div style="font-weight: 500; margin-bottom: 8px; color: #1976d2;">💡 Mẹo:</div>
                <div style="font-size: 0.9rem; color: #666;">
                    Để tự động chọn file, hãy đặt file ở chế độ "Công khai" trong Dashboard trước khi chia sẻ P2P.
                </div>
            </div>
        </div>
        <mdui-button slot="action" variant="text" onclick="this.closest('mdui-dialog').open = false; this.closest('mdui-dialog').remove();">
            Đã hiểu
        </mdui-button>
        <mdui-button slot="action" variant="filled" onclick="this.closest('mdui-dialog').open = false; this.closest('mdui-dialog').remove(); document.getElementById('select-files-btn').click();" 
                    style="--mdui-color-primary: #2196f3; background-color: #2196f3; color: white;">
            Chọn File Ngay
        </mdui-button>
    `;
    
    return dialog;
}

// Fallback function to update file list display
function updateFileListDisplay(files) {
    const fileList = document.getElementById('file-list');
    if (!fileList) return;
    
    fileList.innerHTML = '';
    
    for (const file of files) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.style.cssText = `
            display: flex;
            align-items: center;
            padding: 12px;
            background: #f5f5f5;
            border-radius: 8px;
            margin-bottom: 8px;
            gap: 12px;
        `;
        
        fileItem.innerHTML = `
            <mdui-icon name="description" style="color: #2196f3;"></mdui-icon>
            <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">${file.name}</div>
                <div style="font-size: 0.85rem; color: #666;">${formatFileSize(file.size)}</div>
            </div>
            <mdui-chip variant="outlined" style="--mdui-color-primary: #4caf50;">
                <mdui-icon slot="icon" name="check_circle"></mdui-icon>
                Ready
            </mdui-chip>
        `;
        
        fileList.appendChild(fileItem);
    }
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Enhanced notification function
function showNotification(message, type = 'info') {
    const snackbar = document.getElementById('notification-snackbar');
    if (snackbar) {
        // Set message and variant based on type
        snackbar.textContent = message;
        
        // Add appropriate styling based on type
        snackbar.style.setProperty('--mdui-color-primary', 
            type === 'success' ? '#4caf50' : 
            type === 'error' ? '#f44336' : 
            type === 'warning' ? '#ff9800' : '#2196f3'
        );
        
        snackbar.open = true;
        
        // Auto close after 3 seconds
        setTimeout(() => {
            snackbar.open = false;
        }, 3000);
    }
}














