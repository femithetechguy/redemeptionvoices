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
            this.setupFeatureCards();

            // Add header title click handler
            window.addEventListener('navigate', (event) => {
                this.handleNavigation(event.detail);
            });
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

    setupFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card[button]');
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                if (section) {
                    this.handleNavigation(`#${section}`);
                }
            });
        });
    }

    handleNavigation(route) {
        // Add home-content to sections array
        const sections = ['home-content', 'messages-content', 'choir-content', 'bible-content', 'prayer-content', 'contact-content', 'about-content', 'testimonies-content'];
        sections.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });

        // Show selected section
        switch(route) {
            case '#home':
            case '':  // Default route
                document.getElementById('home-content').style.display = 'block';
                break;
            case '#messages':
                document.getElementById('messages-content').style.display = 'block';
                break;
            case '#choir':
                document.getElementById('choir-content').style.display = 'block';
                break;
            case '#bible':
                document.getElementById('bible-content').style.display = 'block';
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
            case '#testimonies':
                document.getElementById('testimonies-content').style.display = 'block';
                break;
        }

        // Close menu
        document.querySelector('ion-menu').close();
    }
}

// Initialize app
new App();