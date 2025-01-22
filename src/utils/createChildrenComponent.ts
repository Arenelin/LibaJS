import {ComponentFn, ComponentInstance, CreateComponentParams} from "../types";
import {propsTheSame} from "./propsTheSame.ts";
import {Liba} from "../LibaJS.ts";

export function createChildrenComponent<P extends object>(
    {
        ComponentFunction,
        props = {} as P,
        parentInstance,
        key
    }: CreateComponentParams<P>): ComponentInstance<P> {

    let alreadyExistedComponentInstance = parentInstance?.childrenComponents?.getItem(ComponentFunction, key)

    if (alreadyExistedComponentInstance) {
        if (alreadyExistedComponentInstance.type &&
            (alreadyExistedComponentInstance.type as ComponentFn<P>) === ComponentFunction) {
            const isSameProps = alreadyExistedComponentInstance.props && propsTheSame(alreadyExistedComponentInstance.props, props);
            if (!isSameProps) {
                alreadyExistedComponentInstance.props = props;
                alreadyExistedComponentInstance.refresh?.();
            }
            if (parentInstance) {
                parentInstance.element.append(alreadyExistedComponentInstance.element)
                return
            }
        } else if (parentInstance && parentInstance.childrenComponents) {
            delete parentInstance.childrenComponents[parentInstance.childrenIndex]
        }
    }
    const childrenInstance = Liba.create({ComponentFunction, props, parentInstance, key})

    if (parentInstance) {
        parentInstance.element.append(childrenInstance.element)
    }
}
