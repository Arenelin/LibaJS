import {ComponentLibaParam, Option, RenderParams, WritableSignal} from "types";
import {CounterComponent, SelectComponent, TodolistsComponent} from "./components";
import {CurrentPage, EnumCurrentPage} from "./enums";

export const AppComponent = ({}, {liba}: ComponentLibaParam) => {
    liba.createElement('div');
    liba.signal<EnumCurrentPage>(CurrentPage.Todolists)

    console.log('App mount');

    return {};
};

AppComponent.render = ({signals, liba}: RenderParams) => {
    const FIRST_SIGNAL_INDEX = 0

    const currentPageState = signals[FIRST_SIGNAL_INDEX] as WritableSignal<EnumCurrentPage>

    const options: Option[] = [
        {value: CurrentPage.Todolists, title: 'Todolist page'},
        {value: CurrentPage.Counter, title: 'Counter page'},
    ]

    const onChangeCurrentPage = (e: Event) => {
        const selectHTMLElement = e.currentTarget as HTMLSelectElement;
        currentPageState.set(selectHTMLElement.value as EnumCurrentPage)
    };
    liba.create(SelectComponent, {
        options,
        value: currentPageState(),
        onChange: onChangeCurrentPage
    });

    console.log('App re-render');

    switch (currentPageState()) {
        case CurrentPage.Counter: {
            liba.create(CounterComponent);
            break;
        }
        case CurrentPage.Todolists: {
            liba.create(TodolistsComponent);
            break;
        }
    }
};
