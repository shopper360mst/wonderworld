import Phaser from 'phaser';
import { IsometricWorld } from '../world/IsometricWorld.js';
import { Player } from '../entities/Player.js';
import { InputManager } from '../managers/InputManager.js';
import { CameraManager } from '../managers/CameraManager.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.world = null;
        this.player = null;
        this.inputManager = null;
        this.cameraManager = null;
        this.otherPlayers = new Map();
        this.pointsOfInterest = [];
    }

    create() {
        console.log('MainScene created');
        
        // Initialize world
        this.world = new IsometricWorld(this);
        this.world.createWorld();

        // Create player
        this.player = new Player(this, 400, 300, 'player-1');
        
        // Initialize managers
        this.inputManager = new InputManager(this);
        this.cameraManager = new CameraManager(this);
        
        // Set up camera to follow player
        this.cameraManager.followPlayer(this.player);
        
        // Create some points of interest
        this.createPointsOfInterest();
        
        // Set up input handling
        this.setupInputHandling();
        
        // Enable right-click for avatar customization
        this.input.on('pointerdown', (pointer) => {
            if (pointer.rightButtonDown()) {
                document.dispatchEvent(new CustomEvent('openAvatarCustomization'));
            }
        });
    }

    update(time, delta) {
        if (this.player) {
            this.player.update(time, delta);
        }
        
        // Update other players
        this.otherPlayers.forEach(player => {
            player.update(time, delta);
        });
    }

    setupInputHandling() {
        // Handle click-to-move
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                const worldPoint = this.world.screenToWorld(pointer.x, pointer.y);
                if (this.player) {
                    this.player.moveTo(worldPoint.x, worldPoint.y);
                }
            }
        });
    }

    createPointsOfInterest() {
        // Create some interactive points
        const poiData = [
            { x: 200, y: 200, type: 'tree', name: 'Ancient Oak' },
            { x: 600, y: 400, type: 'building', name: 'Town Hall' },
            { x: 800, y: 200, type: 'poi-marker', name: 'Fountain' },
            { x: 300, y: 500, type: 'tree', name: 'Apple Tree' }
        ];

        poiData.forEach(poi => {
            const sprite = this.add.sprite(poi.x, poi.y, poi.type);
            sprite.setInteractive();
            sprite.setData('name', poi.name);
            sprite.setData('type', poi.type);
            
            // Add hover effect
            sprite.on('pointerover', () => {
                sprite.setTint(0xffff00);
                this.showTooltip(poi.name, sprite.x, sprite.y - 50);
            });
            
            sprite.on('pointerout', () => {
                sprite.clearTint();
                this.hideTooltip();
            });
            
            // Add click interaction
            sprite.on('pointerdown', () => {
                this.interactWithPOI(poi);
            });
            
            this.pointsOfInterest.push(sprite);
        });
    }

    interactWithPOI(poi) {
        // Send interaction message to chat
        const message = `You interacted with ${poi.name}`;
        document.dispatchEvent(new CustomEvent('chatMessage', {
            detail: {
                type: 'system',
                message: message,
                timestamp: new Date().toLocaleTimeString()
            }
        }));
    }

    showTooltip(text, x, y) {
        if (this.tooltip) {
            this.tooltip.destroy();
        }
        
        this.tooltip = this.add.text(x, y, text, {
            fontSize: '14px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }

    // Methods for multiplayer (to be implemented with socket.io)
    addOtherPlayer(playerId, x, y, avatarData) {
        const otherPlayer = new Player(this, x, y, playerId);
        otherPlayer.updateAvatar(avatarData);
        this.otherPlayers.set(playerId, otherPlayer);
        return otherPlayer;
    }

    removeOtherPlayer(playerId) {
        const player = this.otherPlayers.get(playerId);
        if (player) {
            player.destroy();
            this.otherPlayers.delete(playerId);
        }
    }

    updateOtherPlayer(playerId, x, y) {
        const player = this.otherPlayers.get(playerId);
        if (player) {
            player.moveTo(x, y);
        }
    }
}