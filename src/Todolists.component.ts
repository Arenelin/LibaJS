import {createTodolist, deleteTodolist, getTodolists, TodolistEntity} from "./api/todolists";
import {ComponentLibaParam, LocalState, RenderParams} from "./types";
import {TodolistComponent} from "./Todolist.component";

export const TodolistsComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const todolistsState = liba.useObservable<TodolistEntity[]>({value: []})
    liba.useObservable({value: ''})

    console.log('App mount');

    (async function () {
        const todolists = await getTodolists()
        todolists.forEach(t => todolistsState.value.push(t))
    })()

    return {
        element
    };
};

TodolistsComponent.render = ({element, liba, statesWithWrappers}: RenderParams) => {
    const FIRST_STATE_INDEX = 0
    const SECOND_STATE_INDEX = 1

    const todolistsState = statesWithWrappers[FIRST_STATE_INDEX] as LocalState<TodolistEntity[]>
    const todolistTitleState = statesWithWrappers[SECOND_STATE_INDEX] as LocalState<string>

    const createNewTodolist = async () => {
        if (todolistTitleState.value.length > 0 && todolistTitleState.value.trim()) {
            const newTodolist = await createTodolist(todolistTitleState.value)
            todolistTitleState.value = ''
            todolistsState.value.unshift(newTodolist)
        }
    }

    const removeTodolist = async (id: string) => {
        await deleteTodolist(id)
        const deletedTodolist = todolistsState.value.find(t => t.id === id)
        if (deletedTodolist) {
            const deletedTodolistIndex = todolistsState.value.indexOf(deletedTodolist)
            todolistsState.value.splice(deletedTodolistIndex, 1)
        }
    }

    const input = document.createElement('input')
    input.value = todolistTitleState.value

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        todolistTitleState.value = inputHTMLElement.value
    }

    input.addEventListener('change', onChangeHandler)
    element.append(input)

    const button = document.createElement('button')
    button.append('Create new todolist')

    button.addEventListener('click', createNewTodolist)
    element.append(button)

    todolistsState.value.forEach(todolist => {
        const todolistInstance = liba.create(TodolistComponent, {
                todolist,
                removeTodolist
            },
            todolist.id);
        element.append(todolistInstance.element);
    });
};
