import {ComponentLibaParam, LocalState, RenderParams} from "types";
import {TodolistEntity} from "./Todolists.component";
import {getTasks} from "./api/tasks";

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
}

export const TodolistComponent = (props: Props, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    const [localState, setLocalState] = liba.useState<TaskEntity[]>([])

    console.log('Todolist mount');


    console.log('TODO!', props.todolist);
    console.log('TASKS!', localState);

    (function () {
        getTasks(props.todolist.id).then(r => setLocalState(r))
    })()


    return {
        element,
        localState,
        props
    };
};

TodolistComponent.render = ({element, props}: RenderParams<Props, LocalState<TaskEntity[]>>) => {
    const title = document.createElement('h2');
    title.append(props.todolist.title);
    element.append(title);

    console.log('Todolist re-render');

    // localState.value.forEach((task) => {
    //     const taskInstance = liba.create(TaskComponent, {task});
    //     element.append(taskInstance.element);
    // });
};
