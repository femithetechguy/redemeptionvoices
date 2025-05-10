import AudioPlayer from './audio-player.js';

class App {
    constructor() {
        this.audioPlayer = null;
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupYear();
            this.setupAudio();
            this.setupRouting();
        });
    }

    setupAudio() {
        if (document.getElementById('mainAudio')) {
            this.audioPlayer = new AudioPlayer();
        }
    }

    setupYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    setupRouting() {
        const menuItems = document.querySelectorAll('ion-menu ion-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const href = item.getAttribute('href');
                this.handleNavigation(href);
            });
        });
    }

    handleNavigation(route) {
        // Update sections array to include about-content
        const sections = ['messages-content', 'choir-content', 'bible-content', 'prayer-content', 'contact-content', 'about-content'];
        sections.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });

        // Show selected section
        switch(route) {
            case '#messages':
                document.getElementById('messages-content').style.display = 'block';
                break;
            case '#choir':
                document.getElementById('choir-content').style.display = 'block';
                break;
            case '#bible':
                document.getElementById('bible-content').style.display = 'block';
                // Remove loadBibleContent() call since we're using iframe
                break;
            case '#prayer':
                document.getElementById('prayer-content').style.display = 'block';
                break;
            case '#contact':
                document.getElementById('contact-content').style.display = 'block';
                break;
            case '#about':
                document.getElementById('about-content').style.display = 'block';
                break;
        }

        // Close menu
        document.querySelector('ion-menu').close();
    }
}

// Initialize app
new App();