import {ComponentLibaParam, Dispatch, RenderParams, SetStateAction} from "types";
import {createTask, deleteTask, getTasks, TaskEntity, TaskStatuses, updateTask, UpdateTaskModel} from "./api/tasks";
import {TaskComponent} from "./Task.component";
import {TodolistEntity} from "./api/todolists";

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
    const [, setTasks] = liba.useState<TaskEntity[]>([])
    liba.useState('')
    liba.useState<EnumTaskFilter>(TaskFilter.All)

    console.log('Todolist mount');

    (async function () {
        const tasks = await getTasks(props.todolist.id)
        setTasks(tasks)
    })()

    return {
        element,
        props
    };
};

TodolistComponent.render = ({element, props, liba, statesWithWrappers}: RenderParams<Props>) => {
    const [tasks, setTasks] = statesWithWrappers[0] as [TaskEntity[], Dispatch<SetStateAction<TaskEntity[]>>]
    const [newTaskTitle, setNewTaskTitle] = statesWithWrappers[1] as [string, Dispatch<SetStateAction<string>>]
    const [currentFilter, setCurrentFilter] = statesWithWrappers[2] as [EnumTaskFilter, Dispatch<SetStateAction<EnumTaskFilter>>]

    const createNewTask = async () => {
        if (newTaskTitle.length > 0 && newTaskTitle.trim()) {
            const newTask = await createTask({todolistId: props.todolist.id, title: newTaskTitle})
            setNewTaskTitle('')
            setTasks([newTask, ...tasks])
        }
    }

    const updateTaskHandler = async (taskId: string, model: UpdateTaskModel) => {
        await updateTask({todolistId: props.todolist.id, taskId, model})
        setTasks(tasks.map((t: TaskEntity) => t.id === taskId ? {...t, ...model} : t))
    }

    const removeTask = async (taskId: string) => {
        await deleteTask({todolistId: props.todolist.id, taskId})
        setTasks(tasks.filter((t: TaskEntity) => t.id !== taskId))
    }

    const filterTasks = (filterValue: EnumTaskFilter) => {
        setCurrentFilter(filterValue)
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
    input.value = newTaskTitle

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        const newTitleValue = inputHTMLElement.value
        setNewTaskTitle(newTitleValue)
    }

    input.addEventListener('change', onChangeHandler)
    element.append(input)

    const button = document.createElement('button')
    button.append('Create new task')

    button.addEventListener('click', createNewTask)
    element.append(button)

    console.log('Todolist re-render');

    const filteredTasks = currentFilter !== TaskFilter.All
        ? tasks.filter((t: TaskEntity) => currentFilter === TaskFilter.Active
            ? t.status === TaskStatuses.New
            : t.status === TaskStatuses.Completed)
        : tasks

    filteredTasks.forEach((task: TaskEntity) => {
        const taskInstance = liba.create(TaskComponent, {
            task,
            updateTask: updateTaskHandler,
            removeTask
        });
        element.append(taskInstance.element);
    });
};
