import writtenNumber from 'written-number';

// The DOMManager class is responsible for creating the main sections of the webpage.
export default class DOMManager {
    constructor(assets, creator ,body = document.body) {
        this.creator = creator; // The creator object is used to create DOM elements.
        this.assets = assets; // The assets object contains the sources of the images used in the webpage.
        // The Header, Aside, Main, and Footer classes are used to create the corresponding sections of the webpage.
        this.header = new Header(assets, creator, body);
        this.aside = new Aside(assets, creator, body);
        this.main = new Main(creator, body);
        this.footer = new Footer(assets, creator, body);
    }
}

// The Header class is responsible for creating the header section of the webpage.
class Header {
    constructor(assets, creator, parent) {
        this.header = creator.create('header', parent); // Create the header element.
        // Create five div elements inside the header element.
        [this.headerDiv1, this.headerDiv2, this.headerDiv3, this.headerDiv4, this.headerDiv5] = creator.createMultiple('div', this.header, 'header__div', 5);
        this.populateSection(assets, creator); // Populate the header section with content.
    }

    // This method populates the header section with content.
    populateSection(assets, creator) {
        this.leftMenuButton = this.createMenuButtonImg(assets, creator); // Create the left menu button.
        this.logo = this.createLogo(assets, creator); // Create the logo.
        // Create the sun, moon, and right menu buttons.
        [this.sunButton, this.moonButton, this.rightMenuButton] = this.createHeaderButtons(assets, creator);
    }

    // This method creates the left menu button.
    createMenuButtonImg(assets, creator) {
        return creator.createImage(this.headerDiv1, 'header__button-left-menu header__button', assets.leftMenu, 'Menu Button');
    }

    // This method creates the logo.
    createLogo(assets, creator) {
        return creator.createImage(this.headerDiv3, 'header__logo', assets.logoTextOnly, 'The Grey Tower Logo');
    }

    // This method creates the sun, moon, and right menu buttons.
    createHeaderButtons(assets, creator) {
        const buttonImages = ['sun', 'moon', 'rightMenu']; // The names of the button images.
        const buttonImageElements = []; // An array to store the button image elements.
        buttonImages.forEach((buttonImage) => {
            // Create an img element for each button image.
            const buttonImageElement = creator.create('img', this.headerDiv5, `header__button-${buttonImage} header__button`);
            buttonImageElement.src = assets[buttonImage]; // Set the source of the img element.
            buttonImageElement.alt = `${buttonImage} Button`; // Set the alt text of the img element.
            buttonImageElements.push(buttonImageElement); // Add the img element to the array.
        });
        return buttonImageElements; // Return the array of button image elements.
    }
}

// The Aside class is responsible for creating the aside section of the webpage.
class Aside {
    constructor(assets, creator, parent) {
        this.aside = creator.create('aside', parent); // Create the aside element.
        // Create three div elements inside the aside element.
        [this.asideDiv1, this.asideDiv2, this.asideDiv3] = creator.createMultiple('div', this.aside, 'aside__div', 3);
        this.populateSection(assets, creator); // Populate the aside section with content.
    }

    // This method populates the aside section with content.
    populateSection(assets, creator) {
        this.asideMenuHeading = this.createMenuHeading(creator); // Create the menu heading.
        this.asideMenuList = this.createMenuList(creator); // Create the menu list.
        this.asideMenuFooter = this.createMenuFooter(assets, creator); // Create the menu footer.
    }

    // This method creates the menu heading.
    createMenuHeading(creator) {
        const menuHeading = creator.create('h2', this.asideDiv1, 'aside__menu-heading');
        menuHeading.textContent = 'My Projects'; // Set the text content of the menu heading.
        return menuHeading;
    }

    // This method creates the menu list.
    createMenuList(creator) {
        const menuList = creator.create('ul', this.asideDiv2, 'aside__menu-list'); // Create the menu list element.
        const menuItems = ['To-Do List', 'Calculator', 'Weather App', 'Connect Four', 'Rock Paper Scissors', 'Chess', 'Checkers', 'Mine Sweeper', 'Tic Tac Toe', '2048'];
        menuItems.forEach((menuItem) => {
            const menuItemElement = creator.create('li', menuList, 'aside__menu-item'); // Create a menu item element for each menu item.
            menuItemElement.textContent = menuItem; // Set the text content of the menu item element.
            // Convert the menu item to a page name and set it as the data-page attribute of the menu item element.
            menuItemElement.dataset.page = this.convertMenuItemToPageName(menuItem);
        });
        return menuList;
    }

    // This method converts a menu item to a page name.
    convertMenuItemToPageName(menuItem) {
        let pageName = menuItem.split(' ').map((word, index) => {
            if (!isNaN(word)) {
                // If the word is a number, convert it to its English form, remove spaces, and capitalize the first letter of each word except the first one.
                return writtenNumber(word, { noAnd: true }).split(' ').map((word, i) => i !== 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word).join('');
            }
            return word;
        }).join(' ');
        pageName = pageName.charAt(0).toLowerCase() + pageName.slice(1).replace(/ /g, ''); // Convert the first letter to lowercase and remove spaces.
        pageName = pageName.replace(/[^a-zA-Z0-9 ]/g, ''); // Remove non-alphanumeric characters.
        return pageName;
    }

    // This method creates the menu footer.
    createMenuFooter(assets, creator) {
        return creator.createImage(this.asideDiv3, 'aside__footer-logo', assets.logoImgTop, 'The Grey Tower Logo');
    }
}

// The Main class is responsible for creating the main section of the webpage.
class Main {
    constructor(creator, parent) {
        this.main = creator.create('main', parent); // Create the main element.
    }
}

// The Footer class is responsible for creating the footer section of the webpage.
class Footer {
    constructor(assets, creator, parent) {
        this.footer = creator.create('footer', parent); // Create the footer element.
        this.footerDiv1 = creator.create('div', this.footer, 'footer__div-1'); // Create a div element inside the footer element.
        this.populateSection(assets, creator); // Populate the footer section with content.
    }

    // This method populates the footer section with content.
    populateSection(assets, creator) {
        this.footerLogo = this.createFooterLogo(assets, creator); // Create the footer logo.
        this.footerText = this.createFooterText(creator); // Create the footer text.
    }

    // This method creates the footer logo.
    createFooterLogo(assets, creator) {
        // Create an img element for the logo, set its source and alt text, and return it.
        return creator.createImage(this.footerDiv1, 'footer__logo', assets.logoTextOnly, 'The Grey Tower Logo');
    }

    // This method creates the footer text.
    createFooterText(creator) {
        const footerText = creator.create('p', this.footerDiv1, 'footer__text'); // Create a p element for the text.
        footerText.textContent = '© 2024 Gandalf'; // Set the text content of the p element.
        return footerText; // Return the p element.
    }
}