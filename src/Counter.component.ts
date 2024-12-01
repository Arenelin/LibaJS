import {ComponentLibaParam, RenderParams} from "./types";

type CounterLocalState = {
    value: number
}

export const CounterComponent = ({liba}: ComponentLibaParam) => {
    const element = document.createElement('div');

    const localState: CounterLocalState = {
        value: 1,
    };

    console.log('Counter mount');
    const intervalId = setInterval(() => {
        localState.value++;
        liba.refresh();
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
