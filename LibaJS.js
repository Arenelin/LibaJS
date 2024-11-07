export const Liba = {
    create(ComponentFunction, props = {}) {
        const renderLiba = {
            create: Liba.create,
            refresh() {
                componentInstance.element.innerHTML = ''
                renderComponent()
            }
        }
        const componentLiba = {
            refresh: renderLiba.refresh
        }

        const componentInstance = ComponentFunction(props, {liba: componentLiba})

        const renderComponent = () => {
            ComponentFunction.render({
                element: componentInstance.element,
                localState: componentInstance.localState,
                props: componentInstance.props,
                liba: renderLiba
            })
        }
        renderComponent()

        return componentInstance
    },
}
