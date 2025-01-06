import {
    createTask,
    deleteTask,
    getTasks,
    TaskEntity,
    TaskStatuses,
    TodolistEntity,
    updateTask,
    UpdateTaskModel
} from "./api";
import {ComponentLibaParam, RenderParams, WritableSignal} from "./types";
import {TaskComponent} from "./Task.component";
import {FilterComponent} from "./Filter.component";
import {AddItemFormComponent, Item} from "./AddItemForm.component";

export const TaskFilter = {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
} as const

export type EnumTaskFilter = (typeof TaskFilter)[keyof typeof TaskFilter]

type Props = {
    todolist: TodolistEntity
    removeTodolist: (id: string) => void
}

export const TodolistComponent = (props: Props, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const tasks = liba.signal<TaskEntity[]>( [])
    liba.signal<EnumTaskFilter>(TaskFilter.All)

    console.log('Todolist mount');

    liba.effect(() => {
        getTasks(props.todolist.id).then(r => r.forEach(t =>
            tasks.update(prevState => [...prevState, t])))
    })

    return {
        element
    };
};

TodolistComponent.render = ({element, props, liba, signals}: RenderParams<Props>) => {
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

    const title = document.createElement('h2');
    title.append(props.todolist.title);
    element.append(title);

    const filterButtons = liba.create(FilterComponent, {filterTasks})
    element.append(filterButtons.element)

    const removeButton = document.createElement('button')
    removeButton.append('Remove todolist')
    removeButton.addEventListener('click', () => props.removeTodolist(props.todolist.id))
    element.append(removeButton)

    const addTaskForm = liba.create(AddItemFormComponent, {createNewItem: createNewTask, item: Item.Task})
    element.append(addTaskForm.element)

    console.log('Todolist re-render');

    const filteredTasks = currentFilter() !== TaskFilter.All
        ? tasks().filter((t: TaskEntity) => currentFilter() === TaskFilter.Active
            ? t.status === TaskStatuses.New
            : t.status === TaskStatuses.Completed)
        : tasks()

    filteredTasks.forEach((task: TaskEntity) => {
        const taskInstance = liba.create(TaskComponent, {
                task,
                updateTask: updateTaskHandler,
                removeTask
            },
            task.id);
        element.append(taskInstance.element);
    });
};
