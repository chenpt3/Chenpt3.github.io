// The EventsManager class manages all the events for the application.
export default class EventsManager {
    // The constructor initializes the domManager and screensManager properties and adds the events.
    constructor(screensManager) {
        this.domManager = screensManager.domManager; // The domManager property is used to access the DOM elements.
        this.screensManager = screensManager; // The screensManager property is used to manage the screens.
        this.addEvents(); // Add the events.
    }

    // The addEvents method adds the header, aside, and footer events.
    addEvents() {
        this.addHeaderEvents();
        this.addAsideEvents();
        this.addFooterEvents();
    }

    // The addHeaderEvents method adds the header events.
    addHeaderEvents() {
        this.addMenuToggleEvents(); // Add the menu toggle events.
        this.addThemeToggleEvents(); // Add the theme toggle events.
        this.addHeaderLogoEvent(); // Add the header logo event.
    }

    // The addHeaderLogoEvent method adds a click event to the header logo that creates the home screen.
    addHeaderLogoEvent() {
        const logo = this.domManager.header.logo;
        logo.addEventListener('click', () => {
            this.screensManager.createCurrentScreen('home');
        });
    }

    // The addMenuToggleEvents method adds click events to the left and right menu buttons that toggle the visibility of the aside element.
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

    // The addThemeToggleEvents method adds click events to the sun and moon buttons that toggle the theme.
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

    // The addAsideEvents method adds the aside events.
    addAsideEvents() {
        this.addMenuListEvents(); // Add the menu list events.
        this.addMenuFooterEvent(); // Add the menu footer event.
    }

    // The addMenuListEvents method adds a click event to the menu list that creates the screen for the clicked menu item.
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

    // The addMenuFooterEvent method adds a click event to the menu footer that creates the home screen.
    addMenuFooterEvent() {
        const footerLogo = this.domManager.aside.asideMenuFooter;
        footerLogo.addEventListener('click', () => {
            this.screensManager.createCurrentScreen('home');
        });
    }

    // The addFooterEvents method adds the footer events.
    addFooterEvents() {
        this.addFooterLogoEvent(); // Add the footer logo event.
    }

    // The addFooterLogoEvent method adds a click event to the footer logo that creates the home screen.
    addFooterLogoEvent() {
        const logo = this.domManager.footer.footerLogo;
        logo.addEventListener('click', () => {
            this.screensManager.createCurrentScreen('home');
        });
    }
}