import {ComponentLibaParam, RenderParams} from "types";
import {EnumTaskPriorities, EnumTaskStatuses, TaskEntity, TaskStatuses, UpdateTaskModel} from "./api/tasks";

type Props = {
    task: TaskEntity
    updateTask: (taskId: string, model: UpdateTaskModel) => void
    removeTask: (taskId: string) => void
};

type LocalComponentState = {
    createTaskModel: (task: TaskEntity, objectChange: UpdatedTaskFields) => UpdateTaskModel
}

type UpdatedTaskFields = {
    [key: string]: EnumTaskStatuses | EnumTaskPriorities | string
}

export const TaskComponent = (props: Props, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div')
    console.log('Task mount')
    console.log(liba)

    const createTaskModel = (task: TaskEntity, objectChange: UpdatedTaskFields) => ({
            title: task.title,
            status: task.status,
            deadline: task.deadline,
            description: task.description,
            startDate: task.startDate,
            priority: task.priority,
            ...objectChange,
    })

    return {
        element,
        props,
        localState: {createTaskModel}
    }
}

TaskComponent.render = ({element, localState, props}: RenderParams<LocalComponentState, Props>) => {
    element.append(props.task.title)
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = props.task.status === TaskStatuses.Completed

    const onChangeStatus = (e: Event) => {
        const checkboxHTMLElement = e.currentTarget as HTMLInputElement
        const newIsDoneValue = checkboxHTMLElement.checked
        props.updateTask(props.task.id, localState.createTaskModel(props.task, {
            status: newIsDoneValue
                ? TaskStatuses.Completed
                : TaskStatuses.New
        }))
    }

    checkbox.addEventListener('change', onChangeStatus)
    element.append(checkbox)

    const removeButton = document.createElement('button')
    removeButton.append('X')
    removeButton.addEventListener('click', () => props.removeTask(props.task.id))
    element.append(removeButton)

    console.log('Task re-render')
}
