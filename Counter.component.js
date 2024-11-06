export function CounterComponent() {
    const element = document.createElement('div')

    const localState = {
        value: 1
    }
    console.log('Counter mount')
    const intervalId = setInterval(() => {
        localState.value++
        CounterComponent.render({element, localState})
    }, 1000)

    CounterComponent.render({element, localState})

    return {
        element,
        localState,
        cleanup: () => {
            clearInterval(intervalId)
        }
    }
}

CounterComponent.render = ({element, localState}) => {
    element.innerHTML = ''
    element.append(localState.value)
    console.log('Counter re-render')
}
