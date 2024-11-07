export function CounterComponent(_, {liba}) {
    const element = document.createElement('div')

    const localState = {
        value: 1
    }
    console.log('Counter mount')
    const intervalId = setInterval(() => {
        localState.value++
        liba.refresh()
    }, 1000)

    return {
        element,
        localState,
        cleanup: () => {
            clearInterval(intervalId)
        }
    }
}

CounterComponent.render = ({element, localState}) => {
    element.append(localState.value)
    console.log('Counter re-render')
}
