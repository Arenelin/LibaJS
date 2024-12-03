import {ComponentLibaParam, LocalState, RenderParams} from "types";
import {TaskComponent} from "./Task.component";

export type TaskEntity = {
    id: number;
    title: string;
    isDone: boolean;
};

type Props = {
    setIsDone: (id: number, newIsDoneValue: boolean) => void;
}

export const TodolistComponent = ({liba}: ComponentLibaParam) => {
    const element = document.createElement('ul');
    const [localState, setLocalState] = liba.useState<TaskEntity[]>([
        {id: 1, title: 'JavaScript', isDone: true},
        {id: 2, title: 'React', isDone: true},
        {id: 3, title: 'C++', isDone: false},
    ])

    console.log('Todolist mount');

    const setIsDone = (id: number, newIsDoneValue: boolean) => {
        setLocalState(localState.value.map(t =>
            t.id === id
                ? {...t, isDone: newIsDoneValue}
                : t
        ))
    }

    const renderProps = {
        setIsDone
    }

    return {
        element,
        localState,
        props: renderProps
    };
};

TodolistComponent.render = ({element, localState, liba, props}: RenderParams<Props, LocalState<TaskEntity[]>>) => {
    const header = document.createElement('h1');
    header.append('Todolist page');
    element.append(header);

    console.log('Todolist re-render');

    localState.value.forEach((task) => {
        const taskInstance = liba.create(TaskComponent, {task, setIsDone: props.setIsDone});
        element.append(taskInstance.element);
    });
};
