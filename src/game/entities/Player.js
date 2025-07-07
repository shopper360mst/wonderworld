import Phaser from 'phaser';

export class Player extends Phaser.GameObjects.Container {
    constructor(scene, x, y, playerId) {
        super(scene, x, y);
        
        this.scene = scene;
        this.playerId = playerId;
        this.speed = 150;
        this.isMoving = false;
        this.targetX = x;
        this.targetY = y;
        
        // Avatar customization data
        this.avatarData = {
            body: 'avatar-base',
            hair: null,
            shirt: null,
            pants: null,
            accessories: []
        };
        
        // Create avatar sprites
        this.createAvatar();
        
        // Add physics body
        scene.physics.add.existing(this);
        this.body.setSize(24, 12);
        this.body.setOffset(-12, -6);
        
        // Add to scene
        scene.add.existing(this);
        
        // Player name label
        this.nameLabel = scene.add.text(0, -60, playerId, {
            fontSize: '12px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5);
        
        this.add(this.nameLabel);
    }

    createAvatar() {
        // Base avatar sprite
        this.avatarSprite = this.scene.add.sprite(0, 0, this.avatarData.body);
        this.avatarSprite.setOrigin(0.5, 1);
        this.add(this.avatarSprite);
        
        // Additional layers for customization will be added here
        this.clothingLayers = {};
    }

    update(time, delta) {
        if (this.isMoving) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY);
            
            if (distance < 5) {
                // Reached target
                this.isMoving = false;
                this.body.setVelocity(0, 0);
            } else {
                // Move towards target
                const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetX, this.targetY);
                this.body.setVelocity(
                    Math.cos(angle) * this.speed,
                    Math.sin(angle) * this.speed
                );
                
                // Update sprite direction
                this.updateDirection(angle);
            }
        }
    }

    moveTo(x, y) {
        // Convert to isometric world position
        const worldPos = this.scene.world.cartesianToIsometric(x, y);
        this.targetX = worldPos.x + this.scene.cameras.main.width / 2;
        this.targetY = worldPos.y + this.scene.cameras.main.height / 2;
        
        // Check if target position is walkable
        if (this.scene.world.isWalkable(x, y)) {
            this.isMoving = true;
            
            // Emit movement event for multiplayer
            document.dispatchEvent(new CustomEvent('playerMove', {
                detail: {
                    playerId: this.playerId,
                    x: this.targetX,
                    y: this.targetY
                }
            }));
        }
    }

    updateDirection(angle) {
        // Simple 4-direction sprite flipping based on movement angle
        const degrees = Phaser.Math.RadToDeg(angle);
        
        if (degrees > -45 && degrees <= 45) {
            // Moving right
            this.avatarSprite.setFlipX(false);
        } else if (degrees > 45 && degrees <= 135) {
            // Moving down
            this.avatarSprite.setFlipX(false);
        } else if (degrees > 135 || degrees <= -135) {
            // Moving left
            this.avatarSprite.setFlipX(true);
        } else {
            // Moving up
            this.avatarSprite.setFlipX(false);
        }
    }

    updateAvatar(avatarData) {
        this.avatarData = { ...this.avatarData, ...avatarData };
        
        // Remove existing clothing layers
        Object.values(this.clothingLayers).forEach(layer => {
            if (layer) {
                this.remove(layer);
                layer.destroy();
            }
        });
        this.clothingLayers = {};
        
        // Update base avatar
        if (avatarData.body) {
            this.avatarSprite.setTexture(avatarData.body);
        }
        
        // Add clothing layers
        if (avatarData.shirt) {
            this.clothingLayers.shirt = this.scene.add.sprite(0, 0, avatarData.shirt);
            this.clothingLayers.shirt.setOrigin(0.5, 1);
            this.add(this.clothingLayers.shirt);
        }
        
        if (avatarData.pants) {
            this.clothingLayers.pants = this.scene.add.sprite(0, 0, avatarData.pants);
            this.clothingLayers.pants.setOrigin(0.5, 1);
            this.add(this.clothingLayers.pants);
        }
        
        if (avatarData.hair) {
            this.clothingLayers.hair = this.scene.add.sprite(0, -40, avatarData.hair);
            this.clothingLayers.hair.setOrigin(0.5, 1);
            this.add(this.clothingLayers.hair);
        }
        
        // Add accessories
        if (avatarData.accessories && avatarData.accessories.length > 0) {
            avatarData.accessories.forEach((accessory, index) => {
                this.clothingLayers[`accessory_${index}`] = this.scene.add.sprite(0, 0, accessory);
                this.clothingLayers[`accessory_${index}`].setOrigin(0.5, 1);
                this.add(this.clothingLayers[`accessory_${index}`]);
            });
        }
    }

    getAvatarData() {
        return this.avatarData;
    }

    setPlayerName(name) {
        this.nameLabel.setText(name);
    }

    destroy() {
        // Clean up
        if (this.nameLabel) {
            this.nameLabel.destroy();
        }
        
        Object.values(this.clothingLayers).forEach(layer => {
            if (layer) {
                layer.destroy();
            }
        });
        
        super.destroy();
    }
}