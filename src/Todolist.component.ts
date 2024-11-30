import {ComponentFunction, ComponentLibaParam, RenderParams} from "./types";
import {TaskComponent} from "./Task.component";

export type Task = {
    id: number;
    title: string;
    isDone: boolean;
};

type TodolistLocalState = {
    tasks: Task[];
    setIsDone: (id: number, newIsDoneValue: boolean) => void;
};

export type TaskProps = {
    task: Task;
    setIsDone: (id: number, newIsDoneValue: boolean) => void;
};


export const TodolistComponent: ComponentFunction<TodolistLocalState> = ({ liba }: ComponentLibaParam) => {
    const element = document.createElement('ul');
    console.log('Todolist mount');

    const localState: TodolistLocalState = {
        tasks: [
            { id: 1, title: 'JavaScript', isDone: true },
            { id: 2, title: 'React', isDone: true },
            { id: 3, title: 'C++', isDone: false },
        ],
        setIsDone: (id: number, newIsDoneValue: boolean) => {
            localState.tasks = localState.tasks.map(t =>
                t.id === id
                    ? { ...t, isDone: newIsDoneValue }
                    : t
            );
            liba.refresh();
        },
    };

    return {
        element,
        localState,
    };
};

TodolistComponent.render = ({ element, localState, liba }: RenderParams<TodolistLocalState>) => {
    const header = document.createElement('h1');
    header.append('Todolist page');
    element.append(header);

    console.log('Todolist re-render');

    localState.tasks.forEach((task) => {
        const taskInstance = liba.create<{}, TaskProps>(TaskComponent, { task, setIsDone: localState.setIsDone });
        element.append(taskInstance.element);
    });
};
