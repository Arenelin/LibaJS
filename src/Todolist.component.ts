import {ComponentLibaParam, Dispatch, LocalState, RenderParams, SetStateAction} from "types";
import {TodolistEntity} from "./Todolists.component";
import {
    createTask,
    deleteTask,
    EnumTaskPriorities,
    EnumTaskStatuses,
    getTasks, TaskStatuses,
    updateTask,
    UpdateTaskModel
} from "./api/tasks";
import {TaskComponent} from "./Task.component";

export type TaskEntity = {
    description: string
    title: string
    completed: boolean
    status: EnumTaskStatuses
    priority: EnumTaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
};

type Filter = 'all' | 'active' | 'completed'

type Props = {
    todolist: TodolistEntity
    removeTodolist: (id: string) => void
}

type TodolistComponentLocalState = {
    tasks: LocalState<TaskEntity[]>
    currentFilter: LocalState<Filter>
    taskTitle: LocalState<string>
    setTaskTitle: Dispatch<SetStateAction<string>>
    createNewTask: () => void
    updateTaskHandler: (taskId: string, model: UpdateTaskModel) => void
    removeTask: (taskId: string) => void
    filterTasks: (filterValue: Filter) => void
}

export const TodolistComponent = (props: Props, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [tasks, setTasks] = liba.useState<TaskEntity[]>([])
    const [taskTitle, setTaskTitle] = liba.useState('')
    const [currentFilter, setCurrentFilter] = liba.useState<Filter>('all')

    console.log('Todolist mount');

    (function () {
        getTasks(props.todolist.id).then(r => setTasks(r))
    })()

    const createNewTask = () => {
        if (taskTitle.value.length > 0 && taskTitle.value.trim()) {
            createTask({todolistId: props.todolist.id, title: taskTitle.value})
                .then(newTask => {
                    setTaskTitle('')
                    setTasks([newTask, ...tasks.value])
                })
        }
    }

    const updateTaskHandler = async (taskId: string, model: UpdateTaskModel) => {
        updateTask({
            todolistId: props.todolist.id,
            taskId,
            model,
        }).then(() => setTasks(tasks.value.map(t => t.id === taskId ? {...t, ...model} : t)))
    }

    const removeTask = (taskId: string) => {
        deleteTask({todolistId: props.todolist.id, taskId})
            .then(() => setTasks(tasks.value.filter(t => t.id !== taskId)))
    }

    const filterTasks = (filterValue: Filter) => {
        setCurrentFilter(filterValue)
    }

    return {
        element,
        localState: {
            tasks,
            createNewTask,
            removeTask,
            setTaskTitle,
            taskTitle,
            updateTaskHandler,
            filterTasks,
            currentFilter
        },
        props
    };
};

TodolistComponent.render = ({element, props, localState, liba}: RenderParams<Props, TodolistComponentLocalState>) => {
    const title = document.createElement('h2');
    title.append(props.todolist.title);
    element.append(title);

    const allButton = document.createElement('button')
    allButton.append('Show all tasks')
    allButton.addEventListener('click', () => localState.filterTasks('all'))
    element.append(allButton)

    const activeButton = document.createElement('button')
    activeButton.append('Show only active tasks')
    activeButton.addEventListener('click', () => localState.filterTasks('active'))
    element.append(activeButton)

    const completedButton = document.createElement('button')
    completedButton.append('Show only completed tasks')
    completedButton.addEventListener('click', () => localState.filterTasks('completed'))
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

    const addNewTask = () => {
        input.value = ''
        localState.createNewTask()
    }

    input.addEventListener('change', onChangeHandler)
    element.append(input)

    const button = document.createElement('button')
    button.append('Create new task')
    button.addEventListener('click', addNewTask)
    element.append(button)

    console.log('Todolist re-render');

    const filteredTasks = localState.currentFilter.value !== 'all'
        ? localState.tasks.value.filter(t => localState.currentFilter.value === 'active'
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
    console.log(localState.tasks.value)
};
