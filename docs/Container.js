import { View } from "./View.js";
import { Event, MouseEnterEvent, MouseExitEvent, } from "./Event.js";
import { Display } from "./Display.js";
export class Container extends View {
    constructor(config) {
        super(config);
        for (let child of this.children) {
            child.parent = this;
        }
    }
    handle(e) {
        var _a, _b;
        for (let child of this.visibleChildren) {
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
        super.handle(e);
    }
    get visibleChildren() {
        return this.children.filter((c) => c.props.visible);
    }
    layoutChildren() {
        for (let child of this.visibleChildren) {
            child.visible = child.outerFrame.intersect(this.visible);
            child.layout();
        }
    }
    draw(dirty) {
        const ctx = Display.instance.ctx;
        ctx.save();
        super.draw(dirty);
        for (let child of this.visibleChildren) {
            const d = dirty.intersect(child.visible);
            if (d)
                child.draw(d);
        }
        ctx.restore();
    }
    destruct() {
        this.children.forEach((c) => c.destruct());
    }
}
