import {
    ComponentFn,
    ComponentLiba,
    CreateComponentParams, Dispatch, Effect,
    LocalState,
    RenderLiba, SetStateAction, WritableSignal, SignalUpdateMethod
} from "./types";
import {
    createObservableObject,
    cleanComponent,
    ensureChildren,
    renderComponent,
    createChildrenComponent
} from "./utils";

let currentEffect: Effect = null;

export const Liba = {
    create<P extends object>(
        {
            ComponentFunction,
            props = {},
            parentInstance,
            key
        }: CreateComponentParams<P>) {

        const proxyWithWrappers: LocalState<any>[] = []
        const statesWithWrappers: [LocalState<any>, Dispatch<SetStateAction<any>>][] = []
        const signals: WritableSignal<any>[] = []

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
            signal<V>(initialState: V): WritableSignal<V> {
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

        if (parentInstance) {
            ensureChildren(parentInstance)
            parentInstance.childrenComponents?.addItem(componentInstance, ComponentFunction, key)
        }

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
