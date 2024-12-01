import {ComponentLibaParam, RenderParams} from "types";
import {TaskProps} from "./Todolist.component";

export const TaskComponent = ({liba}: ComponentLibaParam, props: TaskProps) => {
    const element = document.createElement('li')
    console.log('Task mount')
    console.log(liba)

    return {
        element,
        props
    }
}

TaskComponent.render = ({element, props}: RenderParams<TaskProps>) => {
    element.append(props.task.title)
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = props.task.isDone
    element.append(checkbox)

    const onChangeIsDoneValue = (e: Event) => {
        const checkboxHTMLElement = e.currentTarget as HTMLInputElement
        const newIsDoneValue = checkboxHTMLElement.checked
        props.setIsDone(props.task.id, newIsDoneValue)
    }

    checkbox.addEventListener('change', onChangeIsDoneValue)
    console.log('Task re-render')
}
