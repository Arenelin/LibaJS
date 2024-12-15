import {ComponentLibaParam, Dispatch, LocalState, RenderParams, SetStateAction} from "types";
import {createTodolist, deleteTodolist, getTodolists, TodolistEntity} from "./api/todolists";
import {TodolistComponent} from "./Todolist.component";

type LocalComponentState = {
    todolists: LocalState<TodolistEntity[]>
    todolistTitle: LocalState<string>
    setTodolistTitle: Dispatch<SetStateAction<string>>
    createNewTodolist: () => void
    removeTodolist: (id: string) => void
}

export const TodolistsComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [todolists, setTodolists] = liba.useState<TodolistEntity[]>([])
    const [todolistTitle, setTodolistTitle] = liba.useState('')

    console.log('App mount');

    (async function () {
        const todolists = await getTodolists()
        setTodolists(todolists)
    })()

    const createNewTodolist = async () => {
        if (todolistTitle.value.length > 0 && todolistTitle.value.trim()) {
            const newTodolist = await createTodolist(todolistTitle.value)
            setTodolistTitle('')
            setTodolists([newTodolist, ...todolists.value])
        }
    }

    const removeTodolist = async (id: string) => {
        await deleteTodolist(id)
        setTodolists(todolists.value.filter(t => t.id !== id))
    }

    return {
        element,
        localState: {
            todolists,
            todolistTitle,
            setTodolistTitle,
            createNewTodolist,
            removeTodolist
        }
    };
};

TodolistsComponent.render = ({element, liba, localState}: RenderParams<LocalComponentState>) => {

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

    const addNewTodolist = () => {
        input.value = ''
        localState.createNewTodolist()
    }

    button.addEventListener('click', addNewTodolist)
    element.append(button)

    localState.todolists.value.forEach((todolist) => {
        const todolistInstance = liba.create(TodolistComponent, {
            todolist,
            removeTodolist: localState.removeTodolist
        });
        element.append(todolistInstance.element);
    });
};
