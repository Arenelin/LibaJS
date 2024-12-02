import {ComponentLibaParam, RenderParams} from "./types";

type CounterLocalState = {
    value: number
}

export const CounterComponent = ({liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [localState, setLocalState] = liba.useState(0)

    console.log('Counter mount');
    const intervalId = setInterval(() => {
        setLocalState(localState.value + 1)
    }, 1000);

    return {
        element,
        localState,
        cleanup: () => {
            clearInterval(intervalId);
        },
    };
}

CounterComponent.render = ({element, localState}: RenderParams<{}, CounterLocalState>) => {
    element.append(localState.value.toString());
    console.log('Counter re-render');
};
