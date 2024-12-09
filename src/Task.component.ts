import {ComponentLibaParam, RenderParams} from "types";
import {TaskEntity} from "./Todolist.component";

type Props = {
    task: TaskEntity;
    setIsDone: (id: number, newIsDoneValue: boolean) => void;
};

export const TaskComponent = (props: Props, {liba}: ComponentLibaParam, ) => {
    const element = document.createElement('li')
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
