import {CreateHTMLElementProps, HTMLTag} from "../types";

export const createHtmlElement = <T extends HTMLTag>(tagName: T, props: CreateHTMLElementProps): HTMLElementTagNameMap[T] => {
    const element = document.createElement(tagName)

    Object.keys(props).forEach(key => {
        if (key.startsWith('on') && typeof props[key] === 'function') {

            // Extract event name (e.g. 'click' from 'onClick'
            const event = key.slice(2).toLowerCase()
            element.addEventListener(event, props[key])
        } else if (key === 'children' && Array.isArray(props[key])) {
            props[key].forEach((child: HTMLElement | string | number) => {
                if (typeof child === 'string' || typeof child === 'number') {
                    element.append(child.toString())
                } else if (child instanceof HTMLElement) {
                    element.append(child)
                }
            })
        } else if (key in element && typeof (element as any)[key] !== "undefined") {
            // For standard properties
            (element as any)[key] = props[key];
        } else {
            // For attributes
            element.setAttribute(key, props[key]);
        }
    })

    return element
}
