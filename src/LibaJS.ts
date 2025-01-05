import {
    ComponentFn,
    ComponentInstance,
    ComponentLiba,
    CreateComponentParams, Dispatch, Effect,
    LocalState,
    ParentInstance,
    RenderComponentParams,
    RenderLiba, SetStateAction, SignalUpdateMethod
} from "types";

let currentEffect: Effect = null;

export const Liba = {
    create<P extends object>(
        {
            ComponentFunction,
            props = {},
        }: CreateComponentParams<P>) {

        const proxyWithWrappers: LocalState<any>[] = []
        const statesWithWrappers: [LocalState<any>, Dispatch<SetStateAction<any>>][] = []
        const signals: any[] = []

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
                    statesWithWrappers,
                    proxyWithWrappers,
                    signals
                })
            }
        }

        const componentLiba: ComponentLiba = {
            refresh: renderLiba.refresh,
            signal<V>(initialState: V): () => V {
                let currentValue: V = initialState;
                const effectSubscribers = new Set<() => void>()

                const signalFunction = (): V => {
                    if (currentEffect !== null) {
                        effectSubscribers.add(currentEffect)
                    }
                    return currentValue
                }

                signalFunction.set = (newValue: V) => {
                    currentValue = newValue
                    effectSubscribers.forEach(s => setTimeout(s, 0))
                    componentLiba.refresh()
                }

                signalFunction.update = (fn: SignalUpdateMethod<V>) => {
                    currentValue = fn(currentValue)
                    effectSubscribers.forEach(s => setTimeout(s, 0))
                    componentLiba.refresh()
                }
                signals.push(signalFunction)
                return signalFunction
            },
            computed<V>(fn: () => V): () => V {
                return () => fn()
            },
            effect: (fn: () => void) => {
                const effectWrapper = () => {
                    currentEffect = fn
                    fn()
                    currentEffect = null
                }
                setTimeout(effectWrapper, 0)
            },
            useState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
                const state: LocalState<T> = {
                    value: typeof initialState === 'function'
                        ? (initialState as () => T)()
                        : initialState
                };
                const setState: Dispatch<SetStateAction<T>> = (newState) => {
                    state.value = typeof newState === 'function'
                        ? (newState as (prevState: T) => T)(state.value)
                        : newState;
                    componentLiba.refresh();
                };
                statesWithWrappers.push([state, setState])
                return [state.value, setState]
            },
            useObservable<S>(initialState: LocalState<S>): LocalState<S> {
                const proxy = createObservableObject(initialState, componentLiba.refresh)
                proxyWithWrappers.push(proxy)
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
            statesWithWrappers,
            proxyWithWrappers,
            signals
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

function renderComponent<S, P extends object>(
    {
        ComponentFunction,
        componentInstance,
        renderLiba,
        statesWithWrappers,
        proxyWithWrappers,
        signals
    }: RenderComponentParams<S, P>) {

    componentInstance.childrenIndex = -1

    ComponentFunction.render({
        element: componentInstance.element,
        props: (componentInstance.props) as P,
        proxyWithWrappers,
        liba: renderLiba,
        statesWithWrappers,
        signals
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

function createObservableObject<S>(dto: LocalState<S>, onChange: () => void): LocalState<S> {
    function createProxy<T extends object>(target: T): T {
        let scheduled = false;

        function scheduleCallback() {
            if (!scheduled) {
                scheduled = true;
                Promise.resolve().then(() => {
                    onChange();
                    scheduled = false;
                });
            }
        }

        return new Proxy(target, {
            set(obj, prop, value, receiver) {
                if (value && typeof value === 'object') {
                    value = createProxy(value);
                }

                if (obj[prop as keyof T] !== value) {
                    obj[prop as keyof T] = value;
                    scheduleCallback();
                }
                return Reflect.set(obj, prop, value, receiver)
            },
            get(obj, prop) {
                if (prop in obj) {
                    const value = obj[prop as keyof T];
                    if (Array.isArray(value)) {
                        return new Proxy(value, {
                            set(arr, index, newValue, receiver) {
                                if (newValue && typeof newValue === 'object') {
                                    newValue = createProxy(newValue);
                                }
                                scheduleCallback();
                                return Reflect.set(arr, index, newValue, receiver)
                            },
                            deleteProperty(arr, index) {
                                scheduleCallback();
                                return Reflect.deleteProperty(arr, index)
                            },
                        });
                    }
                    return value;
                }
                return undefined;
            },
        });
    }

    return createProxy(dto);
}
