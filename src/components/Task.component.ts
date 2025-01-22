import {ComponentLibaParam, RenderParams} from "types";
import {EnumTaskPriorities, EnumTaskStatuses, TaskStatuses} from "../enums";
import {TaskEntity, UpdateTaskModel} from "../api";

type Props = {
    task: TaskEntity
    updateTask: (taskId: string, model: UpdateTaskModel) => void
    removeTask: (taskId: string) => void
};

type UpdatedTaskFields = {
    [key: string]: EnumTaskStatuses | EnumTaskPriorities | string
}

export const TaskComponent = ({}, {liba}: ComponentLibaParam) => {
    liba.createElement('div')
    console.log('Task mount')

    return {}
}

TaskComponent.render = ({props, liba}: RenderParams<Props>) => {
    liba.create('span', {
        children: [props.task.title]
    })

    const onChangeStatus = (e: Event) => {
        const checkboxHTMLElement = e.currentTarget as HTMLInputElement
        const newIsDoneValue = checkboxHTMLElement.checked
        props.updateTask(props.task.id, createTaskModel(props.task, {
            status: newIsDoneValue
                ? TaskStatuses.Completed
                : TaskStatuses.New
        }))
    }

    liba.create('input', {
        type: 'checkbox',
        checked: props.task.status === TaskStatuses.Completed,
        onChange: onChangeStatus
    })

    const createTaskModel = (task: TaskEntity, objectChange: UpdatedTaskFields) => ({
        title: task.title,
        status: task.status,
        deadline: task.deadline,
        description: task.description,
        startDate: task.startDate,
        priority: task.priority,
        ...objectChange,
    })

    liba.create('button', {
        children: ['X'],
        onClick: () => props.removeTask(props.task.id)
    })

    console.log('Task re-render')
}
