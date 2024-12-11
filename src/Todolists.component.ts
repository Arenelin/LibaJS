import {ComponentLibaParam, LocalState, RenderParams} from "types";
import {getTodolists} from "./api/todolists";
import {TodolistComponent} from "./Todolist.component";

export type TodolistEntity = {
    id: string
    title: string
    addedDate: string
    order: number
}


export const TodolistsComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [localState, setLocalState] = liba.useState<TodolistEntity[]>([])

    console.log('App mount');

    (function () {
        getTodolists().then(r => setLocalState(r))
    })()

    return {
        element,
        localState,
    };
};

TodolistsComponent.render = ({element, liba, localState}: RenderParams<{}, LocalState<TodolistEntity[]>>) => {
    localState.value.forEach((todolist) => {
        const taskInstance = liba.create(TodolistComponent, {todolist});
        element.append(taskInstance.element);
    });
};
