export type ComponentFunction<P extends object = {}, L extends object = {}> = {
    ({liba}: ComponentLibaParam, props: P): ComponentInstance<P, L>
    render: (params: RenderParams<P, L>) => void
}

export type ComponentInstance<P extends object = {}, L extends object = {}> = {
    element: HTMLElement
    props?: P
    localState?: L
    cleanup?: () => void
    type?: ComponentFunction<P, L>
    refresh?: () => void
    childrenComponents?: ComponentInstance<P, L>[]
    childrenIndex?: number
}

export type RenderParams<P extends object = {}, L extends object = {}> = {
    element: HTMLElement
    props: P
    localState: L
    liba: RenderLiba
}

export type LocalState<T> = {
    value: T
}

export type FunctionSetter<T> = (newState: T) => void

export type ComponentLiba = {
    refresh: () => void
    useState: <T>(initialState: T) => [LocalState<T>, FunctionSetter<T>]
}

export type ComponentLibaParam = {
    liba: ComponentLiba
}

export type RenderLiba = {
    create: <P extends object = {}, L extends object = {}>(ChildrenComponentFunction: ComponentFunction<P, L>, props?: P)
        => ComponentInstance<P, L>
    refresh: () => void
}

export type ParentInstance<P extends object = {}, L extends object = {}> = ComponentInstance<P, L> | null

export type CreateComponentParams<P extends object = {}, L extends object = {}> = {
    ComponentFunction: ComponentFunction<P, L>
    props?: object
    parentInstance?: ParentInstance<any, any>
}

export type RenderComponentParams<P extends object = {}, L extends object = {}> = {
    ComponentFunction: ComponentFunction<P, L>
    componentInstance: ComponentInstance<P, L>
    renderLiba: RenderLiba
}
