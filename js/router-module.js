export class Router {
    constructor() {
        this.routes = {
            '#home': this.showHome,
            '#messages': this.showMessages,
            '#choir': this.showChoir
        };
        
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('popstate', () => this.handleRoute());
    }

    handleRoute() {
        const hash = window.location.hash || '#home';
        const handler = this.routes[hash];
        
        if (handler) {
            handler.call(this);
        }
    }

    showHome() {
        document.querySelector('ion-router-outlet').style.display = 'block';
        document.getElementById('messages-content').style.display = 'none';
        document.getElementById('choir-content').style.display = 'none';
    }

    showMessages() {
        document.querySelector('ion-router-outlet').style.display = 'none';
        document.getElementById('choir-content').style.display = 'none';
        document.getElementById('messages-content').style.display = 'block';
    }

    showChoir() {
        document.querySelector('ion-router-outlet').style.display = 'none';
        document.getElementById('messages-content').style.display = 'none';
        
        const choirContent = document.getElementById('choir-content');
        choirContent.style.display = 'block';
        
        const iframe = choirContent.querySelector('iframe');
        iframe.src = iframe.src;
    }
}