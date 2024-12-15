import {ComponentLibaParam, RenderParams} from "types";
import {TaskEntity} from "./Todolist.component";
import {EnumTaskPriorities, EnumTaskStatuses, TaskStatuses, UpdateTaskModel} from "./api/tasks";

type Props = {
    task: TaskEntity
    updateTask: (taskId: string, model: UpdateTaskModel) => void
    removeTask: (taskId: string) => void
};

export type NewValueType = {
    [key: string]: EnumTaskStatuses | EnumTaskPriorities | string
}

export const createTaskModel = (task: TaskEntity, objectChange: NewValueType): UpdateTaskModel => {
    return {
        title: task.title,
        status: task.status,
        deadline: task.deadline,
        description: task.description,
        startDate: task.startDate,
        priority: task.priority,
        ...objectChange,
    }
}


export const TaskComponent = (props: Props, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div')
    console.log('Task mount')
    console.log(liba)

    return {
        element,
        props
    }
}

TaskComponent.render = ({element, props}: RenderParams<Props>) => {
    element.append(props.task.title)
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = props.task.status === TaskStatuses.Completed
    element.append(checkbox)

    const removeButton = document.createElement('button')
    removeButton.append('X')
    removeButton.addEventListener('click', () => props.removeTask(props.task.id))
    element.append(removeButton)

    const onChangeStatus = (e: Event) => {
        const checkboxHTMLElement = e.currentTarget as HTMLInputElement
        const newIsDoneValue = checkboxHTMLElement.checked
        props.updateTask(props.task.id, createTaskModel(props.task, {
            status: newIsDoneValue
                ? TaskStatuses.Completed
                : TaskStatuses.New
        }))
    }

    checkbox.addEventListener('change', onChangeStatus)
    console.log('Task re-render')
}
