export default class Creator {
    create(tag, parent, className) {
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

    createMultiple(tag, parent, className, count) {
        for (let i = 1; i < count + 1; i++) {
            this.create(tag, parent, `${className}-${i}`);
        }
        return parent.children;
    }

    createImage(parent, className, src, alt) {
        const img = this.create('img', parent, className);
        img.src = src;
        img.alt = alt;
        return img;
    }
}