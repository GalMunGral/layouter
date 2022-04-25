import { Display } from "./Display.js";
import { Rect } from "./Geometry.js";
export class View {
    constructor(config, children = []) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.children = children;
        this.frame = new Rect(0, 0, 0, 0);
        this.config = {
            dimensions: (_a = config.dimensions) !== null && _a !== void 0 ? _a : [0, 0],
            margin: (_b = config.margin) !== null && _b !== void 0 ? _b : [-1, -1, -1, -1],
            weight: (_c = config.weight) !== null && _c !== void 0 ? _c : 1,
            backgroundColor: (_d = config.backgroundColor) !== null && _d !== void 0 ? _d : "rgba(0,0,0,0)",
            borderColor: (_e = config.borderColor) !== null && _e !== void 0 ? _e : "rgba(0,0,0,0)",
            borderRadius: (_f = config.borderRadius) !== null && _f !== void 0 ? _f : [0, 0, 0, 0],
            borderWidth: (_g = config.borderWidth) !== null && _g !== void 0 ? _g : [0, 0, 0, 0],
            shadowcolor: (_h = config.shadowcolor) !== null && _h !== void 0 ? _h : "rgba(0,0,0,0)",
            shadowWidth: (_j = config.shadowWidth) !== null && _j !== void 0 ? _j : [0, 0, 0, 0],
        };
    }
    handle(e) { }
    layout() { }
    draw(dirty = null) {
        var _a;
        const clip = this.frame.intersection(dirty);
        if (!clip)
            return;
        const ctx = Display.instance.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.rect(clip.x, clip.y, clip.width, clip.height);
        ctx.clip();
        ctx.fillStyle = (_a = this.config.backgroundColor) !== null && _a !== void 0 ? _a : "black";
        const { x, y, width, height } = this.frame;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
    }
}
