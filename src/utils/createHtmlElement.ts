import {CreateHTMLElementProps, HTMLTag} from "../types";

export const createHtmlElement = <T extends HTMLTag>(tagName: T, props: CreateHTMLElementProps): HTMLElementTagNameMap[T] => {
    const htmlElement = document.createElement(tagName)

    Object.keys(props).forEach(key => {
        if (key.startsWith('on') && typeof props[key] === 'function') {

            // Extract event name (e.g. 'click' from 'onClick'
            const event = key.slice(2).toLowerCase()
            htmlElement.addEventListener(event, props[key])
        } else if (key === 'children' && Array.isArray(props[key])) {
            props[key].forEach((child: HTMLElement | string | number) => {
                if (typeof child === 'string' || typeof child === 'number') {
                    htmlElement.append(child.toString())
                } else if (child instanceof HTMLElement) {
                    htmlElement.append(child)
                }
            })
        } else if (key in htmlElement && typeof (htmlElement as any)[key] !== "undefined") {
            // For standard properties
            (htmlElement as any)[key] = props[key];
        } else {
            // For attributes
            htmlElement.setAttribute(key, props[key]);
        }
    })

    return htmlElement
}
