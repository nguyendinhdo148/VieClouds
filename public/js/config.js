// Configuration and Constants
// P2P File Transfer Configuration

// Data types for communication
const DataType = {
    FILE_METADATA: 'FILE_METADATA',
    FILE_CHUNK: 'FILE_CHUNK',
    FILE_END: 'FILE_END',
    FILE_ACCEPT: 'FILE_ACCEPT',
    FILE_REJECT: 'FILE_REJECT',
    ROOM_JOIN: 'ROOM_JOIN',
    ROOM_LEAVE: 'ROOM_LEAVE',
    ROOM_MEMBER_LIST: 'ROOM_MEMBER_LIST',
    DEVICE_INFO: 'DEVICE_INFO',
    DEVICE_INFO_UPDATE: 'DEVICE_INFO_UPDATE',
    DISCOVERY_BROADCAST: 'DISCOVERY_BROADCAST',
    DISCOVERY_RESPONSE: 'DISCOVERY_RESPONSE',
    PING: 'PING',
    PONG: 'PONG'
};

// Discovery configuration
const DISCOVERY_INTERVAL = 5000; // 5 seconds
const DEVICE_TIMEOUT = 30000; // 30 seconds

// Connection state management
let reconnectAttempts = 0;
let reconnectTimeout = null;
const MAX_RECONNECT_ATTEMPTS = 10;

// File transfer configuration
const FILE_CHUNK_SIZE = 16384; // 16KB chunks

// PeerJS configuration with enhanced STUN/TURN servers for cross-network
const PEER_CONFIG = {
    // Use public PeerJS server 0.peerjs.com
    host: '0.peerjs.com',
    port: 443,
    secure: true,
    config: {
        iceServers: [
            // Google STUN servers
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            
            // Additional STUN servers for better connectivity
            { urls: 'stun:stun.cloudflare.com:3478' },
            { urls: 'stun:stun.nextcloud.com:443' },
            { urls: 'stun:stun.stunprotocol.org:3478' },
            
            // Free TURN servers (for NAT traversal)
            {
                urls: 'turn:openrelay.metered.ca:80',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            },
            {
                urls: 'turn:openrelay.metered.ca:443',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            },
            {
                urls: 'turn:openrelay.metered.ca:443?transport=tcp',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            }
        ],
        // Enhanced ICE configuration for cross-network
        iceCandidatePoolSize: 10,
        iceTransportPolicy: 'all', // Use all available transport methods
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require'
    },
    debug: 2 // Increase debug logging for troubleshooting
};

// Device info configuration
const getDeviceInfo = () => {
    if (typeof getSystemInfo === 'function') {
        return getSystemInfo();
    }
    return {
        name: getDeviceName(),
        type: getDeviceType(),
        browser: getBrowserInfo()
    };
};

// Export to global scope
window.DataType = DataType;
window.DISCOVERY_INTERVAL = DISCOVERY_INTERVAL;
window.DEVICE_TIMEOUT = DEVICE_TIMEOUT;
window.FILE_CHUNK_SIZE = FILE_CHUNK_SIZE;
window.PEER_CONFIG = PEER_CONFIG;
window.getDeviceInfo = getDeviceInfo;
window.reconnectAttempts = reconnectAttempts;
window.reconnectTimeout = reconnectTimeout;
window.MAX_RECONNECT_ATTEMPTS = MAX_RECONNECT_ATTEMPTS;
