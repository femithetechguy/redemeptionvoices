document.addEventListener('DOMContentLoaded', () => {
    // Handle menu items click
    const menuItems = document.querySelectorAll('ion-item[href^="#"]');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const menu = document.querySelector('ion-menu');
            menu.close();
            
            // Navigate to section
            const target = e.target.closest('ion-item').getAttribute('href');
            loadContent(target.substring(1));
        });
    });

    // Check if app is installed
    let deferredPrompt;
    const installButton = document.querySelector('#installButton');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installButton?.classList.remove('hidden');
    });

    // Validate service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }

    // Check online status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    function updateOnlineStatus(event) {
        const condition = navigator.onLine ? 'online' : 'offline';
        const statusElement = document.querySelector('#connectionStatus');
        if (statusElement) {
            statusElement.className = condition;
            statusElement.textContent = condition.toUpperCase();
        }
    }

    // Validate Ionic components
    customElements.whenDefined('ion-app').then(() => {
        console.log('Ionic components loaded');
    });
});

// Content loading function
async function loadContent(section) {
    const contentOutlet = document.querySelector('ion-router-outlet');
    contentOutlet.innerHTML = `
        <ion-content class="fade-in">
            <div class="content-container">
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
            </div>
        </ion-content>
    `;

    try {
        const response = await fetch(`/sections/${section}.html`);
        if (response.ok) {
            const content = await response.text();
            contentOutlet.innerHTML = `
                <ion-content class="fade-in">
                    <div class="content-container">
                        ${content}
                    </div>
                </ion-content>
            `;
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}