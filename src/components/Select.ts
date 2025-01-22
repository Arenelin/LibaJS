import {ComponentLibaParam, Option, RenderParams} from "types";

type Props = {
    options: Option[]
    value: string
    onChange: (e: Event) => void
};

export const SelectComponent = (props: Props, {liba}: ComponentLibaParam) => {
    liba.createElement('select', {
        value: props.value,
        onChange: props.onChange
    });

    return {};
};

SelectComponent.render = ({liba, props}: RenderParams<Props>) => {
    props.options.forEach(o=> {
        liba.create('option', {
            value: o.value,
            children: [o.title]
        });
    })
};
