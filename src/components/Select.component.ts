import {ComponentLibaParam, Option, RenderParams} from "types";

type Props = {
    options: Option[]
    value: string
    onChange: (e: Event) => void
};

export const SelectComponent = (props: Props, {liba}: ComponentLibaParam) => {
    liba.createElement('select', {
        onChange: props.onChange
    });

    return {};
};

SelectComponent.render = ({element, liba, props}: RenderParams<Props>) => {
    props.options.forEach(o=> {
        liba.create('option', {
            value: o.value,
            children: [o.title]
        });
    });

    // Special case for <select> value, as you need to create options first and only then assign a value
    (element as HTMLSelectElement).value = props.value
};
