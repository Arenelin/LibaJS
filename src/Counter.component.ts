import {ComponentLibaParam, RenderParams, WritableSignal} from "types";

export const CounterComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const counter = liba.signal(0)

    console.log('Counter mount');
    const intervalId = setInterval(() => {
        counter.update(prevState => prevState + 1)
    }, 1000);

    return {
        element,
        cleanup: () => {
            clearInterval(intervalId);
        },
    };
}

CounterComponent.render = ({element, signals}: RenderParams) => {
    const FIRST_SIGNAL_INDEX = 0

    const counterState = signals[FIRST_SIGNAL_INDEX] as WritableSignal<number>
    element.append(counterState().toString());
    console.log('Counter re-render');
};
