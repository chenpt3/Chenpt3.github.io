import writtenNumber from 'written-number';

export default class DOMManager {
    constructor(assets, creator ,body = document.body) {
        this.creator = creator;
        this.assets = assets;
        this.header = new Header(assets, creator, body);
        this.aside = new Aside(assets, creator, body);
        this.main = new Main(creator, body);
        this.footer = new Footer(assets, creator, body);
    }
}

class Header {
    constructor(assets, creator, parent) {
        this.header = creator.create('header', parent);
        [this.headerDiv1, this.headerDiv2, this.headerDiv3, this.headerDiv4, this.headerDiv5] = creator.createMultiple('div', this.header, 'header__div', 5);
        this.populateSection(assets, creator);
    }

    populateSection(assets, creator) {
        this.leftMenuButton = this.createMenuButtonImg(assets, creator);
        this.logo = this.createLogo(assets, creator);
        [this.sunButton, this.moonButton, this.rightMenuButton] = this.createHeaderButtons(assets, creator);
    }

    createMenuButtonImg(assets, creator) {
        return creator.createImage(this.headerDiv1, 'header__button-left-menu header__button', assets.leftMenu, 'Menu Button');
    }

    createLogo(assets, creator) {
        return creator.createImage(this.headerDiv3, 'header__logo', assets.logoTextOnly, 'The Grey Tower Logo');
    }

    createHeaderButtons(assets, creator) {
        const buttonImages = ['sun', 'moon', 'rightMenu'];
        const buttonImageElements = [];
        buttonImages.forEach((buttonImage) => {
            const buttonImageElement = creator.create('img', this.headerDiv5, `header__button-${buttonImage} header__button`);
            buttonImageElement.src = assets[buttonImage];
            buttonImageElement.alt = `${buttonImage} Button`;
            buttonImageElements.push(buttonImageElement);
        });
        return buttonImageElements;
    }
}

class Aside {
    constructor(assets, creator, parent) {
        this.aside = creator.create('aside', parent);
        [this.asideDiv1, this.asideDiv2, this.asideDiv3] = creator.createMultiple('div', this.aside, 'aside__div', 3);
        this.populateSection(assets, creator);
    }

    populateSection(assets, creator) {
        this.asideMenuHeading = this.createMenuHeading(creator);
        this.asideMenuList = this.createMenuList(creator);
        this.asideMenuFooter = this.createMenuFooter(assets, creator);
    }

    createMenuHeading(creator) {
        const menuHeading = creator.create('h2', this.asideDiv1, 'aside__menu-heading');
        menuHeading.textContent = 'My Projects';
        return menuHeading;
    }

    createMenuList(creator) {
        const menuList = creator.create('ul', this.asideDiv2, 'aside__menu-list');
        const menuItems = ['To-Do List', 'Calculator', 'Weather App', 'Connect Four', 'Rock Paper Scissors', 'Chess', 'Checkers', 'Mine Sweeper', 'Tic Tac Toe', '2048'];
        menuItems.forEach((menuItem) => {
            const menuItemElement = creator.create('li', menuList, 'aside__menu-item');
            menuItemElement.textContent = menuItem;
    
            let pageName = menuItem.split(' ').map((word, index) => {
                if (!isNaN(word)) {
                    // Remove spaces in the English form of the number and capitalize the first letter of each word except the first one
                    return writtenNumber(word, { noAnd: true }).split(' ').map((word, i) => i !== 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word).join('');
                }
                return word;
            }).join(' ');
    
            pageName = pageName.charAt(0).toLowerCase() + pageName.slice(1).replace(/ /g, '');
    
            pageName = pageName.replace(/[^a-zA-Z0-9 ]/g, '');
    
            menuItemElement.dataset.page = pageName;
        });
        return menuList;
    }

    createMenuFooter(assets, creator) {
        return creator.createImage(this.asideDiv3, 'aside__footer-logo', assets.logoImgTop, 'The Grey Tower Logo');
    }
}

class Main {
    constructor(creator, parent) {
        this.main = creator.create('main', parent);
    }
}

class Footer {
    constructor(assets, creator, parent) {
        this.footer = creator.create('footer', parent);
        this.footerDiv1 = creator.create('div', this.footer, 'footer__div-1');
        this.populateSection(assets, creator);
    }

    populateSection(assets, creator) {
        this.footerLogo = this.createFooterLogo(assets, creator);
        this.footerText = this.createFooterText(creator);
    }

    createFooterLogo(assets, creator) {
        return creator.createImage(this.footerDiv1, 'footer__logo', assets.logoTextOnly, 'The Grey Tower Logo');
    }

    createFooterText(creator) {
        const footerText = creator.create('p', this.footerDiv1, 'footer__text');
        footerText.textContent = '© 2024 Gandalf';
        return footerText;
    }
}