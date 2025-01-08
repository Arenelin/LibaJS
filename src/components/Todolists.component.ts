import {ComponentLibaParam, RenderParams, WritableSignal} from "../types";
import {TodolistComponent} from "./Todolist.component.ts";
import {AddItemFormComponent} from "./AddItemForm.component.ts";
import {createTodolist, deleteTodolist, getTodolists, TodolistEntity} from "../api";
import {Item} from "../enums";

export const TodolistsComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const todolists = liba.signal<TodolistEntity[]>([])

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

    const addTodoForm = liba.create(AddItemFormComponent, {
        createNewItem: createNewTodolist,
        item: Item.Todolist
    })
    element.append(addTodoForm.element)

    todolists().forEach(todolist => {
        const todolistInstance = liba.create(TodolistComponent, {
                todolist,
                removeTodolist
            },
            todolist.id);
        element.append(todolistInstance.element);
    });
};
