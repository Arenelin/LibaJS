export const Liba = {
    create(ComponentFunction, props = {}) {
        const componentInstance = ComponentFunction(props)

        ComponentFunction.render({
            element: componentInstance.element,
            localState: componentInstance.localState,
            props: componentInstance.props,
            liba: Liba
        })
        return componentInstance
    }
}
