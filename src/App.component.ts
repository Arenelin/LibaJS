import {ComponentLibaParam, Dispatch, LocalState, RenderParams, SetStateAction} from "types";
import {CounterComponent} from "./Counter.component";
import {TodolistsComponent} from "./Todolists.component";

const CurrentPage =  {
    Todolists: 'todolists',
    Counter: 'counter'
} as const

type EnumCurrentPage = (typeof CurrentPage)[keyof typeof CurrentPage]

type LocalComponentState = {
    currentPage: LocalState<EnumCurrentPage>
    setCurrentPage: Dispatch<SetStateAction<EnumCurrentPage>>
}

export const AppComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [currentPage, setCurrentPage] = liba.useState<EnumCurrentPage>(CurrentPage.Todolists)

    console.log('App mount');

    return {
        element,
        localState: {currentPage, setCurrentPage},
    };
};

AppComponent.render = ({element, localState, liba}: RenderParams<LocalComponentState>) => {
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
        localState.setCurrentPage(selectHTMLElement.value as EnumCurrentPage)
    };

    pageSelector.addEventListener('change', onChangeCurrentPage);
    pageSelector.value = localState.currentPage.value;
    element.append(pageSelector);

    console.log('App re-render');

    switch (localState.currentPage.value) {
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
