import { Display } from "./Display.js";
import { Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";
import { Scroll } from "./Scroll.js";
export class View {
    constructor(config) {
        this.frame = new Rect(0, 0, 0, 0);
        this.visible = null;
        this.children = [];
        this._props = {
            dimension: [0, 0],
            margin: [0, 0, 0, 0],
            weight: 1,
            backgroundColor: [0, 0, 0, 0],
            borderColor: [0, 0, 0, 0],
            shadowcolor: [0, 0, 0, 0],
            borderWidth: [0, 0, 0, 0],
            borderRadius: [0, 0, 0, 0],
            shadowWidth: [0, 0, 0, 0],
            padding: [4, 4, 4, 4],
            font: "Computer Modern",
            size: 16,
            color: [0, 0, 0, 1],
        };
        if (config.children) {
            this.children = config.children;
            delete config.children;
        }
        for (let key of Object.keys(config)) {
            const init = config[key];
            if (init instanceof Observable) {
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
                if (value == Reflect.get(target, prop, receiver))
                    return true;
                try {
                    return Reflect.set(target, prop, value, receiver);
                }
                finally {
                    if (view) {
                        if (prop == "dimension" || prop == "margin" || prop == "weight") {
                            let cur = view;
                            const root = Display.instance.root;
                            while (cur != root && !(cur instanceof Scroll))
                                cur = cur.parent;
                            queueMicrotask(() => {
                                cur.layout();
                                cur.redraw();
                            });
                        }
                        else {
                            queueMicrotask(() => {
                                view.redraw();
                            });
                        }
                    }
                }
            },
        });
    }
    redraw() {
        if (this.visible) {
            Display.instance.root.draw(this.visible);
        }
    }
    destruct() { }
}
