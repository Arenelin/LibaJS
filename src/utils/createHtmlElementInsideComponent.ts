import {CreateHTMLElementProps, HTMLTag} from "../types";

export const createHtmlElementInsideComponent = <T extends HTMLTag>(tagName: T, props: CreateHTMLElementProps): HTMLElementTagNameMap[T] => {
    const childElement = document.createElement(tagName)

    Object.keys(props).forEach(key => {
        if (key.startsWith('on') && typeof props[key] === 'function') {

            // Extract event name (e.g. 'click' from 'onClick'
            const event = key.slice(2).toLowerCase()
            childElement.addEventListener(event, props[key])
        } else if (key === 'children' && Array.isArray(props[key])) {
            props[key].forEach((child: HTMLElement | string | number) => {
                if (typeof child === 'string' || typeof child === 'number') {
                    childElement.append(child.toString())
                } else if (child instanceof HTMLElement) {
                    childElement.append(child)
                }
            })
        } else if (key in childElement && typeof (childElement as any)[key] !== "undefined") {
            // For standard properties
            (childElement as any)[key] = props[key];
        } else {
            // For attributes
            childElement.setAttribute(key, props[key]);
        }
    })

    return childElement
}
