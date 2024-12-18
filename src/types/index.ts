export type ComponentFn<P extends object = {}> = {
    (props: P, {liba}: ComponentLibaParam): ComponentInstance<P>
    render: (params: RenderParams<P>) => void
    key?: string | number
}

export type ComponentInstance<P extends object = {}> = {
    element: HTMLElement
    props?: P
    cleanup?: () => void
    type?: ComponentFn<P>
    refresh?: () => void
    key?: string | number
    childrenComponents?: { key?: string | number } & ComponentInstance<P>[]
    childrenComponentsOfCurrentRender?: { key?: string | number } & ComponentInstance<P>[]
    childrenIndex?: number
}

export type RenderParams<P extends object = {}> = {
    element: HTMLElement
    props: P
    liba: RenderLiba
    statesWithWrappers: [any, Dispatch<SetStateAction<any>>][]
}

export type LocalState<S> = {
    value: S
}

export type SetStateAction<S> = S | ((prevState: S) => S);

export type Dispatch<A> = (value: A) => void;

export type ComponentLiba = {
    refresh: () => void
    useState: <S>(initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>]
}

export type ComponentLibaParam = {
    liba: ComponentLiba
}

export type RenderLiba = {
    create: <P extends object = {}>(ChildrenComponentFunction: ComponentFn<P>, props?: P, key?: string | number)
        => ComponentInstance<P>
    refresh: () => void
}

export type ParentInstance<P extends object = {}> = ComponentInstance<P> | null

export type CreateComponentParams<P extends object = {}> = {
    ComponentFunction: ComponentFn<P>
    props?: object
    parentInstance?: ParentInstance<any>
    key?: string | number
}

export type RenderComponentParams<S, P extends object = {}> = {
    ComponentFunction: ComponentFn<P>
    componentInstance: ComponentInstance<P>
    renderLiba: RenderLiba
    statesWithWrappers: [LocalState<S>, Dispatch<SetStateAction<S>>][]
}
