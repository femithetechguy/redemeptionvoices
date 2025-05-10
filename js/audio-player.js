export class AudioPlayer {
    constructor() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Get DOM elements
        this.audio = document.getElementById('mainAudio');
        this.playPauseIcon = document.getElementById('playPauseIcon');
        
        if (!this.audio || !this.playPauseIcon) {
            console.error('Required audio elements not found');
            return;
        }

        this.pressTimer = null;
        this.isLongPress = false;
        this.initialize();
    }

    initialize() {
        // Query elements after ensuring they exist
        const playPauseBtn = document.querySelector('#playPauseBtn');
        const skipBackBtn = document.querySelector('.player-controls ion-buttons[slot="start"] ion-button');
        const skipForwardBtn = document.querySelector('.player-controls ion-buttons[slot="end"] ion-button');

        if (!playPauseBtn || !skipBackBtn || !skipForwardBtn) {
            console.error('Required control buttons not found');
            return;
        }

        // Add event listeners
        playPauseBtn.addEventListener('click', () => this.togglePlay());

        this.setupSkipControls(skipBackBtn, skipForwardBtn);
        this.setupAudioListeners();
    }

    setupSkipControls(skipBackBtn, skipForwardBtn) {
        const events = ['touchstart', 'mousedown', 'touchend', 'mouseup'];
        
        events.forEach(event => {
            if (event.includes('start') || event.includes('down')) {
                skipBackBtn.addEventListener(event, (e) => this.handleSkipBackPress(e));
                skipForwardBtn.addEventListener(event, (e) => this.handleSkipForwardPress(e));
            } else {
                skipBackBtn.addEventListener(event, (e) => this.handlePressRelease(e, 'back'));
                skipForwardBtn.addEventListener(event, (e) => this.handlePressRelease(e, 'forward'));
            }
        });
    }

    setupAudioListeners() {
        this.audio.addEventListener('play', () => {
            this.playPauseIcon.setAttribute('name', 'pause');
        });

        this.audio.addEventListener('pause', () => {
            this.playPauseIcon.setAttribute('name', 'play');
        });

        this.audio.addEventListener('ended', () => {
            this.playPauseIcon.setAttribute('name', 'play');
        });

        this.audio.addEventListener('error', () => {
            this.playPauseIcon.setAttribute('name', 'play');
            console.error('Audio error:', this.audio.error);
        });
    }

    togglePlay() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    handleSkipBackPress(event) {
        this.isLongPress = false;
        this.pressTimer = setTimeout(() => {
            this.isLongPress = true;
            this.audio.currentTime -= 10;
        }, 500);
    }

    handleSkipForwardPress(event) {
        this.isLongPress = false;
        this.pressTimer = setTimeout(() => {
            this.isLongPress = true;
            this.audio.currentTime += 10;
        }, 500);
    }

    handlePressRelease(event, direction) {
        clearTimeout(this.pressTimer);
        if (!this.isLongPress) {
            const skipAmount = direction === 'back' ? -10 : 10;
            this.audio.currentTime += skipAmount;
        }
    }
}

export default AudioPlayer;