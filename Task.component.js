export function TaskComponent(props) {
    const element = document.createElement('li')
    console.log('Task mount')

    return {
        element,
        props
    }
}

TaskComponent.render = ({element, props}) => {
    element.append(props.task.title)
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = props.task.isDone
    element.append(checkbox)

    checkbox.addEventListener('change', e => {
        const newIsDoneValue = e.currentTarget.checked
        props.setIsDone(props.task.id, newIsDoneValue)
    })
    console.log('Task re-render')
}
