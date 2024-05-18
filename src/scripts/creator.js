// The Creator class provides methods to create DOM elements.
export default class Creator {
    // The create method creates a new DOM element with the specified tag name, adds it to the specified parent element, and assigns it the specified class name.
    create(tag, parent, className) {
        // Check if the parent element is a Node.
        if (!(parent instanceof Node)) {
            throw new Error('Invalid parent element');
        }
        // Check if the tag name is a string.
        if (typeof tag !== 'string') {
            throw new Error('Invalid tag name');
        }

        // Create a new DOM element with the specified tag name.
        const element = document.createElement(tag);
        // If a class name is specified, assign it to the DOM element.
        if (className) {
            element.className = className;
        }

        // Add the DOM element to the parent element.
        parent.appendChild(element);
        // Return the DOM element.
        return element;
    }

    // The createMultiple method creates a specified number of DOM elements with the same tag name and parent element.
    // Each DOM element is assigned a class name that is a combination of the specified class name and the DOM element's index.
    createMultiple(tag, parent, className, count) {
        // Create the specified number of DOM elements.
        for (let i = 1; i < count + 1; i++) {
            this.create(tag, parent, `${className}-${i}`);
        }
        // Return the children of the parent element.
        return parent.children;
    }

    // The createImage method creates a new img element, sets its source and alt attributes, and adds it to the specified parent element.
    // The img element is assigned the specified class name.
    createImage(parent, className, src, alt) {
        // Create a new img element and assign it the specified class name.
        const img = this.create('img', parent, className);
        // Set the source and alt attributes of the img element.
        img.src = src;
        img.alt = alt;
        // Return the img element.
        return img;
    }
}