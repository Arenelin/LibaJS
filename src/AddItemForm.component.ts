import {ComponentLibaParam, RenderParams, WritableSignal} from "types";

type Props = {
    createNewItem: (itemTitle: string) => void
    item: EnumItem
}

export const Item = {
    Todolist: 'todolist',
    Task: 'task'
} as const

type EnumItem = (typeof Item)[keyof typeof Item]

export const AddItemFormComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    liba.signal('')

    return {
        element
    };
};

AddItemFormComponent.render = ({element, signals, props}: RenderParams<Props>) => {
    const FIRST_SIGNAL_INDEX = 0

    const itemTitle = signals[FIRST_SIGNAL_INDEX] as WritableSignal<string>

    const titleInput = document.createElement('input')
    titleInput.value = itemTitle()

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        itemTitle.set(inputHTMLElement.value)
    }

    titleInput.addEventListener('change', onChangeHandler)

    element.append(titleInput)

    const addButton = document.createElement('button')
    addButton.append(`Create new ${props.item}`)

    const createItem = () => {
        if (itemTitle().length > 0 && itemTitle().trim()) {
            props.createNewItem(itemTitle())
            itemTitle.set('')
        }
    }

    addButton.addEventListener('click', createItem)
    element.append(addButton)
};
