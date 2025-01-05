import {createTodolist, deleteTodolist, getTodolists, TodolistEntity} from "./api/todolists";
import {ComponentLibaParam, RenderParams, WritableSignal} from "./types";
import {TodolistComponent} from "./Todolist.component";

export const TodolistsComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const todolists = liba.signal<TodolistEntity[]>([])
    liba.signal('')

    console.log('App mount');

    liba.effect(() => {
        getTodolists().then(r => r.forEach(t =>
            todolists.update(prevState => [...prevState, t])))
    })

    return {
        element
    };
};

TodolistsComponent.render = ({element, liba, signals}: RenderParams) => {
    const FIRST_SIGNAL_INDEX = 0
    const SECOND_SIGNAL_INDEX = 1

    const todolists = signals[FIRST_SIGNAL_INDEX] as WritableSignal<TodolistEntity[]>
    const todolistTitle = signals[SECOND_SIGNAL_INDEX] as WritableSignal<string>

    const createNewTodolist = async () => {
        if (todolistTitle().length > 0 && todolistTitle().trim()) {
            const newTodolist = await createTodolist(todolistTitle())
            todolistTitle.set('')
            todolists.update(prevState => {
                prevState.unshift(newTodolist)
                return prevState
            })
        }
    }

    const removeTodolist = async (id: string) => {
        await deleteTodolist(id)
        const deletedTodolist = todolists().find(t => t.id === id)
        if (deletedTodolist) {
            const deletedTodolistIndex = todolists().indexOf(deletedTodolist)
            todolists.update(prevState => {
                prevState.splice(deletedTodolistIndex, 1)
                return prevState
            })
        }
    }

    const input = document.createElement('input')
    input.value = todolistTitle()

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        todolistTitle.set(inputHTMLElement.value)
    }

    input.addEventListener('change', onChangeHandler)
    element.append(input)

    const button = document.createElement('button')
    button.append('Create new todolist')

    button.addEventListener('click', createNewTodolist)
    element.append(button)

    todolists().forEach(todolist => {
        const todolistInstance = liba.create(TodolistComponent, {
                todolist,
                removeTodolist
            },
            todolist.id);
        element.append(todolistInstance.element);
    });
};
