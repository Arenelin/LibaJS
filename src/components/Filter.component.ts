import {ComponentLibaParam, RenderParams} from "types";
import {EnumTaskFilter, TaskFilter} from "../enums";

type Props = {
    filterTasks: (filter: EnumTaskFilter) => void
}

export const FilterComponent = ({}, {liba}: ComponentLibaParam) => {
    liba.createElement('div');

    console.log('Filter mount');

    return {};
};

FilterComponent.render = ({props, liba}: RenderParams<Props>) => {
    liba.create('button', {
        children: ['Show all tasks'],
        onClick: () => props.filterTasks(TaskFilter.All)
    })

    liba.create('button', {
        children: ['Show only active tasks'],
        onClick: () => props.filterTasks(TaskFilter.Active)
    })

    liba.create('button', {
        children: ['Show only completed tasks'],
        onClick: () => props.filterTasks(TaskFilter.Completed)
    })

    console.log('Filter re-render')
};
