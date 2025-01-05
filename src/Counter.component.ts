import {ComponentLibaParam, LocalState, RenderParams} from "types";

export const CounterComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const counterState = liba.useObservable({value: 0})

    console.log('Counter mount');
    const intervalId = setInterval(() => {
        counterState.value++
    }, 1000);

    return {
        element,
        cleanup: () => {
            clearInterval(intervalId);
        },
    };
}

CounterComponent.render = ({element, proxyWithWrappers}: RenderParams) => {
    const FIRST_STATE_INDEX = 0

    const counterState= proxyWithWrappers[FIRST_STATE_INDEX] as LocalState<number>
    element.append(counterState.value.toString());
    console.log('Counter re-render');
};
