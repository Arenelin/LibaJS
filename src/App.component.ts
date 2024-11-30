import {ComponentFunction, RenderParams} from "./types";
import {CounterComponent} from "./Counter.component";
import {TodolistComponent} from "./Todolist.component";

enum CurrentPage {
    Todolist = 'todolist',
    Counter = 'counter'
}

export type AppLocalState = {
    currentPage: CurrentPage
}


export const AppComponent: ComponentFunction<AppLocalState> = () => {
    const element = document.createElement('div');
    const localState: AppLocalState = {
        currentPage: CurrentPage.Todolist,
    };

    console.log('App mount');

    return {
        element,
        localState,
    };
};

AppComponent.render = ({ element, localState, liba }: RenderParams<AppLocalState>) => {
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
        localState.currentPage = selectHTMLElement.value as CurrentPage;
        liba.refresh();
    };

    pageSelector.addEventListener('change', onChangeCurrentPage);
    pageSelector.value = localState.currentPage;
    element.append(pageSelector);

    console.log('App re-render');

    switch (localState.currentPage) {
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
