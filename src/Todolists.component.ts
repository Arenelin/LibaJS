import {ComponentLibaParam, Dispatch, LocalState, RenderParams, SetStateAction} from "types";
import {createTodolist, deleteTodolist, getTodolists} from "./api/todolists";
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

type RenderProps = {
    removeTodolist: (id: string) => void
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
            createTodolist(todolistTitle.value)
                .then(newTodo => {
                    setTodolistTitle('')
                    setTodolists([newTodo, ...todolists.value])
                })
        }
    }

    const removeTodolist = async (id: string) => {
        await deleteTodolist(id)
        setTodolists(todolists.value.filter(t => t.id !== id))
    }

    return {
        element,
        localState: {todolists, todolistTitle, setTodolistTitle, createNewTodolist},
        props: {removeTodolist}
    };
};

TodolistsComponent.render = ({element, liba, localState, props}: RenderParams<RenderProps, TodolistsComponentLocalState>) => {

    const input = document.createElement('input')
    input.value = localState.todolistTitle.value

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        const newTitleValue = inputHTMLElement.value
        localState.setTodolistTitle(newTitleValue)
    }

    const addNewTodolist = () => {
        input.value = ''
        localState.createNewTodolist()
    }

    input.addEventListener('change', onChangeHandler)
    element.append(input)

    const button = document.createElement('button')
    button.append('Create new todolist')
    button.addEventListener('click', addNewTodolist)
    element.append(button)

    localState.todolists.value.forEach((todolist) => {
        const todolistInstance = liba.create(TodolistComponent, {todolist, removeTodolist: props.removeTodolist});
        element.append(todolistInstance.element);
    });
};
