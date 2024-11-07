import {CounterComponent} from "./Counter.component.js";
import {TodolistComponent} from "./Todolist.component.js";

export function AppComponent() {
    const element = document.createElement('div')
    const localState = {
        currentPage: 'todolist',
        childrenComponents: []
    }

    console.log('App mount')

    return {
        element,
        localState
    }
}

AppComponent.render = ({element, localState, liba}) => {
    localState.childrenComponents.forEach(cc => cc.cleanup?.())
    localState.childrenComponents = []

    const pageSelector = document.createElement('select')
    const counterPageOption = document.createElement('option')
    counterPageOption.value = 'counter'
    counterPageOption.append('Counter page')

    const todolistPageOption = document.createElement('option')
    todolistPageOption.value = 'todolist'
    todolistPageOption.append('Todolist page')
    pageSelector.append(counterPageOption, todolistPageOption)

    pageSelector.addEventListener('change', e => {
        localState.currentPage = e.target.value
        liba.refresh()
    })
    pageSelector.value = localState.currentPage
    element.append(pageSelector)

    console.log('App re-render')

    switch (localState.currentPage) {
        case 'counter': {
            const counterInstance = liba.create(CounterComponent)
            localState.childrenComponents.push(counterInstance)
            element.append(counterInstance.element)
            break
        }
        case 'todolist': {
            const todolistInstance = liba.create(TodolistComponent)
            localState.childrenComponents.push(todolistInstance)
            element.append(todolistInstance.element)
            break
        }
    }
}
