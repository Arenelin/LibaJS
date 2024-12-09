import {ComponentLibaParam, Dispatch, LocalState, RenderParams, SetStateAction} from "types";
import {createTodolist, getTodolists} from "./api/todolists";
import {TodolistComponent} from "./Todolist.component";

export type TodolistEntity = {
    id: string
    title: string
    addedDate: string
    order: number
}

type TodolistsComponentLocalState = {
    todolists: LocalState<TodolistEntity[]>
    todolistTitle: LocalState<string>
    setTodolistTitle: Dispatch<SetStateAction<string>>
    createNewTodolist: () => void
}

export const TodolistsComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [todolists, setTodolists] = liba.useState<TodolistEntity[]>([])
    const [todolistTitle, setTodolistTitle] = liba.useState('')

    console.log('App mount');

    (function () {
        getTodolists().then(r => setTodolists(r))
    })()

    const createNewTodolist = () => {
        if (todolistTitle.value.length > 0 && todolistTitle.value.trim()) {
            createTodolist(todolistTitle.value).then(r => console.log(r))
        }
    }

    return {
        element,
        localState: {todolists, todolistTitle, setTodolistTitle, createNewTodolist},
    };
};

TodolistsComponent.render = ({element, liba, localState}: RenderParams<{}, TodolistsComponentLocalState>) => {

    const input = document.createElement('input')
    input.value = localState.todolistTitle.value

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        const newTitleValue = inputHTMLElement.value
        localState.setTodolistTitle(newTitleValue)
    }

    input.addEventListener('change', onChangeHandler)
    element.append(input)

    const button = document.createElement('button')
    button.append('Create new todolist')
    button.addEventListener('click', localState.createNewTodolist)
    element.append(button)

    localState.todolists.value.forEach((todolist) => {
        const todolistInstance = liba.create(TodolistComponent, {todolist});
        element.append(todolistInstance.element);
    });
};
