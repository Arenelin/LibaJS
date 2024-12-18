import {
    ComponentFn,
    ComponentInstance,
    ComponentLiba,
    CreateComponentParams,
    Dispatch,
    LocalState,
    RenderComponentParams,
    RenderLiba,
    SetStateAction
} from "types";

export const Liba = {
    create<P extends object>(
        {
            ComponentFunction,
            props = {},
        }: CreateComponentParams<P>) {

        const statesWithWrappers: [LocalState<any>, Dispatch<SetStateAction<any>>][] = []

        const renderLiba: RenderLiba = {
            create<P extends object>(ComponentFunction: ComponentFn<P>, props = {}, key?: string | number) {
                return createChildrenComponent({
                    ComponentFunction,
                    props,
                    parentInstance: componentInstance,
                    key
                })
            },
            refresh() {
                cleanComponent(componentInstance)
                renderComponent({
                    ComponentFunction,
                    componentInstance,
                    renderLiba,
                    statesWithWrappers
                })
            }
        }

        const componentLiba: ComponentLiba = {
            refresh: renderLiba.refresh,
            useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
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
                statesWithWrappers.push([state, setState])

                return [state.value, setState];
            }
        };
        const componentInstance = ComponentFunction(props as P, {liba: componentLiba})
        componentInstance.type = ComponentFunction
        componentInstance.props = props as P
        componentInstance.refresh = componentLiba.refresh

        renderComponent({
            ComponentFunction,
            componentInstance,
            renderLiba,
            statesWithWrappers
        })

        return componentInstance
    }
}

function createChildrenComponent<P extends object>(
    {
        ComponentFunction,
        props = {} as P,
        parentInstance,
        key
    }: CreateComponentParams<P>): ComponentInstance<P> {
    const arrayOfStaticInstances: ComponentInstance<P>[] = []
    const arrayOfDynamicInstances: ComponentInstance<P>[] = []
    const INDEX_OF_STATIC_INSTANCES = 0
    const INDEX_OF_DYNAMIC_INSTANCES = 1
    const isRenderedDynamically = key !== undefined

    if (parentInstance && parentInstance?.childrenComponentsOfCurrentRender === undefined) {
        parentInstance.childrenComponentsOfCurrentRender = [arrayOfStaticInstances, arrayOfDynamicInstances]
    }

    if (parentInstance) {
        let alreadyExistedComponentInstance;

        if (isRenderedDynamically) {
            alreadyExistedComponentInstance = parentInstance.childrenComponents?.[INDEX_OF_DYNAMIC_INSTANCES]
                ?.find(cc => cc.key === key)
        } else {
            if (parentInstance.childrenIndex === undefined) {
                parentInstance.childrenIndex = -1
            }
            parentInstance.childrenIndex++
            alreadyExistedComponentInstance = parentInstance.childrenComponents?.[INDEX_OF_STATIC_INSTANCES][parentInstance.childrenIndex]
        }

        if (alreadyExistedComponentInstance) {
            if (alreadyExistedComponentInstance.type &&
                (alreadyExistedComponentInstance.type as ComponentFn<P>) === ComponentFunction) {
                if (alreadyExistedComponentInstance.props && propsTheSame(alreadyExistedComponentInstance.props, props)) {
                    if (isRenderedDynamically) {
                        alreadyExistedComponentInstance.key = key
                        parentInstance.childrenComponentsOfCurrentRender?.[INDEX_OF_DYNAMIC_INSTANCES].push(alreadyExistedComponentInstance)
                    } else if(!isRenderedDynamically && parentInstance.childrenIndex !== undefined && parentInstance.childrenComponentsOfCurrentRender){
                        parentInstance.childrenComponentsOfCurrentRender[INDEX_OF_STATIC_INSTANCES][parentInstance.childrenIndex] = alreadyExistedComponentInstance
                    }
                    return alreadyExistedComponentInstance
                } else {
                    alreadyExistedComponentInstance.props = props
                    alreadyExistedComponentInstance.refresh?.()
                    if (isRenderedDynamically) {
                        alreadyExistedComponentInstance.key = key
                        parentInstance.childrenComponentsOfCurrentRender?.[INDEX_OF_DYNAMIC_INSTANCES].push(alreadyExistedComponentInstance)
                    } else if(!isRenderedDynamically && parentInstance.childrenIndex !== undefined && parentInstance.childrenComponentsOfCurrentRender) {
                        parentInstance.childrenComponentsOfCurrentRender[INDEX_OF_STATIC_INSTANCES][parentInstance.childrenIndex] = alreadyExistedComponentInstance
                    }
                    return alreadyExistedComponentInstance
                }
            } else if (!isRenderedDynamically && parentInstance.childrenIndex) {
                parentInstance.childrenComponentsOfCurrentRender?.[INDEX_OF_STATIC_INSTANCES].splice(parentInstance.childrenIndex, 1)
            }
        }
    }

    const childrenInstance = Liba.create({ComponentFunction, props, parentInstance})
    if (isRenderedDynamically) {
        childrenInstance.key = key
        parentInstance?.childrenComponentsOfCurrentRender?.[INDEX_OF_DYNAMIC_INSTANCES].push(childrenInstance)
    } else if(!isRenderedDynamically && parentInstance && parentInstance.childrenIndex !== undefined && parentInstance.childrenComponentsOfCurrentRender) {
        parentInstance.childrenComponentsOfCurrentRender[INDEX_OF_STATIC_INSTANCES][parentInstance.childrenIndex] = childrenInstance
    }
    return childrenInstance
}

function renderComponent<S, P extends object>(
    {
        ComponentFunction,
        componentInstance,
        renderLiba,
        statesWithWrappers
    }: RenderComponentParams<S, P>) {

    componentInstance.childrenIndex = -1

    ComponentFunction.render({
        element: componentInstance.element,
        props: (componentInstance.props) as P,
        statesWithWrappers: statesWithWrappers.map(swws => [swws[0].value, swws[1]]),
        liba: renderLiba
    })
    componentInstance.childrenComponents = componentInstance.childrenComponentsOfCurrentRender
    componentInstance.childrenComponentsOfCurrentRender = [[], []]
}

function cleanComponent<P extends object>(componentInstance: ComponentInstance<P>) {
    componentInstance.element.innerHTML = ''
    componentInstance.childrenComponents?.forEach(cc => cc.forEach(cc => cc.cleanup?.()))
}

// function ensureChildren(parent: ParentInstance) {
//     if (parent) {
//         if (!parent.childrenComponents) {
//             parent.childrenComponents = []
//         }
//     }
// }

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
