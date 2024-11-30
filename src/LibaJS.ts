import {
    ComponentFunction,
    ComponentInstance,
    ComponentLiba,
    CreateComponentParams,
    ParentInstance,
    RenderComponentParams,
    RenderLiba
} from "./types";


export const Liba = {
    create<L extends object, P extends object>(
        {
            ComponentFunction,
            props = {},
            parentInstance = null
        }: CreateComponentParams<L, P>) {

        const renderLiba: RenderLiba = {
            create<L extends object, P extends object>(ComponentFunction: ComponentFunction<L, P>, props = {}) {
                return createChildrenComponent({ComponentFunction, props, parentInstance: componentInstance})
            },
            refresh() {
                cleanComponent(componentInstance)
                renderComponent({ComponentFunction, componentInstance, renderLiba})
            }
        }

        const componentLiba: ComponentLiba = {
            refresh: () => {
                cleanComponent(componentInstance)
            }
        }

        const componentInstance = ComponentFunction({liba: componentLiba}, props as P)
        componentInstance.type = ComponentFunction
        componentInstance.refresh = componentLiba.refresh

        if (parentInstance) {
            ensureChildren(parentInstance)
            if (parentInstance.childrenComponents && parentInstance.childrenIndex) {
                parentInstance.childrenComponents[parentInstance.childrenIndex] = componentInstance
            }
        }

        renderComponent({ComponentFunction, componentInstance, renderLiba})

        return componentInstance
    }
}

function createChildrenComponent<L extends object, P extends object>(
    {
        ComponentFunction,
        props = {},
        parentInstance
    }: CreateComponentParams<L, P>): ComponentInstance<L, P> {

    if (parentInstance) {
        if (!parentInstance.childrenIndex) {
            parentInstance.childrenIndex = -1
        }
        parentInstance.childrenIndex++
        const alreadyExistedComponentInstance = parentInstance.childrenComponents?.[parentInstance?.childrenIndex]

        if (alreadyExistedComponentInstance) {
            if (alreadyExistedComponentInstance.type &&
                (alreadyExistedComponentInstance.type as ComponentFunction<L, P>) === ComponentFunction) {
                if (alreadyExistedComponentInstance.props && propsTheSame(alreadyExistedComponentInstance.props, props)) {
                    return alreadyExistedComponentInstance
                } else {
                    alreadyExistedComponentInstance.props = props
                    alreadyExistedComponentInstance.refresh?.()
                    return alreadyExistedComponentInstance
                }
            } else {
                parentInstance.childrenComponents?.splice(parentInstance.childrenIndex, 1)
            }
        }
    }

    return Liba.create({ComponentFunction, props, parentInstance})
}

function renderComponent<L extends object, P extends object>(
    {
        ComponentFunction,
        componentInstance,
        renderLiba
    }: RenderComponentParams<L, P>) {
    componentInstance.childrenIndex = -1

    ComponentFunction.render({
        element: componentInstance.element,
        localState: (componentInstance.localState) as L,
        props: (componentInstance.props) as P,
        liba: renderLiba
    })
}

function cleanComponent<L extends object, P extends object>(componentInstance: ComponentInstance<L, P>) {
    componentInstance.element.innerHTML = ''
    componentInstance.childrenComponents?.forEach(cc => cc.cleanup?.())
}

function ensureChildren(parent: ParentInstance) {
    if (parent) {
        if (!parent.childrenComponents) {
            parent.childrenComponents = []
        }
    }
}

function propsTheSame(prevProps: Record<string, any>, newProps: Record<string, any>) {
    if (prevProps === newProps) {
        return true
    }

    if ((prevProps == null && newProps != null) || (prevProps != null && newProps == null)) {
        return false
    }

    const prevKeys = Object.keys(prevProps || {})
    const newKeys = Object.keys(newProps || {})
    if (prevKeys.length !== newKeys.length) {
        return false
    }

    for (let key of prevKeys) {
        if (prevProps[key] !== newProps[key]) {
            return false
        }
    }
    return true
}
