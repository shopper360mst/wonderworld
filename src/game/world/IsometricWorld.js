export class IsometricWorld {
    constructor(scene) {
        this.scene = scene;
        this.tileWidth = 64;
        this.tileHeight = 32;
        this.worldWidth = 20;
        this.worldHeight = 20;
        this.tiles = [];
    }

    createWorld() {
        // Create a simple isometric world grid
        for (let y = 0; y < this.worldHeight; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.worldWidth; x++) {
                const isoPos = this.cartesianToIsometric(x, y);
                
                // Determine tile type based on position
                let tileType = 'grass-tile';
                if (x === 0 || y === 0 || x === this.worldWidth - 1 || y === this.worldHeight - 1) {
                    tileType = 'ground-tile';
                } else if (x > 5 && x < 8 && y > 5 && y < 8) {
                    tileType = 'water-tile';
                }
                
                const tile = this.scene.add.sprite(
                    isoPos.x + this.scene.cameras.main.width / 2,
                    isoPos.y + this.scene.cameras.main.height / 2,
                    tileType
                );
                
                tile.setOrigin(0.5, 1);
                tile.setData('gridX', x);
                tile.setData('gridY', y);
                
                this.tiles[y][x] = tile;
            }
        }
    }

    cartesianToIsometric(cartX, cartY) {
        const isoX = (cartX - cartY) * (this.tileWidth / 2);
        const isoY = (cartX + cartY) * (this.tileHeight / 2);
        return { x: isoX, y: isoY };
    }

    isometricToCartesian(isoX, isoY) {
        const cartX = (isoX / (this.tileWidth / 2) + isoY / (this.tileHeight / 2)) / 2;
        const cartY = (isoY / (this.tileHeight / 2) - isoX / (this.tileWidth / 2)) / 2;
        return { x: cartX, y: cartY };
    }

    screenToWorld(screenX, screenY) {
        // Convert screen coordinates to world coordinates
        const camera = this.scene.cameras.main;
        const worldX = screenX + camera.scrollX - camera.width / 2;
        const worldY = screenY + camera.scrollY - camera.height / 2;
        
        return this.isometricToCartesian(worldX, worldY);
    }

    worldToScreen(worldX, worldY) {
        // Convert world coordinates to screen coordinates
        const isoPos = this.cartesianToIsometric(worldX, worldY);
        const camera = this.scene.cameras.main;
        
        return {
            x: isoPos.x + camera.width / 2 - camera.scrollX,
            y: isoPos.y + camera.height / 2 - camera.scrollY
        };
    }

    getTileAt(gridX, gridY) {
        if (gridX >= 0 && gridX < this.worldWidth && gridY >= 0 && gridY < this.worldHeight) {
            return this.tiles[gridY][gridX];
        }
        return null;
    }

    isWalkable(gridX, gridY) {
        const tile = this.getTileAt(Math.floor(gridX), Math.floor(gridY));
        if (!tile) return false;
        
        // Water tiles are not walkable
        return tile.texture.key !== 'water-tile';
    }
}