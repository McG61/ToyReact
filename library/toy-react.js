let RENDER_TO_DOM = Symbol("Symbol Render");
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        if(name.match(/on([\s\S]+)$/)) {
            typeof name === 'string' && this.root.addEventListener(RegExp.$1.replace(/[\s\S]/, c => c.toLowerCase()), value);
        } else {
            if(name === "className") {
                name = "class";
            }
            this.root.setAttribute(name, value);
        }
    }
    appendChild(component) {
        let range = document.createRange();
        range.setStart(this.root, this.root.childNodes.length);
        range.setEnd(this.root, this.root.childNodes.length);
        component[RENDER_TO_DOM](range);
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

class TextWrapper {
    constructor(text) {
        this.root = document.createTextNode(text);
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

export class Component {
    constructor() {
        this._root = null;
        this.children = [];
        this.props = Object.create(null);
        this._range = null;
    }
    setAttribute(name, value) {
        this.props[name] = value;
    }
    appendChild(component) {
        this.children.push(component);
    }
    [RENDER_TO_DOM](range) {
        this._range = range;
        this.render()[RENDER_TO_DOM](range);
    }
    rerender() {
        let oldRange = this._range;

        let range = document.createRange();
        range.setStart(oldRange.startContainer, oldRange.startOffset);
        range.setEnd(oldRange.startContainer, oldRange.startOffset);
        this[RENDER_TO_DOM](range);

        oldRange.setStart(range.endContainer, range.endOffset);
        oldRange.deleteContents()
    }
    setState(newState) {
        if(this.state === null || typeof this.state !== 'object') {
            this.state = newState;
            this.rerender();
            return;
        }
        let combime = (oldState, newState) => {
            for(let key in newState) {
                if(oldState[key] === null || typeof oldState[key] !== 'object') {
                    oldState[key] = newState[key];
                } else {
                    combime(oldState[key], newState[key]);
                }
            }
        }
        combime(this.state, newState);
        this.rerender();
    }
}

export function createElement(type, attributes, ...children) {
    let element;
    if(typeof type === 'string') {
        element = new ElementWrapper(type);
    } else {
        element = new type;
    }
    for(let props in attributes) {
        element.setAttribute(props, attributes[props]);
    }
    let insertChildren = (children) => {
        for(let child of children) {
            if(typeof child === 'function' || isNaN(child)) {
                throw(new Error(`${isNaN(child) ? 'NaN' : 'Functions'} are not valid as a React child`));
            }
            if(typeof child === 'string' || typeof child === 'number') {
                child = new TextWrapper(child);
            }
            if(child === null) {
                continue;
            }
            if(typeof child === 'object' && child instanceof Array) {
                insertChildren(child);
            } else {
                element.appendChild(child);
            }
        }
    }
    insertChildren(children);
    return element;
}

export function render(component, parentComponent) {
    let range = document.createRange();
    range.setStart(parentComponent, 0);
    range.setEnd(parentComponent, parentComponent.childNodes.length);
    range.setStart(parentComponent, 0);
    range.deleteContents();
    component[RENDER_TO_DOM](range);
}