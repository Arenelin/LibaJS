import {ComponentLibaParam, Dispatch, LocalState, RenderParams, SetStateAction} from "types";
import {TodolistEntity} from "./Todolists.component";
import {createTask, getTasks} from "./api/tasks";
import {TaskComponent} from "./Task.component";

export type TaskEntity = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
};

type Props = {
    todolist: TodolistEntity
    removeTodolist: (id: string) => void
}

type TodolistComponentLocalState = {
    tasks: LocalState<TaskEntity[]>
    taskTitle: LocalState<string>
    setTaskTitle: Dispatch<SetStateAction<string>>
    createNewTask: () => void
}

export const TodolistComponent = (props: Props, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [tasks, setTasks] = liba.useState<TaskEntity[]>([])
    const [taskTitle, setTaskTitle] = liba.useState('')

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

    return {
        element,
        localState: {tasks, createNewTask, setTaskTitle, taskTitle},
        props
    };
};

TodolistComponent.render = ({element, props, localState, liba}: RenderParams<Props, TodolistComponentLocalState>) => {
    const title = document.createElement('h2');
    title.append(props.todolist.title);
    element.append(title);

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

    localState.tasks.value.forEach((task) => {
        const taskInstance = liba.create(TaskComponent, {task});
        element.append(taskInstance.element);
    });
    console.log(localState.tasks.value)
};
