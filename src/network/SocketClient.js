import { io } from 'socket.io-client';

export class SocketClient {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.playerId = null;
        this.playerData = {
            username: 'Player' + Math.floor(Math.random() * 1000),
            x: 400,
            y: 300,
            avatar: {
                body: 'avatar-base',
                hair: null,
                shirt: null,
                pants: null,
                accessories: []
            }
        };
    }

    connect(serverUrl = 'http://localhost:3001') {
        try {
            this.socket = io(serverUrl, {
                autoConnect: false,
                timeout: 5000
            });

            this.setupEventListeners();
            this.socket.connect();
            
            console.log('Attempting to connect to server...');
        } catch (error) {
            console.log('Socket.io server not available, running in offline mode');
            this.setupOfflineMode();
        }
    }

    setupEventListeners() {
        // Connection events
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.connected = true;
            this.joinWorld();
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.log('Connection error:', error.message);
            this.setupOfflineMode();
        });

        // Game events
        this.socket.on('playerJoined', (data) => {
            this.handlePlayerJoined(data);
        });

        this.socket.on('playerLeft', (data) => {
            this.handlePlayerLeft(data);
        });

        this.socket.on('playerMoved', (data) => {
            this.handlePlayerMoved(data);
        });

        this.socket.on('playerAvatarChanged', (data) => {
            this.handlePlayerAvatarChanged(data);
        });

        this.socket.on('chatMessage', (data) => {
            this.handleChatMessage(data);
        });

        this.socket.on('worldState', (data) => {
            this.handleWorldState(data);
        });
    }

    setupOfflineMode() {
        console.log('Running in offline mode');
        this.connected = false;
        
        // Set up local event listeners for offline functionality
        this.setupLocalEventListeners();
    }

    setupLocalEventListeners() {
        // Listen for local events and handle them without server
        document.addEventListener('sendChatMessage', (event) => {
            // In offline mode, just echo the message back
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('chatMessage', {
                    detail: {
                        type: 'system',
                        message: 'You are in offline mode. Messages will not be sent to other players.',
                        timestamp: new Date().toLocaleTimeString()
                    }
                }));
            }, 100);
        });

        document.addEventListener('playerMove', (event) => {
            // In offline mode, movement is handled locally
            console.log('Player moved (offline):', event.detail);
        });

        document.addEventListener('avatarChanged', (event) => {
            // In offline mode, avatar changes are handled locally
            console.log('Avatar changed (offline):', event.detail);
        });
    }

    joinWorld() {
        if (this.connected && this.socket) {
            this.socket.emit('joinWorld', this.playerData);
        }
    }

    sendChatMessage(message) {
        if (this.connected && this.socket) {
            this.socket.emit('chatMessage', {
                playerId: this.playerId,
                message: message,
                timestamp: new Date().toISOString()
            });
        }
    }

    sendPlayerMovement(x, y) {
        if (this.connected && this.socket) {
            this.socket.emit('playerMove', {
                playerId: this.playerId,
                x: x,
                y: y,
                timestamp: new Date().toISOString()
            });
        }
    }

    sendAvatarUpdate(avatarData) {
        if (this.connected && this.socket) {
            this.socket.emit('avatarUpdate', {
                playerId: this.playerId,
                avatar: avatarData,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Event handlers
    handlePlayerJoined(data) {
        console.log('Player joined:', data);
        
        // Add player to game world
        const mainScene = window.game?.getScene('MainScene');
        if (mainScene) {
            mainScene.addOtherPlayer(data.playerId, data.x, data.y, data.avatar);
        }

        // Add chat message
        document.dispatchEvent(new CustomEvent('chatMessage', {
            detail: {
                type: 'system',
                message: `${data.username} joined the world`,
                timestamp: new Date().toLocaleTimeString()
            }
        }));
    }

    handlePlayerLeft(data) {
        console.log('Player left:', data);
        
        // Remove player from game world
        const mainScene = window.game?.getScene('MainScene');
        if (mainScene) {
            mainScene.removeOtherPlayer(data.playerId);
        }

        // Add chat message
        document.dispatchEvent(new CustomEvent('chatMessage', {
            detail: {
                type: 'system',
                message: `${data.username} left the world`,
                timestamp: new Date().toLocaleTimeString()
            }
        }));
    }

    handlePlayerMoved(data) {
        // Update other player position
        const mainScene = window.game?.getScene('MainScene');
        if (mainScene) {
            mainScene.updateOtherPlayer(data.playerId, data.x, data.y);
        }
    }

    handlePlayerAvatarChanged(data) {
        // Update other player avatar
        const mainScene = window.game?.getScene('MainScene');
        if (mainScene) {
            const player = mainScene.otherPlayers.get(data.playerId);
            if (player) {
                player.updateAvatar(data.avatar);
            }
        }
    }

    handleChatMessage(data) {
        // Display chat message
        document.dispatchEvent(new CustomEvent('chatMessage', {
            detail: {
                type: 'player',
                username: data.username,
                message: data.message,
                timestamp: new Date(data.timestamp).toLocaleTimeString(),
                playerId: data.playerId
            }
        }));
    }

    handleWorldState(data) {
        console.log('World state received:', data);
        // Initialize world with existing players
        const mainScene = window.game?.getScene('MainScene');
        if (mainScene) {
            data.players.forEach(player => {
                if (player.playerId !== this.playerId) {
                    mainScene.addOtherPlayer(player.playerId, player.x, player.y, player.avatar);
                }
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    isConnected() {
        return this.connected;
    }

    setPlayerId(playerId) {
        this.playerId = playerId;
    }

    setPlayerData(data) {
        this.playerData = { ...this.playerData, ...data };
    }
}