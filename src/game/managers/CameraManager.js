export class CameraManager {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;
        this.followTarget = null;
        this.setupCamera();
    }

    setupCamera() {
        // Set camera bounds (optional - can be set based on world size)
        // this.camera.setBounds(0, 0, worldWidth, worldHeight);
        
        // Enable camera controls
        this.camera.setZoom(1);
        
        // Smooth camera movement
        this.camera.setLerp(0.1, 0.1);
        
        // Set up mouse wheel zoom
        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.handleZoom(deltaY);
        });
    }

    followPlayer(player) {
        this.followTarget = player;
        this.camera.startFollow(player, true, 0.05, 0.05);
    }

    handleZoom(delta) {
        const zoomFactor = 0.1;
        const minZoom = 0.5;
        const maxZoom = 2.0;
        
        let newZoom = this.camera.zoom;
        
        if (delta > 0) {
            // Zoom out
            newZoom -= zoomFactor;
        } else {
            // Zoom in
            newZoom += zoomFactor;
        }
        
        // Clamp zoom level
        newZoom = Phaser.Math.Clamp(newZoom, minZoom, maxZoom);
        
        this.camera.setZoom(newZoom);
    }

    panTo(x, y, duration = 1000) {
        this.camera.pan(x, y, duration, 'Power2');
    }

    shake(intensity = 0.01, duration = 100) {
        this.camera.shake(duration, intensity);
    }

    flash(color = 0xffffff, duration = 250) {
        this.camera.flash(duration, color >> 16, (color >> 8) & 0xff, color & 0xff);
    }

    fadeIn(duration = 1000, callback = null) {
        this.camera.fadeIn(duration, 0, 0, 0, callback);
    }

    fadeOut(duration = 1000, callback = null) {
        this.camera.fadeOut(duration, 0, 0, 0, callback);
    }

    setZoom(zoom) {
        this.camera.setZoom(zoom);
    }

    getZoom() {
        return this.camera.zoom;
    }
}