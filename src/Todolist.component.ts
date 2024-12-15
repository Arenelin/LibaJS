import {ComponentLibaParam, Dispatch, LocalState, RenderParams, SetStateAction} from "types";
import {createTask, deleteTask, getTasks, TaskEntity, TaskStatuses, updateTask, UpdateTaskModel} from "./api/tasks";
import {TaskComponent} from "./Task.component";
import {TodolistEntity} from "./api/todolists";

const TaskFilter =  {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
} as const

type EnumTaskFilter = (typeof TaskFilter)[keyof typeof TaskFilter]

type Props = {
    todolist: TodolistEntity
    removeTodolist: (id: string) => void
}

type LocalComponentState = {
    tasks: LocalState<TaskEntity[]>
    taskTitle: LocalState<string>
    currentFilter: LocalState<EnumTaskFilter>
    setTaskTitle: Dispatch<SetStateAction<string>>
    createNewTask: () => void
    updateTaskHandler: (taskId: string, model: UpdateTaskModel) => void
    removeTask: (taskId: string) => void
    filterTasks: (filterValue: EnumTaskFilter) => void
}

export const TodolistComponent = ({todolist, removeTodolist}: Props, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [tasks, setTasks] = liba.useState<TaskEntity[]>([])
    const [newTaskTitle, setNewTaskTitle] = liba.useState('')
    const [currentFilter, setCurrentFilter] = liba.useState<EnumTaskFilter>(TaskFilter.All)

    console.log('Todolist mount');

    (async function () {
        const tasks = await getTasks(todolist.id)
        setTasks(tasks)
    })()

    const createNewTask = async () => {
        if (newTaskTitle.value.length > 0 && newTaskTitle.value.trim()) {
            const newTask = await createTask({todolistId: todolist.id, title: newTaskTitle.value})
            setNewTaskTitle('')
            setTasks([newTask, ...tasks.value])
        }
    }

    const updateTaskHandler = async (taskId: string, model: UpdateTaskModel) => {
        await updateTask({todolistId: todolist.id, taskId, model})
        setTasks(tasks.value.map(t => t.id === taskId ? {...t, ...model} : t))
    }

    const removeTask = async (taskId: string) => {
        await deleteTask({todolistId: todolist.id, taskId})
        setTasks(tasks.value.filter(t => t.id !== taskId))
    }

    const filterTasks = (filterValue: EnumTaskFilter) => {
        setCurrentFilter(filterValue)
    }

    return {
        element,
        localState: {
            tasks,
            createNewTask,
            removeTask,
            setTaskTitle: setNewTaskTitle,
            taskTitle: newTaskTitle,
            updateTaskHandler,
            filterTasks,
            currentFilter
        },
        props: {todolist, removeTodolist}
    };
};

TodolistComponent.render = ({element, props, localState, liba}: RenderParams<LocalComponentState, Props>) => {
    const title = document.createElement('h2');
    title.append(props.todolist.title);
    element.append(title);

    const allButton = document.createElement('button')
    allButton.append('Show all tasks')
    allButton.addEventListener('click', () => localState.filterTasks(TaskFilter.All))
    element.append(allButton)

    const activeButton = document.createElement('button')
    activeButton.append('Show only active tasks')
    activeButton.addEventListener('click', () => localState.filterTasks(TaskFilter.Active))
    element.append(activeButton)

    const completedButton = document.createElement('button')
    completedButton.append('Show only completed tasks')
    completedButton.addEventListener('click', () => localState.filterTasks(TaskFilter.Completed))
    element.append(completedButton)

    const removeButton = document.createElement('button')
    removeButton.append('Remove todolist')
    removeButton.addEventListener('click', () => props.removeTodolist(props.todolist.id))
    element.append(removeButton)

    const input = document.createElement('input')
    input.value = localState.taskTitle.value

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        const newTitleValue = inputHTMLElement.value
        localState.setTaskTitle(newTitleValue)
    }

    input.addEventListener('change', onChangeHandler)
    element.append(input)

    const button = document.createElement('button')
    button.append('Create new task')

    const addNewTask = () => {
        input.value = ''
        localState.createNewTask()
    }

    button.addEventListener('click', addNewTask)
    element.append(button)

    console.log('Todolist re-render');

    const filteredTasks = localState.currentFilter.value !== TaskFilter.All
        ? localState.tasks.value.filter(t => localState.currentFilter.value === TaskFilter.Active
            ? t.status === TaskStatuses.New
            : t.status === TaskStatuses.Completed)
        : localState.tasks.value

    filteredTasks.forEach((task) => {
        const taskInstance = liba.create(TaskComponent, {
            task,
            updateTask: localState.updateTaskHandler,
            removeTask: localState.removeTask
        });
        element.append(taskInstance.element);
    });
};
