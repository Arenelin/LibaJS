import {TodolistEntity} from "./api/todolists";
import {createTask, deleteTask, getTasks, TaskEntity, TaskStatuses, updateTask, UpdateTaskModel} from "./api/tasks";
import {ComponentLibaParam, LocalState, RenderParams} from "./types";
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
    const tasksState = liba.useObservable<TaskEntity[]>({value: []})
    liba.useObservable({value: ''})
    liba.useObservable<EnumTaskFilter>({value: TaskFilter.All})

    console.log('Todolist mount');

    (async function () {
        const tasks = await getTasks(props.todolist.id)
        tasks.forEach(t => tasksState.value.push(t))
    })()

    return {
        element
    };
};

TodolistComponent.render = ({element, props, liba, proxyWithWrappers}: RenderParams<Props>) => {
    const FIRST_STATE_INDEX = 0
    const SECOND_STATE_INDEX = 1
    const THIRD_STATE_INDEX = 2

    const tasksState = proxyWithWrappers[FIRST_STATE_INDEX] as LocalState<TaskEntity[]>
    const newTaskTitleState = proxyWithWrappers[SECOND_STATE_INDEX] as LocalState<string>
    const currentFilterState = proxyWithWrappers[THIRD_STATE_INDEX] as LocalState<EnumTaskFilter>


    const createNewTask = async () => {
        if (newTaskTitleState.value.length > 0 && newTaskTitleState.value.trim()) {
            const newTask = await createTask({todolistId: props.todolist.id, title: newTaskTitleState.value})
            newTaskTitleState.value = ''
            tasksState.value.unshift(newTask)
        }
    }

    const updateTaskHandler = async (taskId: string, model: UpdateTaskModel) => {
        await updateTask({todolistId: props.todolist.id, taskId, model})
        const prevTask = tasksState.value.find(t => t.id === taskId)
        if (prevTask) {
            const prevTaskIndex = tasksState.value.indexOf(prevTask)
            const updatedTask = {...prevTask, ...model}
            tasksState.value.splice(prevTaskIndex, 1, updatedTask)
        }
    }

    const removeTask = async (taskId: string) => {
        await deleteTask({todolistId: props.todolist.id, taskId})
        const deletedTask = tasksState.value.find(t => t.id === taskId)
        if (deletedTask) {
            const deletedTaskIndex = tasksState.value.indexOf(deletedTask)
            tasksState.value.splice(deletedTaskIndex, 1)
        }
    }

    const filterTasks = (filterValue: EnumTaskFilter) => {
        currentFilterState.value = filterValue
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
    input.value = newTaskTitleState.value

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        newTaskTitleState.value = inputHTMLElement.value
    }

    input.addEventListener('change', onChangeHandler)
    element.append(input)

    const button = document.createElement('button')
    button.append('Create new task')

    button.addEventListener('click', createNewTask)
    element.append(button)

    console.log('Todolist re-render');

    const filteredTasks = currentFilterState.value !== TaskFilter.All
        ? tasksState.value.filter((t: TaskEntity) => currentFilterState.value === TaskFilter.Active
            ? t.status === TaskStatuses.New
            : t.status === TaskStatuses.Completed)
        : tasksState.value

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
