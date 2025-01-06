import {ComponentLibaParam, RenderParams} from "types";
import {EnumTaskFilter, TaskFilter} from "./Todolist.component";

type Props = {
    filterTasks: (filter: EnumTaskFilter) => void
}

export const FilterComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    liba.signal('')

    return {
        element
    };
};

FilterComponent.render = ({element, props}: RenderParams<Props>) => {
    const allButton = document.createElement('button')
    allButton.append('Show all tasks')
    allButton.addEventListener('click', () => props.filterTasks(TaskFilter.All))
    element.append(allButton)

    const activeButton = document.createElement('button')
    activeButton.append('Show only active tasks')
    activeButton.addEventListener('click', () => props.filterTasks(TaskFilter.Active))
    element.append(activeButton)

    const completedButton = document.createElement('button')
    completedButton.append('Show only completed tasks')
    completedButton.addEventListener('click', () => props.filterTasks(TaskFilter.Completed))
    element.append(completedButton)
};
