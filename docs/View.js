import { Rect } from "./Geometry.js";
export class View {
    constructor(config) {
        this.frame = new Rect(0, 0, 0, 0);
        this.visible = null;
        const view = this;
        this.layoutConfig = new Proxy(this.initLayout(config), {
            set(target, prop, value, receiver) {
                if (value == Reflect.get(target, prop, receiver))
                    return true;
                try {
                    return Reflect.set(target, prop, value, receiver);
                }
                finally {
                    view.layout();
                    view.redraw();
                }
            },
        });
        this.styleConfig = new Proxy(this.initStyle(config), {
            set(target, prop, value, receiver) {
                if (value == Reflect.get(target, prop, receiver))
                    return true;
                try {
                    return Reflect.set(target, prop, value, receiver);
                }
                finally {
                    view.redraw();
                }
            },
        });
    }
    redraw() {
        if (this.visible) {
            this.draw(this.visible);
        }
    }
}
export class LayoutView extends View {
    initLayout(config) {
        var _a, _b, _c, _d;
        const view = this;
        return new Proxy({
            dimension: (_a = config.dimension) !== null && _a !== void 0 ? _a : [0, 0],
            margin: (_b = config.margin) !== null && _b !== void 0 ? _b : [-1, -1, -1, -1],
            weight: (_c = config.weight) !== null && _c !== void 0 ? _c : 1,
            children: (_d = config.children) !== null && _d !== void 0 ? _d : [],
        }, {
            set(target, prop, value, receiver) {
                var _a, _b;
                if (value == Reflect.get(target, prop, receiver))
                    return true;
                try {
                    return Reflect.set(target, prop, value, receiver);
                }
                finally {
                    (_a = view.parent) === null || _a === void 0 ? void 0 : _a.layout();
                    (_b = view.parent) === null || _b === void 0 ? void 0 : _b.redraw();
                }
            },
        });
    }
}
