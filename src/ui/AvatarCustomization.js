export class AvatarCustomization {
    constructor() {
        this.panel = document.getElementById('avatar-customization');
        this.clothingOptions = document.getElementById('clothing-options');
        this.closeButton = document.getElementById('close-customization');
        
        this.currentAvatar = {
            body: 'avatar-base',
            hair: null,
            shirt: null,
            pants: null,
            accessories: []
        };
        
        this.clothingData = this.generateClothingOptions();
        this.setupEventListeners();
        this.createClothingOptions();
    }

    setupEventListeners() {
        // Close button
        this.closeButton.addEventListener('click', () => {
            this.hide();
        });

        // Listen for open customization event
        document.addEventListener('openAvatarCustomization', () => {
            this.show();
        });

        // Listen for close panels event
        document.addEventListener('closeAllPanels', () => {
            this.hide();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible()) {
                this.hide();
            }
        });
    }

    generateClothingOptions() {
        // Generate placeholder clothing options
        // In a real implementation, these would be loaded from assets
        return {
            hair: [
                { id: 'hair-1', name: 'Short Brown', color: '#8B4513' },
                { id: 'hair-2', name: 'Long Blonde', color: '#FFD700' },
                { id: 'hair-3', name: 'Curly Black', color: '#000000' },
                { id: 'hair-4', name: 'Red Ponytail', color: '#DC143C' }
            ],
            shirts: [
                { id: 'shirt-1', name: 'Blue T-Shirt', color: '#4169E1' },
                { id: 'shirt-2', name: 'Red Hoodie', color: '#DC143C' },
                { id: 'shirt-3', name: 'Green Tank', color: '#228B22' },
                { id: 'shirt-4', name: 'Purple Sweater', color: '#9370DB' }
            ],
            pants: [
                { id: 'pants-1', name: 'Blue Jeans', color: '#000080' },
                { id: 'pants-2', name: 'Black Pants', color: '#000000' },
                { id: 'pants-3', name: 'Brown Shorts', color: '#8B4513' },
                { id: 'pants-4', name: 'Green Cargo', color: '#556B2F' }
            ],
            accessories: [
                { id: 'acc-1', name: 'Baseball Cap', color: '#FF6347' },
                { id: 'acc-2', name: 'Sunglasses', color: '#000000' },
                { id: 'acc-3', name: 'Backpack', color: '#8B4513' },
                { id: 'acc-4', name: 'Watch', color: '#C0C0C0' }
            ]
        };
    }

    createClothingOptions() {
        this.clothingOptions.innerHTML = '';

        // Create sections for each clothing type
        Object.keys(this.clothingData).forEach(category => {
            const section = document.createElement('div');
            section.className = 'clothing-section';
            
            const title = document.createElement('h4');
            title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            title.style.color = '#646cff';
            title.style.marginBottom = '10px';
            section.appendChild(title);

            const optionsGrid = document.createElement('div');
            optionsGrid.className = 'clothing-grid';
            optionsGrid.style.display = 'grid';
            optionsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            optionsGrid.style.gap = '8px';
            optionsGrid.style.marginBottom = '20px';

            // Add "None" option
            const noneOption = this.createClothingOption(category, null, 'None', '#444');
            optionsGrid.appendChild(noneOption);

            // Add clothing options
            this.clothingData[category].forEach(item => {
                const option = this.createClothingOption(category, item.id, item.name, item.color);
                optionsGrid.appendChild(option);
            });

            section.appendChild(optionsGrid);
            this.clothingOptions.appendChild(section);
        });
    }

    createClothingOption(category, itemId, name, color) {
        const option = document.createElement('div');
        option.className = 'clothing-option';
        option.style.backgroundColor = color;
        option.style.width = '50px';
        option.style.height = '50px';
        option.style.border = '2px solid #444';
        option.style.borderRadius = '8px';
        option.style.cursor = 'pointer';
        option.style.display = 'flex';
        option.style.alignItems = 'center';
        option.style.justifyContent = 'center';
        option.style.fontSize = '10px';
        option.style.color = 'white';
        option.style.textAlign = 'center';
        option.style.transition = 'border-color 0.25s';
        option.textContent = name;
        option.title = name;

        // Check if this option is currently selected
        if (this.isOptionSelected(category, itemId)) {
            option.classList.add('selected');
            option.style.borderColor = '#f7df1e';
        }

        // Click handler
        option.addEventListener('click', () => {
            this.selectOption(category, itemId);
            this.updateSelectedOptions();
        });

        // Hover effects
        option.addEventListener('mouseenter', () => {
            if (!option.classList.contains('selected')) {
                option.style.borderColor = '#646cff';
            }
        });

        option.addEventListener('mouseleave', () => {
            if (!option.classList.contains('selected')) {
                option.style.borderColor = '#444';
            }
        });

        return option;
    }

    isOptionSelected(category, itemId) {
        if (category === 'accessories') {
            return this.currentAvatar.accessories.includes(itemId);
        }
        return this.currentAvatar[category] === itemId;
    }

    selectOption(category, itemId) {
        if (category === 'accessories') {
            // Toggle accessories
            const index = this.currentAvatar.accessories.indexOf(itemId);
            if (index > -1) {
                this.currentAvatar.accessories.splice(index, 1);
            } else if (itemId !== null) {
                this.currentAvatar.accessories.push(itemId);
            }
        } else {
            // Set single item
            this.currentAvatar[category] = itemId;
        }

        // Apply changes to player avatar
        this.applyAvatarChanges();
    }

    updateSelectedOptions() {
        // Update visual selection state
        const options = this.clothingOptions.querySelectorAll('.clothing-option');
        options.forEach(option => {
            option.classList.remove('selected');
            option.style.borderColor = '#444';
        });

        // Re-mark selected options
        this.createClothingOptions();
    }

    applyAvatarChanges() {
        // Emit avatar change event
        document.dispatchEvent(new CustomEvent('avatarChanged', {
            detail: { ...this.currentAvatar }
        }));

        // In a real implementation, this would update the player's avatar in the game
        console.log('Avatar updated:', this.currentAvatar);
    }

    show() {
        this.panel.style.display = 'block';
    }

    hide() {
        this.panel.style.display = 'none';
    }

    isVisible() {
        return this.panel.style.display === 'block';
    }

    setCurrentAvatar(avatarData) {
        this.currentAvatar = { ...avatarData };
        this.updateSelectedOptions();
    }

    getCurrentAvatar() {
        return { ...this.currentAvatar };
    }
}