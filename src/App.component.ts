import {ComponentLibaParam, Dispatch, LocalState, RenderParams, SetStateAction} from "./types";
import {CounterComponent} from "./Counter.component";
import {TodolistComponent} from "./Todolist.component";

enum CurrentPage {
    Todolist = 'todolist',
    Counter = 'counter'
}

type Props = {
    setLocalState: Dispatch<SetStateAction<CurrentPage>>
}

export const AppComponent = ({liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [localState, setLocalState] = liba.useState(CurrentPage.Todolist)

    console.log('App mount');
    const renderProps = {
        setLocalState
    }

    return {
        element,
        localState,
        props: renderProps
    };
};

AppComponent.render = ({element, localState, liba, props}: RenderParams<Props, LocalState<CurrentPage>>) => {
    const pageSelector = document.createElement('select');
    const counterPageOption = document.createElement('option');
    counterPageOption.value = CurrentPage.Counter;
    counterPageOption.append('Counter page');

    const todolistPageOption = document.createElement('option');
    todolistPageOption.value = CurrentPage.Todolist;
    todolistPageOption.append('Todolist page');
    pageSelector.append(counterPageOption, todolistPageOption);

    const onChangeCurrentPage = (e: Event) => {
        const selectHTMLElement = e.currentTarget as HTMLSelectElement;
        props.setLocalState(selectHTMLElement.value as CurrentPage)
    };

    pageSelector.addEventListener('change', onChangeCurrentPage);
    pageSelector.value = localState.value;
    element.append(pageSelector);

    console.log('App re-render');

    switch (localState.value) {
        case CurrentPage.Counter: {
            const counterInstance = liba.create(CounterComponent);
            element.append(counterInstance.element);
            break;
        }
        case CurrentPage.Todolist: {
            const todolistInstance = liba.create(TodolistComponent);
            element.append(todolistInstance.element);
            break;
        }
    }
};
