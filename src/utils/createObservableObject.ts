import {LocalState} from "../types";

export function createObservableObject<S>(dto: LocalState<S>, onChange: () => void): LocalState<S> {
    function createProxy<T extends object>(target: T): T {
        let scheduled = false;

        function scheduleCallback() {
            if (!scheduled) {
                scheduled = true;
                Promise.resolve().then(() => {
                    onChange();
                    scheduled = false;
                });
            }
        }

        return new Proxy(target, {
            set(obj, prop, value, receiver) {
                if (value && typeof value === 'object') {
                    value = createProxy(value);
                }

                if (obj[prop as keyof T] !== value) {
                    obj[prop as keyof T] = value;
                    scheduleCallback();
                }
                return Reflect.set(obj, prop, value, receiver)
            },
            get(obj, prop) {
                if (prop in obj) {
                    const value = obj[prop as keyof T];
                    if (Array.isArray(value)) {
                        return new Proxy(value, {
                            set(arr, index, newValue, receiver) {
                                if (newValue && typeof newValue === 'object') {
                                    newValue = createProxy(newValue);
                                }
                                scheduleCallback();
                                return Reflect.set(arr, index, newValue, receiver)
                            },
                            deleteProperty(arr, index) {
                                scheduleCallback();
                                return Reflect.deleteProperty(arr, index)
                            },
                        });
                    }
                    return value;
                }
                return undefined;
            },
        });
    }

    return createProxy(dto);
}
