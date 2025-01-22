import {ComponentLibaParam, RenderParams, WritableSignal} from "types";
import {EnumItem} from "../enums";

type Props = {
    createNewItem: (itemTitle: string) => void
    item: EnumItem
}

export const AddItemFormComponent = ({}, {liba}: ComponentLibaParam) => {
    liba.createElement('div');
    liba.signal('')

    console.log('AddItemForm mount');

    return {};
};

AddItemFormComponent.render = ({signals, props, liba}: RenderParams<Props>) => {
    const FIRST_SIGNAL_INDEX = 0

    console.log('AddItemForm re-render')

    const itemTitle = signals[FIRST_SIGNAL_INDEX] as WritableSignal<string>

    const onChangeHandler = (e: Event) => {
        const inputHTMLElement = e.currentTarget as HTMLInputElement
        itemTitle.set(inputHTMLElement.value)
    }

    liba.create('input', {
        onChange: onChangeHandler,
        value: itemTitle()
    })

    const createItem = () => {
        if (itemTitle().length > 0 && itemTitle().trim()) {
            props.createNewItem(itemTitle())
            itemTitle.set('')
        }
    }

    liba.create('button', {
        children: [`Create new ${props.item}`],
        onClick: createItem
    })
};
