import {
    createTask,
    deleteTask,
    getTasks,
    TaskEntity,
    TodolistEntity,
    updateTask,
    UpdateTaskModel
} from "../api";
import {ComponentLibaParam, RenderParams, WritableSignal} from "../types";
import {EnumTaskFilter, Item, TaskFilter, TaskStatuses} from "../enums";
import {AddItemFormComponent} from "./AddItemForm.component.ts";
import {FilterComponent} from "./Filter.component.ts";
import {TaskComponent} from "./Task.component.ts";

type Props = {
    todolist: TodolistEntity
    removeTodolist: (id: string) => void
}

export const TodolistComponent = (props: Props, {liba}: ComponentLibaParam) => {
    liba.createElement('div');
    const tasks = liba.signal<TaskEntity[]>([])
    liba.signal<EnumTaskFilter>(TaskFilter.All)

    console.log('Todolist mount');

    liba.effect(() => {
        getTasks(props.todolist.id).then(r => r.forEach(t =>
            tasks.update(prevState => [...prevState, t])))
    })

    return {};
};

TodolistComponent.render = ({props, liba, signals}: RenderParams<Props>) => {
    const FIRST_SIGNAL_INDEX = 0
    const THIRD_SIGNAL_INDEX = 1

    const tasks = signals[FIRST_SIGNAL_INDEX] as WritableSignal<TaskEntity[]>
    const currentFilter = signals[THIRD_SIGNAL_INDEX] as WritableSignal<EnumTaskFilter>

    const createNewTask = async (newTaskTitle: string) => {
        const newTask = await createTask({todolistId: props.todolist.id, title: newTaskTitle})
        tasks.update(prevState => {
            prevState.unshift(newTask)
            return prevState
        })
    }

    const updateTaskHandler = async (taskId: string, model: UpdateTaskModel) => {
        await updateTask({todolistId: props.todolist.id, taskId, model})
        const prevTask = tasks().find(t => t.id === taskId)
        if (prevTask) {
            const prevTaskIndex = tasks().indexOf(prevTask)
            const updatedTask = {...prevTask, ...model}
            tasks.update(prevState => {
                prevState.splice(prevTaskIndex, 1, updatedTask)
                return prevState
            })
        }
    }

    const removeTask = async (taskId: string) => {
        await deleteTask({todolistId: props.todolist.id, taskId})
        const deletedTask = tasks().find(t => t.id === taskId)
        if (deletedTask) {
            const deletedTaskIndex = tasks().indexOf(deletedTask)
            tasks.update(prevState => {
                prevState.splice(deletedTaskIndex, 1)
                return prevState
            })
        }
    }

    const filterTasks = (filterValue: EnumTaskFilter) => {
        currentFilter.set(filterValue)
    }

    liba.create('h2', {
        children: [props.todolist.title]
    });

    liba.create(FilterComponent, { // no element error
        filterTasks
    })

    liba.create('button', {
        children: ['Remove todolist'],
        onClick: () => props.removeTodolist(props.todolist.id)
    })

    liba.create(AddItemFormComponent, { // no element error
        createNewItem: createNewTask,
        item: Item.Task
    })

    console.log('Todolist re-render');

    const filteredTasks = currentFilter() !== TaskFilter.All
        ? tasks().filter((t: TaskEntity) => currentFilter() === TaskFilter.Active
            ? t.status === TaskStatuses.New
            : t.status === TaskStatuses.Completed)
        : tasks()

    filteredTasks.forEach((task: TaskEntity) => {
        liba.create(TaskComponent, { // no element error
                task,
                updateTask: updateTaskHandler,
                removeTask
            },
            task.id);
    });
};
