import {TaskComponent} from "./Task.component.js";

export function TodolistComponent(_, {liba}) {
    const element = document.createElement('ul')
    console.log('Todolist mount')

    const localState = {
        tasks: [
            {id: 1, title: 'JavaScript', isDone: true},
            {id: 2, title: 'React', isDone: true},
            {id: 3, title: 'C++', isDone: false},
        ],
        setIsDone: (id, newIsDoneValue) => {
            localState.tasks = localState.tasks
                .map(t => t.id === id
                    ? {...t, isDone: newIsDoneValue}
                    : t)
            liba.refresh()
        }
    }

    return {
        element,
        localState
    }
}

TodolistComponent.render = ({element, localState, liba}) => {
    const header = document.createElement('h1')
    header.append('Todolist page')
    element.append(header)

    console.log('Todolist re-render')
    localState.tasks.forEach((task) =>
        element.append(liba.create(TaskComponent, {task, setIsDone: localState.setIsDone}).element))
}
