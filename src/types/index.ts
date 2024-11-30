export type ComponentFunction<L extends object = {}, P extends object = {}> = {
    ({liba}: ComponentLibaParam, props: P): ComponentInstance<L, P>
    render: (params: RenderParams<L, P>) => void
}

export type ComponentInstance<L extends object = {}, P extends object = {}> = {
    element: HTMLElement
    localState?: L
    props?: P
    cleanup?: () => void
    type?: ComponentFunction<L, P>
    refresh?: () => void
    childrenComponents?: ComponentInstance<L, P>[]
    childrenIndex?: number
}

export type RenderParams<L extends object = object, PP extends object = object> = {
    element: HTMLElement
    localState: L
    props: PP
    liba: RenderLiba
}

export type ComponentLiba = {
    refresh: () => void
}

export type ComponentLibaParam = {
    liba: ComponentLiba
}

export type RenderLiba = {
    create: <L extends object = {}, P extends object = {}>(ChildrenComponentFunction: ComponentFunction<L, P>, props?: P)
        => ComponentInstance<L, P>
    refresh: () => void
}

export type ParentInstance<L extends object = {}, P extends object = {}> = ComponentInstance<L, P> | null

export type CreateComponentParams<L extends object = {}, P extends object = {}> = {
    ComponentFunction: ComponentFunction<L, P>
    props?: object
    parentInstance?: ParentInstance<any, any>
}

export type RenderComponentParams<L extends object = {}, P extends object = {}> = {
    ComponentFunction: ComponentFunction<L, P>
    componentInstance: ComponentInstance<L, P>
    renderLiba: RenderLiba
}
