import {ComponentInstance} from "../types";

export function cleanComponent<P extends object>(componentInstance: ComponentInstance<P>) {
    if (componentInstance.element && "innerHTML" in componentInstance.element) {
        componentInstance.element.innerHTML = ''
    }

    if (componentInstance.childrenComponents) {
        for (let cc of componentInstance.childrenComponents) {
            cc.cleanup?.()
        }
    }
}
