import {ComponentLibaParam, RenderParams} from "types";
import {TaskEntity} from "./Todolist.component";

type Props = {
    task: TaskEntity;
};

export const TaskComponent = (props: Props, {liba}: ComponentLibaParam, ) => {
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
    checkbox.checked = props.task.completed
    element.append(checkbox)

    // const onChangeIsDoneValue = (e: Event) => {
        // const checkboxHTMLElement = e.currentTarget as HTMLInputElement
        // const newIsDoneValue = checkboxHTMLElement.checked
        // props.setIsDone(props.task.id, newIsDoneValue)
    // }
    //
    // checkbox.addEventListener('change', onChangeIsDoneValue)
    console.log('Task re-render')
}
