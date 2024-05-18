export default class EventsManager {
    constructor(screensManager) {
        this.domManager = screensManager.domManager;
        this.screensManager = screensManager;
        this.addEvents();
    }

    addEvents() {
        this.addHeaderEvents();
        this.addAsideEvents();
        this.addFooterEvents();
    }

    addHeaderEvents() {
        this.addMenuToggleEvents();
        this.addThemeToggleEvents();
        this.addHeaderLogoEvent();
    }

    addHeaderLogoEvent() {
        const logo = this.domManager.header.logo;
        logo.addEventListener('click', () => {
            this.screensManager.createCurrentScreen('home');
        });
    }

    addMenuToggleEvents() {
        const leftBtn = this.domManager.header.leftMenuButton;
        const rightBtn = this.domManager.header.rightMenuButton;
        const aside = this.domManager.aside.aside;

        leftBtn.addEventListener('click', () => {
            aside.classList.toggle('hidden-menu');
        });

        rightBtn.addEventListener('click', () => {
            aside.classList.toggle('open-mobile-menu');
        });
    }

    addThemeToggleEvents() {
        const sunButton = this.domManager.header.sunButton;
        const moonButton = this.domManager.header.moonButton;
        const body = document.body;

        body.classList.add('dark-theme');
        moonButton.classList.add('hidden');
        sunButton.classList.remove('hidden');

        sunButton.addEventListener('click', () => {
            body.classList.remove('dark-theme');
            sunButton.classList.add('hidden');
            moonButton.classList.remove('hidden');
        });

        moonButton.addEventListener('click', () => {
            body.classList.add('dark-theme');
            moonButton.classList.add('hidden');
            sunButton.classList.remove('hidden');
        });
    }

    addAsideEvents() {
        this.addMenuListEvents();
        this.addMenuFooterEvent();
    }

    addMenuListEvents() {
        const menuList = this.domManager.aside.asideMenuList;
        menuList.addEventListener('click', (e) => {
            const menuItem = e.target;
            const screen = menuItem.dataset.page;
            if (screen) {
                if (this.screensManager.activeScreen) {
                    this.screensManager.clearScreen();
                }
                this.screensManager.createCurrentScreen(screen);
            }
        });
    }

    addMenuFooterEvent() {
        const footerLogo = this.domManager.aside.asideMenuFooter;
        footerLogo.addEventListener('click', () => {
            this.screensManager.createCurrentScreen('home');
        });
    }

    addFooterEvents() {
        this.addFooterLogoEvent();
    }

    addFooterLogoEvent() {
        const logo = this.domManager.footer.footerLogo;
        logo.addEventListener('click', () => {
            this.screensManager.createCurrentScreen('home');
        });
    }
}