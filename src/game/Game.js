import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';

export class Game {
    constructor() {
        this.config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'game-container',
            backgroundColor: '#2c3e50',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [PreloadScene, MainScene],
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };

        this.phaserGame = new Phaser.Game(this.config);
        this.setupResizeHandler();
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.phaserGame.scale.resize(window.innerWidth, window.innerHeight);
        });
    }

    getScene(key) {
        return this.phaserGame.scene.getScene(key);
    }
}