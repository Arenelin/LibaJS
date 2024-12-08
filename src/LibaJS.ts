import {
    ComponentFn,
    ComponentInstance,
    ComponentLiba,
    CreateComponentParams,
    Dispatch,
    LocalState, ParentInstance,
    RenderComponentParams,
    RenderLiba,
    SetStateAction
} from "types";


export const Liba = {
    create<P extends object, L extends object>(
        {
            ComponentFunction,
            props = {},
            parentInstance = null
        }: CreateComponentParams<P, L>) {

        const renderLiba: RenderLiba = {
            create<P extends object, L extends object>(ComponentFunction: ComponentFn<P, L>, props = {}) {
                return createChildrenComponent({ComponentFunction, props, parentInstance: componentInstance})
            },
            refresh() {
                cleanComponent(componentInstance)
                renderComponent({ComponentFunction, componentInstance, renderLiba})
            }
        }

        const componentLiba: ComponentLiba = {
            refresh: renderLiba.refresh,
            useState<S>(initialState: S | (() => S)): [LocalState<S>, Dispatch<SetStateAction<S>>] {
                const state: LocalState<S> = {
                    value: typeof initialState === 'function'
                        ? (initialState as () => S)()
                        : initialState
                };

                const setState: Dispatch<SetStateAction<S>> = (newState) => {
                    state.value = typeof newState === 'function'
                        ? (newState as (prevState: S) => S)(state.value)
                        : newState;
                    componentLiba.refresh();
                };

                return [state, setState];
            }
        };

        const componentInstance = ComponentFunction(props as P, {liba: componentLiba})
        componentInstance.type = ComponentFunction
        componentInstance.refresh = componentLiba.refresh

        if (parentInstance) {
            ensureChildren(parentInstance)
            if (parentInstance.childrenComponents && parentInstance.childrenIndex !== undefined) {
                parentInstance.childrenComponents[parentInstance.childrenIndex] = componentInstance
            }
        }

        renderComponent({ComponentFunction, componentInstance, renderLiba})

        return componentInstance
    }
}

function createChildrenComponent<P extends object, L extends object>(
    {
        ComponentFunction,
        props = {},
        parentInstance
    }: CreateComponentParams<P, L>): ComponentInstance<P, L> {

    if (parentInstance) {
        if (parentInstance.childrenIndex === undefined) {
            parentInstance.childrenIndex = -1
        }
        parentInstance.childrenIndex++
        const alreadyExistedComponentInstance = parentInstance.childrenComponents?.[parentInstance?.childrenIndex]

        if (alreadyExistedComponentInstance) {
            if (alreadyExistedComponentInstance.type &&
                (alreadyExistedComponentInstance.type as ComponentFn<P, L>) === ComponentFunction) {
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

function renderComponent<P extends object, L extends object>(
    {
        ComponentFunction,
        componentInstance,
        renderLiba
    }: RenderComponentParams<P, L>) {
    componentInstance.childrenIndex = -1

    ComponentFunction.render({
        element: componentInstance.element,
        props: (componentInstance.props) as P,
        localState: (componentInstance.localState) as L,
        liba: renderLiba
    })
}

function cleanComponent<P extends object, L extends object>(componentInstance: ComponentInstance<P, L>) {
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
