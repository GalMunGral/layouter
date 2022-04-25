import { Display } from "./Display.js";
import { Rect } from "./Geometry.js";
export class View {
    constructor(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.frame = new Rect(0, 0, 0, 0);
        this.visible = null;
        const _config = {
            dimension: (_a = config.dimension) !== null && _a !== void 0 ? _a : [0, 0],
            margin: (_b = config.margin) !== null && _b !== void 0 ? _b : [-1, -1, -1, -1],
            weight: (_c = config.weight) !== null && _c !== void 0 ? _c : 1,
            backgroundColor: (_d = config.backgroundColor) !== null && _d !== void 0 ? _d : "rgba(0,0,0,0)",
            borderColor: (_e = config.borderColor) !== null && _e !== void 0 ? _e : "rgba(0,0,0,0)",
            borderRadius: (_f = config.borderRadius) !== null && _f !== void 0 ? _f : [0, 0, 0, 0],
            borderWidth: (_g = config.borderWidth) !== null && _g !== void 0 ? _g : [0, 0, 0, 0],
            shadowcolor: (_h = config.shadowcolor) !== null && _h !== void 0 ? _h : "rgba(0,0,0,0)",
            shadowWidth: (_j = config.shadowWidth) !== null && _j !== void 0 ? _j : [0, 0, 0, 0],
        };
        this.config = this.observe(_config);
    }
    observe(config) {
        const view = this;
        return new Proxy(config, {
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
                        (_b = view.parent) === null || _b === void 0 ? void 0 : _b.redraw();
                    }
                    else {
                        view.redraw();
                    }
                }
            },
        });
    }
    redraw() {
        if (this.visible) {
            this.draw(this.visible);
        }
    }
    handle(e) { }
    layout() { }
    draw(dirty) {
        var _a;
        const ctx = Display.instance.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
        ctx.clip();
        ctx.fillStyle = (_a = this.config.backgroundColor) !== null && _a !== void 0 ? _a : "black";
        const { x, y, width, height } = this.frame;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
    }
}
