import {ComponentLibaParam, Dispatch, RenderParams, SetStateAction} from "types";

export const CounterComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [, setCount] = liba.useState(0)

    console.log('Counter mount');
    const intervalId = setInterval(() => {
        setCount(prevState => prevState + 1)
    }, 1000);

    return {
        element,
        cleanup: () => {
            clearInterval(intervalId);
        },
    };
}

CounterComponent.render = ({element, statesWithWrappers}: RenderParams) => {
    const FIRST_STATE_INDEX = 0

    const [count] = statesWithWrappers[FIRST_STATE_INDEX] as [number, Dispatch<SetStateAction<number>>]
    element.append(count.toString());
    console.log('Counter re-render');
};
