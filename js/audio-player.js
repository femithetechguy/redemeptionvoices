export default class AudioPlayer {
    constructor() {
        this.proxyUrl = 'http://localhost:3000/audio';
        this.playlist = [
            {
                title: "The Power of Faith",
                artist: "Pastor John",
                fileId: "18aYsElBNO1xpoe9dMDiTD9FhhnASNNAa",
                duration: "45:30"
            }
        ];
        
        this.currentTrackIndex = 0;
        this.isLongPress = false;
        this.pressTimer = null;
        this.audio = null;
        this.initialize();
    }

    getGoogleDriveDirectLink(fileId) {
        return `${this.proxyUrl}/${fileId}`;
    }

    initialize() {
        this.audio = new Audio();
        this.audio.preload = 'auto';
        
        // Get DOM elements
        this.playPauseIcon = document.getElementById('playPauseIcon');
        this.trackTitle = document.getElementById('trackTitle');
        this.trackArtist = document.getElementById('trackArtist');
        
        // Add audio event listeners
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        this.audio.addEventListener('ended', () => this.onEnded());
        this.audio.addEventListener('error', (e) => this.onError(e));
        this.audio.addEventListener('loadstart', () => this.onLoadStart());
        this.audio.addEventListener('canplay', () => this.onCanPlay());
        
        this.setupControls();
        this.loadTrack(this.currentTrackIndex);
    }

    onPlay() {
        this.playPauseIcon.name = 'pause';
    }

    onPause() {
        this.playPauseIcon.name = 'play';
    }

    onEnded() {
        this.nextTrack();
    }

    onError(e) {
        console.error('Audio error:', e);
        this.playPauseIcon.name = 'play';
    }

    onLoadStart() {
        // Add loading state if needed
        this.playPauseIcon.name = 'refresh';
    }

    onCanPlay() {
        this.playPauseIcon.name = 'play';
    }

    togglePlay() {
        if (this.audio.readyState < 2) { // HAVE_CURRENT_DATA
            return; // Wait until we have data
        }
        
        if (this.audio.paused) {
            this.audio.play()
                .catch(e => console.error('Playback failed:', e));
        } else {
            this.audio.pause();
        }
    }

    loadTrack(index) {
        const track = this.playlist[index];
        
        // Reset audio element
        this.audio.pause();
        this.audio.currentTime = 0;
        
        // Update source and metadata
        this.audio.src = this.getGoogleDriveDirectLink(track.fileId);
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        
        // Add error handling
        this.audio.onerror = () => {
            console.error('Error loading track:', track.title);
            this.onError(new Error('Failed to load audio'));
        };
        
        // Preload audio
        this.audio.load();
    }

    setupControls() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Play/Pause button
        playPauseBtn.addEventListener('click', () => this.togglePlay());

        // Previous button with long press
        prevBtn.addEventListener('mousedown', (e) => this.handlePrevPress(e));
        prevBtn.addEventListener('touchstart', (e) => this.handlePrevPress(e));
        prevBtn.addEventListener('mouseup', () => this.handlePressRelease('prev'));
        prevBtn.addEventListener('touchend', () => this.handlePressRelease('prev'));

        // Next button with long press
        nextBtn.addEventListener('mousedown', (e) => this.handleNextPress(e));
        nextBtn.addEventListener('touchstart', (e) => this.handleNextPress(e));
        nextBtn.addEventListener('mouseup', () => this.handlePressRelease('next'));
        nextBtn.addEventListener('touchend', () => this.handlePressRelease('next'));
    }

    handlePrevPress(e) {
        e.preventDefault();
        this.isLongPress = false;
        this.pressTimer = setTimeout(() => {
            this.isLongPress = true;
            this.rewind();
        }, 500);
    }

    handleNextPress(e) {
        e.preventDefault();
        this.isLongPress = false;
        this.pressTimer = setTimeout(() => {
            this.isLongPress = true;
            this.fastForward();
        }, 500);
    }

    handlePressRelease(action) {
        clearTimeout(this.pressTimer);
        if (!this.isLongPress) {
            action === 'prev' ? this.previousTrack() : this.nextTrack();
        }
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        if (!this.audio.paused) this.audio.play();
    }

    previousTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        if (!this.audio.paused) this.audio.play();
    }

    fastForward() {
        this.audio.currentTime = Math.min(this.audio.currentTime + 10, this.audio.duration);
    }

    rewind() {
        this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);
    }
}