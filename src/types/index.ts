export type ComponentFn<P extends object = {}> = {
    (props: P, {liba}: ComponentLibaParam): ComponentInstance<P>
    render: (params: RenderParams<P>) => void
}

export type ComponentInstance<P extends object = {}> = {
    element: HTMLElement
    props?: P
    cleanup?: () => void
    type?: ComponentFn<P>
    refresh?: () => void
    key?: string | number
    childrenComponents?: [ComponentInstance<any>[], ComponentInstance<any>[]]
    childrenComponentsOfCurrentRender?: [ComponentInstance<any>[], ComponentInstance<any>[]]
    childrenIndex?: number
}

export type RenderParams<P extends object = {}> = {
    element: HTMLElement
    props: P
    liba: RenderLiba
    statesWithWrappers: LocalState<any>[]
}

export type LocalState<S> = {
    value: S
}

export type ComponentLiba = {
    refresh: () => void
    useObservable: <S>(initialState: LocalState<S>) => LocalState<S>
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

export type RenderComponentParams<P extends object = {}> = {
    ComponentFunction: ComponentFn<P>
    componentInstance: ComponentInstance<P>
    renderLiba: RenderLiba
    statesWithWrappers: LocalState<any>[]
}
