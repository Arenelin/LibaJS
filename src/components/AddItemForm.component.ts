import {ComponentLibaParam, RenderParams, WritableSignal} from "types";
import {EnumItem} from "../enums";

type Props = {
    createNewItem: (itemTitle: string) => void
    item: EnumItem
}

export const AddItemFormComponent = ({}, {liba}: ComponentLibaParam) => {
    const element = document.createElement('div');
    liba.signal('')

    return {
        element
    };
};

AddItemFormComponent.render = ({element, signals, props, liba}: RenderParams<Props>) => {
    const FIRST_SIGNAL_INDEX = 0

    console.log('AddItemForm re-render')

    const itemTitle = signals[FIRST_SIGNAL_INDEX] as WritableSignal<string>

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        itemTitle.set(inputHTMLElement.value)
    }

    const titleInput = liba.create('input', {
        onChange: onChangeHandler,
        value: itemTitle()
    })

    element.append(titleInput)

    const createItem = () => {
        if (itemTitle().length > 0 && itemTitle().trim()) {
            props.createNewItem(itemTitle())
            itemTitle.set('')
        }
    }
    const addButton = liba.create('button', {
        children: [`Create new ${props.item}`],
        onClick: createItem
    })

    element.append(addButton)
};
