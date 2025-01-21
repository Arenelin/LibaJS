import {ComponentLibaParam, RenderParams, WritableSignal} from "types";
import {CounterComponent, TodolistsComponent} from "./components";
import {CurrentPage, EnumCurrentPage} from "./enums";

export const AppComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    liba.signal<EnumCurrentPage>(CurrentPage.Todolists)

    console.log('App mount');

    return {
        element
    };
};

AppComponent.render = ({element, signals, liba}: RenderParams) => {
    const FIRST_SIGNAL_INDEX = 0

    const currentPageState = signals[FIRST_SIGNAL_INDEX] as WritableSignal<EnumCurrentPage>

    const counterPageOption = liba.create('option', {
        value: CurrentPage.Counter,
        children: ['Counter page']
    });
    const todolistPageOption = liba.create('option', {
        value: CurrentPage.Todolists,
        children: ['Todolist page']
    });
    const onChangeCurrentPage = (e: Event) => {
        const selectHTMLElement = e.currentTarget as HTMLSelectElement;
        currentPageState.set(selectHTMLElement.value as EnumCurrentPage)
    };

    const pageSelector = liba.create('select', {
        children: [todolistPageOption, counterPageOption],
        onChange: onChangeCurrentPage,
        value: currentPageState()
    });

    element.append(pageSelector);

    console.log('App re-render');

    switch (currentPageState()) {
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
