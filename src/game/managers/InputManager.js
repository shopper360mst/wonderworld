export class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.keys = {};
        this.setupKeyboard();
    }

    setupKeyboard() {
        // Create cursor keys
        this.keys.cursors = this.scene.input.keyboard.createCursorKeys();
        
        // Create WASD keys
        this.keys.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        // Chat key (Enter)
        this.keys.ENTER = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keys.ENTER.on('down', () => {
            this.focusChatInput();
        });
        
        // Avatar customization key (C)
        this.keys.C = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keys.C.on('down', () => {
            document.dispatchEvent(new CustomEvent('openAvatarCustomization'));
        });
        
        // Escape key
        this.keys.ESC = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keys.ESC.on('down', () => {
            document.dispatchEvent(new CustomEvent('closeAllPanels'));
        });
    }

    focusChatInput() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.focus();
        }
    }

    isMovementKeyPressed() {
        return this.keys.cursors.left.isDown || 
               this.keys.cursors.right.isDown || 
               this.keys.cursors.up.isDown || 
               this.keys.cursors.down.isDown ||
               this.keys.W.isDown || 
               this.keys.A.isDown || 
               this.keys.S.isDown || 
               this.keys.D.isDown;
    }

    getMovementDirection() {
        let x = 0;
        let y = 0;

        if (this.keys.cursors.left.isDown || this.keys.A.isDown) {
            x = -1;
        } else if (this.keys.cursors.right.isDown || this.keys.D.isDown) {
            x = 1;
        }

        if (this.keys.cursors.up.isDown || this.keys.W.isDown) {
            y = -1;
        } else if (this.keys.cursors.down.isDown || this.keys.S.isDown) {
            y = 1;
        }

        return { x, y };
    }
}