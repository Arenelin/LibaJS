function propsTheSame(prevProps, newProps) {
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
                componentInstance.childrenIndex++
                const alreadyExistedComponentInstance = componentInstance.childrenComponents?.[componentInstance.childrenIndex]

                if (alreadyExistedComponentInstance) {
                    if (alreadyExistedComponentInstance.type === ChildrenComponentFunction) {
                        if (propsTheSame(alreadyExistedComponentInstance.props, props)) {
                            return alreadyExistedComponentInstance
                        } else {
                            alreadyExistedComponentInstance.props = props
                            alreadyExistedComponentInstance.refresh()
                            return alreadyExistedComponentInstance
                        }
                    } else {
                        componentInstance.childrenComponents.splice(componentInstance.childrenIndex, 1)
                    }
                }
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
        componentInstance.type = ComponentFunction
        componentInstance.refresh = renderLiba.refresh

        if (parent) {
            ensureChildren(parent)
            parent.childrenComponents[parent.childrenIndex] = componentInstance
        }

        const renderComponent = () => {
            componentInstance.childrenIndex = -1

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
