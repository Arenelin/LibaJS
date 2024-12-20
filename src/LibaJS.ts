import {
    ComponentFn,
    ComponentInstance,
    ComponentLiba,
    CreateComponentParams,
    LocalState,
    ParentInstance,
    RenderComponentParams,
    RenderLiba
} from "types";

export const Liba = {
    create<P extends object>(
        {
            ComponentFunction,
            props = {},
        }: CreateComponentParams<P>) {

        const statesWithWrappers: LocalState<any>[] = []

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
            useObservable<S>(initialState: LocalState<S>): LocalState<S> {
                const proxy = createObservableObject(initialState, componentLiba.refresh)
                statesWithWrappers.push(proxy)
                return proxy;
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
    const INDEX_OF_STATIC_INSTANCES = 0
    const INDEX_OF_DYNAMIC_INSTANCES = 1
    const isRenderedDynamically = key !== undefined

    if (parentInstance) {
        ensureChildrenForCurrentRender(parentInstance)

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
                const isSameProps = alreadyExistedComponentInstance.props && propsTheSame(alreadyExistedComponentInstance.props, props);
                if (!isSameProps) {
                    alreadyExistedComponentInstance.props = props;
                    alreadyExistedComponentInstance.refresh?.();
                }
                updateChildrenComponentsArrayForCurrentRender(parentInstance, alreadyExistedComponentInstance, key)
                return alreadyExistedComponentInstance
            } else if (!isRenderedDynamically && parentInstance.childrenIndex !== undefined) {
                parentInstance.childrenComponentsOfCurrentRender?.[INDEX_OF_STATIC_INSTANCES].splice(parentInstance.childrenIndex, 1)
            }
        }
    }

    const childrenInstance = Liba.create({ComponentFunction, props, parentInstance})

    if (parentInstance) {
        updateChildrenComponentsArrayForCurrentRender(parentInstance, childrenInstance, key)
    }
    return childrenInstance
}

function renderComponent<P extends object>(
    {
        ComponentFunction,
        componentInstance,
        renderLiba,
        statesWithWrappers
    }: RenderComponentParams<P>) {

    componentInstance.childrenIndex = -1

    ComponentFunction.render({
        element: componentInstance.element,
        props: (componentInstance.props) as P,
        statesWithWrappers,
        liba: renderLiba
    })
    componentInstance.childrenComponents = componentInstance.childrenComponentsOfCurrentRender
    componentInstance.childrenComponentsOfCurrentRender = [[], []]
}

function cleanComponent<P extends object>(componentInstance: ComponentInstance<P>) {
    if ("innerHTML" in componentInstance.element) {
        componentInstance.element.innerHTML = ''
    }
    componentInstance.childrenComponents?.forEach(cc => cc.forEach(cc => cc.cleanup?.()))
}

function ensureChildrenForCurrentRender(parentInstance: ParentInstance) {
    if (parentInstance) {
        const arrayOfStaticInstances: ComponentInstance[] = []
        const arrayOfDynamicInstances: ComponentInstance[] = []
        if (parentInstance && parentInstance.childrenComponentsOfCurrentRender === undefined) {
            parentInstance.childrenComponentsOfCurrentRender = [arrayOfStaticInstances, arrayOfDynamicInstances]
        }
    }
}

function updateChildrenComponentsArrayForCurrentRender<P extends object>(
    parentInstance: ParentInstance,
    childrenInstance: ComponentInstance<P>,
    key?: string | number) {
    const INDEX_OF_STATIC_INSTANCES = 0
    const INDEX_OF_DYNAMIC_INSTANCES = 1
    const isRenderedDynamically = key !== undefined

    if (parentInstance && parentInstance.childrenIndex !== undefined && parentInstance.childrenComponentsOfCurrentRender) {
        if (isRenderedDynamically) {
            childrenInstance.key = key
            parentInstance.childrenComponentsOfCurrentRender[INDEX_OF_DYNAMIC_INSTANCES].push(childrenInstance)
        } else {
            parentInstance.childrenComponentsOfCurrentRender[INDEX_OF_STATIC_INSTANCES][parentInstance.childrenIndex] = childrenInstance
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

function createObservableObject<S>(dto: LocalState<S>, onSet: () => void) {
    // @ts-ignore
    function createProxy(target) {
        return new Proxy(target, {
            set(obj, prop, value) {
                if (value && typeof value === 'object') {
                    value = createProxy(value);
                }

                if (obj[prop] !== value) {
                    obj[prop] = value;
                    onSet()
                }
                return true;
            },
            get(obj, prop) {
                if (prop in obj) {
                    if (Array.isArray(obj[prop])) {
                        return new Proxy(obj[prop], {
                            set(arr, index, value) {
                                if (value && typeof value === 'object') {
                                    value = createProxy(value);
                                }
                                // @ts-ignore
                                arr[index] = value;
                                onSet()
                                return true;
                            },
                            deleteProperty(arr, index) {
                                // @ts-ignore
                                delete arr[index];
                                onSet()
                                return true;
                            }
                        });
                    }
                    return obj[prop];
                }
                return undefined;
            }
        });
    }

    return createProxy(dto);
}
