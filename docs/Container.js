import { Display } from "./Display.js";
import { Event, MouseClickEvent, MouseEnterEvent, MouseExitEvent, } from "./Event.js";
import { LayoutView } from "./View.js";
export class Container extends LayoutView {
    constructor(config) {
        super(config);
        this.children = [];
        if (config.children)
            for (let child of config.children) {
                child.parent = this;
            }
        // TODO: other methods
        const parent = this;
        this.children = this.layoutConfig.children;
        this.children.push = function (view) {
            view.parent = parent;
            Array.prototype.push.call(this, view);
            queueMicrotask(() => {
                parent.layout();
                parent.redraw();
            });
            return this.length;
        };
    }
    initStyle(config) {
        var _a, _b, _c, _d, _e, _f;
        return {
            backgroundColor: (_a = config.backgroundColor) !== null && _a !== void 0 ? _a : "rgba(0,0,0,0)",
            borderColor: (_b = config.borderColor) !== null && _b !== void 0 ? _b : "rgba(0,0,0,0)",
            borderWidth: (_c = config.borderWidth) !== null && _c !== void 0 ? _c : [0, 0, 0, 0],
            borderRadius: (_d = config.borderRadius) !== null && _d !== void 0 ? _d : [0, 0, 0, 0],
            shadowcolor: (_e = config.shadowcolor) !== null && _e !== void 0 ? _e : "rgba(0,0,0,0)",
            shadowWidth: (_f = config.shadowWidth) !== null && _f !== void 0 ? _f : [0, 0, 0, 0],
        };
    }
    handle(e) {
        var _a, _b;
        for (let child of this.children) {
            if (child.frame.includes(e.point)) {
                if (!child.frame.includes((_a = Event.previous) === null || _a === void 0 ? void 0 : _a.point)) {
                    child.handle(new MouseEnterEvent(e.point));
                }
                child.handle(e);
            }
            else {
                if (child.frame.includes((_b = Event.previous) === null || _b === void 0 ? void 0 : _b.point)) {
                    child.handle(new MouseExitEvent(e.point));
                }
            }
        }
        if (e instanceof MouseClickEvent && !e.handled) {
            this.layoutConfig.weight++;
            this.layoutConfig.dimension[0]++;
            this.layoutConfig.dimension[1]++;
            e.handled = true;
        }
    }
    layoutChildren() {
        for (let child of this.children) {
            child.visible = child.frame.intersect(this.visible);
            child.layout();
        }
    }
    draw(dirty) {
        var _a;
        const ctx = Display.instance.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
        ctx.clip();
        ctx.fillStyle = (_a = this.styleConfig.backgroundColor) !== null && _a !== void 0 ? _a : "black";
        const { x, y, width, height } = this.frame;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
        for (let child of this.children) {
            const d = dirty.intersect(child.visible);
            if (d)
                child.draw(d);
        }
    }
}
