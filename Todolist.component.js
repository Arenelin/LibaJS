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
        },
        childrenComponents: []
    }

    return {
        element,
        localState
    }
}

TodolistComponent.render = ({element, localState, liba}) => {
    localState.childrenComponents.forEach(cc => cc.cleanup?.())

    const header = document.createElement('h1')
    header.append('Todolist page')
    element.append(header)

    console.log('Todolist re-render')
    localState.tasks.forEach((task, i) => {
        // const alreadyExistedComponent = localState.childrenComponents[i]
        // if (alreadyExistedComponent) {
        //     if (!isSameProps(alreadyExistedComponent.props.task, localState.tasks[i])) {
        //         const newProps = {task: localState.tasks[i], setIsDone: localState.setIsDone}
        //         TaskComponent.render({
        //             element: alreadyExistedComponent.element,
        //             props: newProps
        //         })
        //         localState.childrenComponents.splice(i, 1, {element: alreadyExistedComponent.element, props: newProps})
        //     }
        //     element.append(alreadyExistedComponent.element)
        // } else {
            const taskInstance = liba.create(TaskComponent, {task, setIsDone: localState.setIsDone})
            element.append(taskInstance.element)
            localState.childrenComponents.push(taskInstance)
        // }
    })
}

function isSameProps(prevProps, newProps) {
    if (!(Object.keys(prevProps).length === Object.keys(newProps).length)) {
        return false
    }
    if (prevProps !== newProps) {
        return false
    }
    const prevValues = Object.values(prevProps)
    const newValues = Object.values(newProps)

    for (let i = 0; i < newValues; i++) {
        if (prevValues[i] !== newValues[i]) {
            return false
        }
    }
    return true
}

