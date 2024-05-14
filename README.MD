    constructor(domManager) {
        this.domManager = domManager;
        this.activeScreen = null;
    }

    determineActiveScreen() {

    }

    appendScreenToMain(screen) {
        this.domManager.main.appendChildElement(screen);
    }
}

class HomeScreen {
    constructor() {
        this.name = 'home';
    }

    createHomeScreen() {
        const content = this._create('div', this.main, 'home__screen screen');
        const mainContentHeading = this._create('h1', mainContent, 'home__screen-heading');
        mainContentHeading.textContent = 'Welcome to my Hub!';
        const mainContentParagraph = this._create('p', mainContent, 'home__screen-paragraph');
        mainContentParagraph.textContent = 'This is a simple website that I created to showcase some of my projects. Feel free to check them out!';
    }
}

