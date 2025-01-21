import {ComponentLibaParam, RenderParams} from "types";
import {EnumTaskFilter, TaskFilter} from "../enums";

type Props = {
    filterTasks: (filter: EnumTaskFilter) => void
}

export const FilterComponent = ({}, {}: ComponentLibaParam) => {
    const element = document.createElement('div');

    return {
        element
    };
};

FilterComponent.render = ({element, props, liba}: RenderParams<Props>) => {
    const allButton = liba.create('button', {
        children: ['Show all tasks'],
        onClick: () => props.filterTasks(TaskFilter.All)
    })

    element.append(allButton)

    const activeButton = liba.create('button', {
        children: ['Show only active tasks'],
        onClick: () => props.filterTasks(TaskFilter.Active)
    })

    element.append(activeButton)

    const completedButton = liba.create('button', {
        children: ['Show only completed tasks'],
        onClick: () => props.filterTasks(TaskFilter.Completed)
    })

    element.append(completedButton)
    console.log('Filter re-render')
};
