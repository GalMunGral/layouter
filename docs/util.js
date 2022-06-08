export function createElement(type, props, ...children) {
    return new type(Object.assign(Object.assign({}, props), { children }));
}
