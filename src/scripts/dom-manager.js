import writtenNumber from 'written-number';

export default class DOMManager {
    constructor(assets, body = document.body) {
        this.header = new Header(assets, body);
        this.aside = new Aside(assets, body);
        this.main = new Main(assets, body);
        this.footer = new Footer(assets, body);
    }
}

class Creator {
    _create(tag, parent, className) {
        if (!(parent instanceof Node)) {
            throw new Error('Invalid parent element');
        }
        if (typeof tag !== 'string') {
            throw new Error('Invalid tag name');
        }

        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }

        parent.appendChild(element);
        return element;
    }

    _createMultiple(tag, parent, className, count) {
        for (let i = 1; i < count + 1; i++) {
            this._create(tag, parent, `${className}-${i}`);
        }
        return parent.children;
    }

    _createImage(parent, className, src, alt) {
        const img = this._create('img', parent, className);
        img.src = src;
        img.alt = alt;
        return img;
    }
}

class Header extends Creator {
    constructor(assets, parent) {
        super();
        this.header = this._create('header', parent);
        [this.headerDiv1, this.headerDiv2, this.headerDiv3, this.headerDiv4, this.headerDiv5] = this._createMultiple('div', this.header, 'header__div', 5);
        this.populateSection(assets);
    }

    populateSection(assets) {
        this.leftMenuButton = this.createMenuButtonImg(assets);
        this.logo = this.createLogo(assets);
        [this.sunButton, this.moonButton, this.rightMenuButton] = this.createHeaderButtons(assets);
    }

    createMenuButtonImg(assets) {
        return this._createImage(this.headerDiv1, 'header__button-left-menu header__button', assets.leftMenu, 'Menu Button');
    }

    createLogo(assets) {
        return this._createImage(this.headerDiv3, 'header__logo', assets.logoTextOnly, 'The Grey Tower Logo');
    }

    createHeaderButtons(assets) {
        const buttonImages = ['sun', 'moon', 'rightMenu'];
        const buttonImageElements = [];
        buttonImages.forEach((buttonImage) => {
            const buttonImageElement = this._create('img', this.headerDiv5, `header__button-${buttonImage} header__button`);
            buttonImageElement.src = assets[buttonImage];
            buttonImageElement.alt = `${buttonImage} Button`;
            buttonImageElements.push(buttonImageElement);
        });
        return buttonImageElements;
    }
}

class Aside extends Creator {
    constructor(assets, parent) {
        super();
        this.aside = this._create('aside', parent);
        [this.asideDiv1, this.asideDiv2, this.asideDiv3] = this._createMultiple('div', this.aside, 'aside__div', 3);
        this.populateSection(assets);
    }

    populateSection(assets) {
        this.asideMenuHeading = this.createMenuHeading();
        this.asideMenuList = this.createMenuList();
        this.asideMenuFooter = this.createMenuFooter(assets);
    }

    createMenuHeading() {
        const menuHeading = this._create('h2', this.asideDiv1, 'aside__menu-heading');
        menuHeading.textContent = 'My Projects';
        return menuHeading;
    }

    createMenuList() {
        const menuList = this._create('ul', this.asideDiv2, 'aside__menu-list');
        const menuItems = ['To-Do List', 'Calculator', 'Weather App', 'Connect Four', 'Rock Paper Scissors', 'Chess', 'Checkers', 'Mine Sweeper', 'Tic Tac Toe', '2048'];
        menuItems.forEach((menuItem) => {
            const menuItemElement = this._create('li', menuList, 'aside__menu-item');
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

    createMenuFooter(assets) {
        return this._createImage(this.asideDiv3, 'aside__footer-logo', assets.logoImgTop, 'The Grey Tower Logo');
    }
}

class Main extends Creator {
    constructor(assets, parent) {
        super();
        this.assets = assets;
        this.main = this._create('main', parent);
    }
}

class Footer extends Creator {
    constructor(assets, parent) {
        super();
        this.footer = this._create('footer', parent);
        this.footerDiv1 = this._create('div', this.footer, 'footer__div-1');
        this.populateSection(assets);
    }

    populateSection(assets) {
        this.footerLogo = this.createFooterLogo(assets);
        this.footerText = this.createFooterText();
    }

    createFooterLogo(assets) {
        return this._createImage(this.footerDiv1, 'footer__logo', assets.logoTextOnly, 'The Grey Tower Logo');
    }

    createFooterText() {
        const footerText = this._create('p', this.footerDiv1, 'footer__text');
        footerText.textContent = '© 2024 Gandalf';
        return footerText;
    }
}