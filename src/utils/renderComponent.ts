import {RenderComponentParams} from "../types";

export function renderComponent<S, P extends object>(
    {
        ComponentFunction,
        componentInstance,
        renderLiba,
        statesWithWrappers,
        proxyWithWrappers,
        signals
    }: RenderComponentParams<S, P>) {

    ComponentFunction.render({
        element: componentInstance.element,
        props: (componentInstance.props) as P,
        liba: renderLiba,
        proxyWithWrappers,
        statesWithWrappers,
        signals
    })
}
