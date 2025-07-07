import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Create loading bar
        this.createLoadingBar();

        // Load placeholder assets (we'll create simple colored rectangles for now)
        this.createPlaceholderAssets();
        
        // Load progress
        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0x646cff);
            this.progressBar.fillRect(this.cameras.main.width / 4, this.cameras.main.height / 2 - 16, (this.cameras.main.width / 2) * value, 32);
        });

        this.load.on('complete', () => {
            this.scene.start('MainScene');
        });
    }

    createLoadingBar() {
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222);
        this.progressBox.fillRect(this.cameras.main.width / 4, this.cameras.main.height / 2 - 16, this.cameras.main.width / 2, 32);

        const loadingText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'Loading...', {
            font: '20px Arial',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);
    }

    createPlaceholderAssets() {
        // Create simple colored rectangles as placeholders for sprites
        
        // Ground tile
        this.add.graphics()
            .fillStyle(0x8B4513)
            .fillRect(0, 0, 64, 32)
            .generateTexture('ground-tile', 64, 32);

        // Grass tile
        this.add.graphics()
            .fillStyle(0x228B22)
            .fillRect(0, 0, 64, 32)
            .generateTexture('grass-tile', 64, 32);

        // Water tile
        this.add.graphics()
            .fillStyle(0x4169E1)
            .fillRect(0, 0, 64, 32)
            .generateTexture('water-tile', 64, 32);

        // Avatar body (simple isometric character shape)
        const avatarGraphics = this.add.graphics();
        avatarGraphics.fillStyle(0xFFDBB3); // Skin color
        avatarGraphics.fillEllipse(16, 8, 16, 12); // Head
        avatarGraphics.fillStyle(0x4169E1); // Shirt color
        avatarGraphics.fillRect(8, 16, 16, 20); // Body
        avatarGraphics.fillStyle(0x000080); // Pants color
        avatarGraphics.fillRect(10, 36, 12, 16); // Legs
        avatarGraphics.generateTexture('avatar-base', 32, 52);
        avatarGraphics.destroy();

        // Point of Interest marker
        this.add.graphics()
            .fillStyle(0xFFD700)
            .fillCircle(16, 16, 12)
            .lineStyle(2, 0xFF6347)
            .strokeCircle(16, 16, 12)
            .generateTexture('poi-marker', 32, 32);

        // Tree (simple isometric tree)
        const treeGraphics = this.add.graphics();
        treeGraphics.fillStyle(0x8B4513); // Trunk
        treeGraphics.fillRect(28, 40, 8, 24);
        treeGraphics.fillStyle(0x228B22); // Leaves
        treeGraphics.fillCircle(32, 32, 20);
        treeGraphics.generateTexture('tree', 64, 64);
        treeGraphics.destroy();

        // Building (simple house)
        const buildingGraphics = this.add.graphics();
        buildingGraphics.fillStyle(0x8B4513); // Walls
        buildingGraphics.fillRect(0, 32, 64, 32);
        buildingGraphics.fillStyle(0xDC143C); // Roof
        buildingGraphics.fillTriangle(32, 0, 0, 32, 64, 32);
        buildingGraphics.generateTexture('building', 64, 64);
        buildingGraphics.destroy();
    }
}