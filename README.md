# WonderWorld - Isometric Chat World

An isometric multiplayer chat world built with Phaser.js 3.8+ and Socket.io, featuring customizable avatars and interactive environments.

## Features

- **Isometric World**: Beautiful isometric perspective with tile-based world
- **Avatar System**: Fully customizable avatars with clothing, hair, and accessories
- **Real-time Chat**: Integrated chat system for player communication
- **Point of Interest**: Interactive objects and buildings in the world
- **Multiplayer Ready**: Socket.io integration for real-time multiplayer (server not included)
- **Click-to-Move**: Intuitive movement system with pathfinding
- **Responsive Design**: Scales to different screen sizes

## Controls

- **Left Click**: Move to location
- **Right Click**: Open avatar customization
- **C Key**: Open avatar customization
- **Enter**: Focus chat input
- **Escape**: Close all panels
- **Mouse Wheel**: Zoom in/out
- **WASD/Arrow Keys**: Alternative movement (if implemented)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── game/
│   ├── Game.js                 # Main game configuration
│   ├── scenes/
│   │   ├── PreloadScene.js     # Asset loading scene
│   │   └── MainScene.js        # Main game scene
│   ├── world/
│   │   └── IsometricWorld.js   # World generation and management
│   ├── entities/
│   │   └── Player.js           # Player avatar and behavior
│   └── managers/
│       ├── InputManager.js     # Input handling
│       └── CameraManager.js    # Camera controls
├── ui/
│   ├── ChatSystem.js           # Chat functionality
│   └── AvatarCustomization.js  # Avatar customization UI
├── network/
│   └── SocketClient.js         # Socket.io client (multiplayer)
├── main.js                     # Application entry point
└── style.css                   # UI styling
```

## Multiplayer Setup

The game includes Socket.io client code but requires a separate server. The client will automatically fall back to offline mode if no server is available.

To set up multiplayer:

1. Create a Socket.io server (not included in this project)
2. Implement the following server events:
   - `joinWorld` - Player joins the world
   - `playerMove` - Player movement
   - `chatMessage` - Chat messages
   - `avatarUpdate` - Avatar customization changes

3. Update the server URL in `src/network/SocketClient.js`

## Customization

### Adding New Clothing Items

1. Add new items to the `clothingData` in `AvatarCustomization.js`
2. Create corresponding sprite assets
3. Update the avatar rendering system in `Player.js`

### Adding New Points of Interest

1. Add POI data to the `createPointsOfInterest()` method in `MainScene.js`
2. Create interaction handlers for new POI types
3. Add corresponding sprite assets

### Extending the World

1. Modify world generation in `IsometricWorld.js`
2. Add new tile types and terrain features
3. Implement collision detection for new elements

## Technologies Used

- **Phaser.js 3.8+**: Game engine
- **Socket.io-client**: Real-time communication
- **Vite**: Build tool and development server
- **ES6 Modules**: Modern JavaScript architecture

## Development

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Future Enhancements

- [ ] Pathfinding for complex navigation
- [ ] Animated avatar sprites
- [ ] Sound effects and background music
- [ ] Private messaging system
- [ ] Player profiles and persistence
- [ ] Mini-games and activities
- [ ] Weather and day/night cycle
- [ ] Mobile touch controls
- [ ] Voice chat integration
Prototype prompt based isometric world based on phaserjs
