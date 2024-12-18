import {ComponentLibaParam, Dispatch, RenderParams, SetStateAction} from "types";
import {CounterComponent} from "./Counter.component";
import {TodolistsComponent} from "./Todolists.component";

const CurrentPage = {
    Todolists: 'todolists',
    Counter: 'counter'
} as const

const COUNTER_KEY = 'COUNTER_KEY'
const TODOLISTS_KEY = 'TODOLISTS_KEY'

type EnumCurrentPage = (typeof CurrentPage)[keyof typeof CurrentPage]

export const AppComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    liba.useState<EnumCurrentPage>(CurrentPage.Todolists)

    console.log('App mount');

    return {
        element
    };
};

AppComponent.render = ({element, statesWithWrappers, liba}: RenderParams) => {
    const FIRST_STATE_INDEX = 0

    const [currentPage, setCurrentPage] = statesWithWrappers[FIRST_STATE_INDEX] as [
        EnumCurrentPage, Dispatch<SetStateAction<EnumCurrentPage>>
    ]

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
        setCurrentPage(selectHTMLElement.value as EnumCurrentPage)
    };

    pageSelector.addEventListener('change', onChangeCurrentPage);
    pageSelector.value = currentPage;
    element.append(pageSelector);

    console.log('App re-render');

    switch (currentPage) {
        case CurrentPage.Counter: {
            const counterInstance = liba.create(CounterComponent, {}, COUNTER_KEY);
            element.append(counterInstance.element);
            break;
        }
        case CurrentPage.Todolists: {
            const todolistsInstance = liba.create(TodolistsComponent, {}, TODOLISTS_KEY);
            element.append(todolistsInstance.element);
            break;
        }
    }
};
