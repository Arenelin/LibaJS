export const createHtmlElement = (tagName: string, props: any) => {
    const element = document.createElement(tagName)

    Object.keys(props).forEach(key => {
        if (key.startsWith('on') && typeof props[key] === 'function') {
            // Extract event name (e.g. 'click' from 'onClick'
            const event = key.slice(2).toLowerCase()
            element.addEventListener(event, props[key])
        } else {
            element.setAttribute(key, props[key])
        }
    })

    return element
}
