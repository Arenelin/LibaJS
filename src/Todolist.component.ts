import {TodolistEntity} from "./api/todolists";
import {createTask, deleteTask, getTasks, TaskEntity, TaskStatuses, updateTask, UpdateTaskModel} from "./api/tasks";
import {ComponentLibaParam, RenderParams, WritableSignal} from "./types";
import {TaskComponent} from "./Task.component";

const TaskFilter = {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
} as const

type EnumTaskFilter = (typeof TaskFilter)[keyof typeof TaskFilter]

type Props = {
    todolist: TodolistEntity
    removeTodolist: (id: string) => void
}

export const TodolistComponent = (props: Props, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const tasks = liba.signal<TaskEntity[]>( [])
    liba.signal('')
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
    const SECOND_SIGNAL_INDEX = 1
    const THIRD_SIGNAL_INDEX = 2

    const tasks = signals[FIRST_SIGNAL_INDEX] as WritableSignal<TaskEntity[]>
    const newTaskTitle = signals[SECOND_SIGNAL_INDEX] as WritableSignal<string>
    const currentFilter = signals[THIRD_SIGNAL_INDEX] as WritableSignal<EnumTaskFilter>

    const createNewTask = async () => {
        if (newTaskTitle().length > 0 && newTaskTitle().trim()) {
            const newTask = await createTask({todolistId: props.todolist.id, title: newTaskTitle()})
            newTaskTitle.set('')
            tasks.update(prevState => {
                prevState.unshift(newTask)
                return prevState
            })
        }
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

    const allButton = document.createElement('button')
    allButton.append('Show all tasks')
    allButton.addEventListener('click', () => filterTasks(TaskFilter.All))
    element.append(allButton)

    const activeButton = document.createElement('button')
    activeButton.append('Show only active tasks')
    activeButton.addEventListener('click', () => filterTasks(TaskFilter.Active))
    element.append(activeButton)

    const completedButton = document.createElement('button')
    completedButton.append('Show only completed tasks')
    completedButton.addEventListener('click', () => filterTasks(TaskFilter.Completed))
    element.append(completedButton)

    const removeButton = document.createElement('button')
    removeButton.append('Remove todolist')
    removeButton.addEventListener('click', () => props.removeTodolist(props.todolist.id))
    element.append(removeButton)

    const input = document.createElement('input')
    input.value = newTaskTitle()

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        newTaskTitle.set(inputHTMLElement.value)
    }

    input.addEventListener('change', onChangeHandler)
    element.append(input)

    const button = document.createElement('button')
    button.append('Create new task')

    button.addEventListener('click', createNewTask)
    element.append(button)

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
