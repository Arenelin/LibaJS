export type ComponentFn<P extends object = {}, L extends object = {}> = {
    ({liba}: ComponentLibaParam, props: P): ComponentInstance<P, L>
    render: (params: RenderParams<P, L>) => void
}

export type ComponentInstance<P extends object = {}, L extends object = {}> = {
    element: HTMLElement
    props?: P
    localState?: L
    cleanup?: () => void
    type?: ComponentFn<P, L>
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

export type LocalState<S> = {
    value: S
}

export type SetStateAction<S> = S | ((prevState: S) => S);

export type Dispatch<A> = (value: A) => void;

export type ComponentLiba = {
    refresh: () => void
    useState: <S>(initialState: S | (() => S)) => [LocalState<S>, Dispatch<SetStateAction<S>>]
}

export type ComponentLibaParam = {
    liba: ComponentLiba
}

export type RenderLiba = {
    create: <P extends object = {}, L extends object = {}>(ChildrenComponentFunction: ComponentFn<P, L>, props?: P)
        => ComponentInstance<P, L>
    refresh: () => void
}

export type ParentInstance<P extends object = {}, L extends object = {}> = ComponentInstance<P, L> | null

export type CreateComponentParams<P extends object = {}, L extends object = {}> = {
    ComponentFunction: ComponentFn<P, L>
    props?: object
    parentInstance?: ParentInstance<any, any>
}

export type RenderComponentParams<P extends object = {}, L extends object = {}> = {
    ComponentFunction: ComponentFn<P, L>
    componentInstance: ComponentInstance<P, L>
    renderLiba: RenderLiba
}
