import {ComponentLibaParam, RenderParams, WritableSignal} from "../types";
import {createTodolist, deleteTodolist, getTodolists, TodolistEntity} from "../api";
import {Item} from "../enums";
import {AddItemFormComponent, TodolistComponent} from "../components";

export const TodolistsComponent = ({}, {liba}: ComponentLibaParam) => {
    liba.createElement('div');
    const todolists = liba.signal<TodolistEntity[]>([])

    console.log('Todolists mount');

    liba.effect(() => {
        getTodolists().then(r => r.forEach(t =>
            todolists.update(prevState => [...prevState, t])))
    })

    return {};
};

TodolistsComponent.render = ({liba, signals}: RenderParams) => {
    const FIRST_SIGNAL_INDEX = 0

    const todolists = signals[FIRST_SIGNAL_INDEX] as WritableSignal<TodolistEntity[]>

    const createNewTodolist = async (todolistTitle: string) => {
        const newTodolist = await createTodolist(todolistTitle)
        todolists.update(prevState => {
            prevState.unshift(newTodolist)
            return prevState
        })
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

    liba.create(AddItemFormComponent, {
        createNewItem: createNewTodolist,
        item: Item.Todolist
    })

    todolists().forEach(todolist => {
        liba.create(TodolistComponent, {
                todolist,
                removeTodolist
            },
            todolist.id);
    });
    console.log('Todolists re-render');
};
