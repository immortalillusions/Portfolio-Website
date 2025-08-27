export class LoadingManager {
    constructor() {
        this.loadingSteps = [
            { name: 'Fonts', weight: 30 },
            { name: 'Textures', weight: 40 },
            { name: 'Models', weight: 20 },
            { name: 'Audio', weight: 10 }
        ];
        this.currentProgress = 0;
        this.isComplete = false;
        
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingText = document.getElementById('loading-text');
        this.loadingBar = document.getElementById('loading-bar');
        this.startButtonContainer = document.getElementById('start-button-container');
        this.loadingElements = document.getElementById('loading-elements');
        this.startGameBtn = document.getElementById('start-game-btn');
        this.loadingTitle = document.getElementById('loading-title');
        
        this.setupStartButton();
        this.startTypewriter();
    }
    
    startTypewriter() {
        const text = "Hi, I'm Joanna";
        let index = 0;
        
        const typeChar = () => {
            if (index < text.length) {
                this.loadingTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, 150); // 150ms delay between characters
            }
        };
        
        // Start typing after a small delay
        setTimeout(typeChar, 500);
    }
    
    setupStartButton() {
        if (this.startGameBtn) {
            this.startGameBtn.addEventListener('click', () => {
                this.startLoading();
            });
        }
    }
    
    async startLoading() {
        // Remove the blinking cursor
        if (this.loadingTitle) {
            this.loadingTitle.classList.add('no-cursor');
        }
        
        // Hide start button and show loading elements
        if (this.startButtonContainer) {
            this.startButtonContainer.classList.add('hidden');
        }
        if (this.loadingElements) {
            this.loadingElements.classList.remove("initialHide")
        }
        
        this.updateProgress(0, 'Initializing...');
        
        try {
            // Load fonts first
            await this.loadFonts();
            this.updateProgress(30, 'Loading textures...');
            
            // Small delay to show progress
            await this.delay(200);
            this.updateProgress(70, 'Loading models...');
            
            await this.delay(100);
            this.updateProgress(90, 'Finalizing...');
            
            await this.delay(200);
            this.updateProgress(100, 'Ready!');
            
            // Wait a moment before hiding loading screen
            await this.delay(800);
            
            this.completeLoading();
            
        } catch (error) {
            console.error('Loading failed:', error);
            this.updateProgress(100, 'Loading complete');
            await this.delay(1000);
            this.completeLoading();
        }
    }
    
    async loadFonts() {
        // Check if fonts are already loaded
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
        
        // Double-check that our specific font is loaded
        const fontFace = new FontFace('Press Start 2P', 'url(https://fonts.gstatic.com/s/pressstart2p/v14/e3t4euO8T-267oIAQAu6jDQyK3nVivNm4I81.woff2)');
        
        try {
            await fontFace.load();
            document.fonts.add(fontFace);
        } catch (error) {
            console.warn('Custom font loading failed, using fallback:', error);
        }
        
        // Ensure fonts are applied by waiting for document.fonts.ready
        await document.fonts.ready;
        
        // Force a reflow to ensure fonts are applied
        document.body.offsetHeight;
    }
    
    updateProgress(progress, text) {
        this.currentProgress = Math.min(100, Math.max(0, progress));
        
        if (this.loadingBar) {
            this.loadingBar.style.width = `${this.currentProgress}%`;
        }
        
        if (this.loadingText) {
            this.loadingText.textContent = text;
        }
    }
    
    completeLoading() {
        this.isComplete = true;
        
        // Fade out loading screen
        if (this.loadingScreen) {
            this.loadingScreen.style.transition = 'opacity 0.5s ease-out';
            this.loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                
                // Dispatch custom event to let main.js know loading is complete
                window.dispatchEvent(new CustomEvent('loadingComplete'));
            }, 500);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Static method to wait for loading completion
    static waitForComplete() {
        return new Promise(resolve => {
            window.addEventListener('loadingComplete', resolve, { once: true });
        });
    }
}
