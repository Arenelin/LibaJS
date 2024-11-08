function isSameProps(prevProps, newProps) {
    if (!(Object.keys(prevProps).length === Object.keys(newProps).length)) {
        return false
    }
    if (prevProps !== newProps) {
        return false
    }
    const prevValues = Object.values(prevProps)
    const newValues = Object.values(newProps)

    for (let i = 0; i < newValues; i++) {
        if (prevValues[i] !== newValues[i]) {
            return false
        }
    }
    return true
}

function ensureChildren(parent) {
    if (parent) {
        if (!parent.childrenComponents) {
            parent.childrenComponents = []
        }
    }
}

export const Liba = {
    create(ComponentFunction, props = {}, {parent} = {parent: null}) {
        const renderLiba = {
            create(ChildrenComponentFunction, props = {}) {
                const childInstance = Liba.create(ChildrenComponentFunction, props, {parent: componentInstance})
                return childInstance
            },
            refresh() {
                componentInstance.element.innerHTML = ''
                componentInstance.childrenComponents?.forEach(cc => cc.cleanup?.())
                renderComponent()
            }
        }
        const componentLiba = {
            refresh: renderLiba.refresh
        }

        const componentInstance = ComponentFunction(props, {liba: componentLiba})
        if (parent) {
            ensureChildren(parent)
            parent.childrenComponents.push(componentInstance)
        }


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
