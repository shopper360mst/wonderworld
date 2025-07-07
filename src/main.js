import './style.css'
import { Game } from './game/Game.js'
import { ChatSystem } from './ui/ChatSystem.js'
import { AvatarCustomization } from './ui/AvatarCustomization.js'
import { SocketClient } from './network/SocketClient.js'

class WonderWorld {
    constructor() {
        this.game = null;
        this.chatSystem = null;
        this.avatarCustomization = null;
        this.socketClient = null;
        this.init();
    }

    init() {
        // Initialize the game
        this.game = new Game();
        
        // Make game globally accessible for socket events
        window.game = this.game;
        
        // Initialize UI systems
        this.chatSystem = new ChatSystem();
        this.avatarCustomization = new AvatarCustomization();
        
        // Initialize network client
        this.socketClient = new SocketClient();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Try to connect to server (will fallback to offline mode if server not available)
        this.socketClient.connect();
        
        console.log('WonderWorld initialized!');
    }

    setupEventListeners() {
        // Listen for avatar customization requests
        document.addEventListener('openAvatarCustomization', () => {
            this.avatarCustomization.show();
        });

        // Listen for chat messages to send
        document.addEventListener('sendChatMessage', (event) => {
            if (this.socketClient.isConnected()) {
                this.socketClient.sendChatMessage(event.detail.message);
            }
        });

        // Listen for player movement
        document.addEventListener('playerMove', (event) => {
            if (this.socketClient.isConnected()) {
                this.socketClient.sendPlayerMovement(event.detail.x, event.detail.y);
            }
        });

        // Listen for avatar changes
        document.addEventListener('avatarChanged', (event) => {
            // Update local player avatar
            const mainScene = this.game.getScene('MainScene');
            if (mainScene && mainScene.player) {
                mainScene.player.updateAvatar(event.detail);
            }

            // Send to server if connected
            if (this.socketClient.isConnected()) {
                this.socketClient.sendAvatarUpdate(event.detail);
            }
        });
    }
}

// Start the application
new WonderWorld();
