import {CreateHTMLElementProps, HTMLTag} from "../types";
import {createHtmlElement} from "./createHtmlElement.ts";

export const createChildHtmlElement = <T extends HTMLTag>(tagName: T, props: CreateHTMLElementProps, parentElement: any): HTMLElementTagNameMap[T] => {
    const childElement = createHtmlElement(tagName, props)

    if (parentElement) {
        parentElement.element.append(childElement)
    }

    return childElement
}
