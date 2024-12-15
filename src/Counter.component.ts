import {ComponentLibaParam, LocalState, RenderParams} from "types";

type LocalComponentState = {
    count: LocalState<number>
}

export const CounterComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [count, setCount] = liba.useState(0)

    console.log('Counter mount');
    const intervalId = setInterval(() => {
        setCount(count.value + 1)
    }, 1000);

    return {
        element,
        localState: {count},
        cleanup: () => {
            clearInterval(intervalId);
        },
    };
}

CounterComponent.render = ({element, localState}: RenderParams<LocalComponentState>) => {
    element.append(localState.count.value.toString());
    console.log('Counter re-render');
};
