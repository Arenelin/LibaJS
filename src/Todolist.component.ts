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

export const TodolistComponent = ({todolist}: Props, {liba}: ComponentLibaParam) => {
    const element = document.createElement('ul');
    const [localState, setLocalState] = liba.useState<TaskEntity[]>([])

    console.log('Todolist mount');


    console.log('TODO!', todolist);
    console.log('TASKS!', localState);

    (function () {
        getTasks(todolist.id).then(r => setLocalState(r))
    })()

    const renderProps = {
        todolist
    }

    return {
        element,
        localState,
        props: renderProps
    };
};

TodolistComponent.render = ({element}: RenderParams<Props, LocalState<TaskEntity[]>>) => {
    const header = document.createElement('h1');
    header.append('Todolist page');
    element.append(header);

    console.log('Todolist re-render');

    // localState.value.forEach((task) => {
    //     const taskInstance = liba.create(TaskComponent, {task, setIsDone: props.setIsDone});
    //     element.append(taskInstance.element);
    // });
};
