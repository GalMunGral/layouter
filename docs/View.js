import { Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";
export class View {
    constructor(config) {
        this.frame = new Rect(0, 0, 0, 0);
        this.visible = null;
        this.children = [];
        this._props = {
            dimension: [0, 0],
            margin: [-1, -1, -1, -1],
            weight: 1,
            backgroundColor: "rgba(0,0,0,0)",
            borderColor: "rgba(0,0,0,0)",
            shadowcolor: "rgba(0,0,0,0)",
            borderWidth: [0, 0, 0, 0],
            borderRadius: [0, 0, 0, 0],
            shadowWidth: [0, 0, 0, 0],
            padding: [4, 4, 4, 4],
            font: "Computer Modern",
            size: 16,
            color: "black",
        };
        if (config.children) {
            this.children = config.children;
            delete config.children;
        }
        for (let key of Object.keys(config)) {
            const init = config[key];
            if (init instanceof Observable) {
                this._props[key] = init;
                init.subscribe((v) => {
                    this.props[key] = v;
                });
            }
            else if (config[key]) {
                this._props[key] = init;
            }
        }
    }
    get props() {
        const view = this;
        return new Proxy(this._props, {
            set(target, prop, value, receiver) {
                var _a, _b;
                if (value == Reflect.get(target, prop, receiver))
                    return true;
                try {
                    return Reflect.set(target, prop, value, receiver);
                }
                finally {
                    if (prop == "dimension" || prop == "margin" || prop == "weight") {
                        (_a = view.parent) === null || _a === void 0 ? void 0 : _a.layout();
                    }
                    (_b = view.parent) === null || _b === void 0 ? void 0 : _b.redraw();
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
