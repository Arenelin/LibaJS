import {ComponentLibaParam, LocalState, RenderParams} from "types";
import {CounterComponent} from "./Counter.component";
import {TodolistsComponent} from "./Todolists.component";

const CurrentPage = {
    Todolists: 'todolists',
    Counter: 'counter'
} as const

type EnumCurrentPage = (typeof CurrentPage)[keyof typeof CurrentPage]

export const AppComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    liba.useObservable<EnumCurrentPage>({value: CurrentPage.Todolists})

    console.log('App mount');

    return {
        element
    };
};

AppComponent.render = ({element, statesWithWrappers, liba}: RenderParams) => {
    const FIRST_STATE_INDEX = 0

    const currentPageState = statesWithWrappers[FIRST_STATE_INDEX] as LocalState<EnumCurrentPage>

    const pageSelector = document.createElement('select');
    const counterPageOption = document.createElement('option');
    counterPageOption.value = CurrentPage.Counter;
    counterPageOption.append('Counter page');

    const todolistPageOption = document.createElement('option');
    todolistPageOption.value = CurrentPage.Todolists;
    todolistPageOption.append('Todolist page');
    pageSelector.append(counterPageOption, todolistPageOption);

    const onChangeCurrentPage = (e: Event) => {
        const selectHTMLElement = e.currentTarget as HTMLSelectElement;
        currentPageState.value = selectHTMLElement.value as EnumCurrentPage
    };

    pageSelector.addEventListener('change', onChangeCurrentPage);
    pageSelector.value = currentPageState.value;
    element.append(pageSelector);

    console.log('App re-render');

    switch (currentPageState.value) {
        case CurrentPage.Counter: {
            const counterInstance = liba.create(CounterComponent);
            element.append(counterInstance.element);
            break;
        }
        case CurrentPage.Todolists: {
            const todolistsInstance = liba.create(TodolistsComponent);
            element.append(todolistsInstance.element);
            break;
        }
    }
};
