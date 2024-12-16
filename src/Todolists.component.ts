import {ComponentLibaParam, Dispatch, RenderParams, SetStateAction} from "types";
import {createTodolist, deleteTodolist, getTodolists, TodolistEntity} from "./api/todolists";
import {TodolistComponent} from "./Todolist.component";

export const TodolistsComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [, setTodolists] = liba.useState<TodolistEntity[]>([])
    liba.useState('')

    console.log('App mount');

    (async function () {
        const todolists = await getTodolists()
        setTodolists(todolists)
    })()

    return {
        element
    };
};

TodolistsComponent.render = ({element, liba, statesWithWrappers}: RenderParams) => {
    const [todolists, setTodolists] = statesWithWrappers[0] as [TodolistEntity[], Dispatch<SetStateAction<TodolistEntity[]>>]
    const [todolistTitle, setTodolistTitle] = statesWithWrappers[1] as [string, Dispatch<SetStateAction<string>>]

    const createNewTodolist = async () => {
        if (todolistTitle.length > 0 && todolistTitle.trim()) {
            const newTodolist = await createTodolist(todolistTitle)
            setTodolistTitle('')
            setTodolists([newTodolist, ...todolists])
        }
    }

    const removeTodolist = async (id: string) => {
        await deleteTodolist(id)
        setTodolists(todolists.filter(t => t.id !== id))
    }

    const input = document.createElement('input')
    input.value = todolistTitle

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        const newTitleValue = inputHTMLElement.value
        setTodolistTitle(newTitleValue)
    }

    input.addEventListener('change', onChangeHandler)
    element.append(input)

    const button = document.createElement('button')
    button.append('Create new todolist')

    button.addEventListener('click', createNewTodolist)
    element.append(button)

    todolists.forEach(todolist => {
        const todolistInstance = liba.create(TodolistComponent, {
            todolist,
            removeTodolist
        });
        element.append(todolistInstance.element);
    });
};
