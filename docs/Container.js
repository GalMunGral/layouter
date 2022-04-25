import { MouseEnterEvent, MouseExitEvent } from "./Event.js";
import { View } from "./View.js";
export class Container extends View {
    constructor(config, children = []) {
        super(config);
        this.children = children;
    }
    handle(event) {
        var _a, _b;
        for (let child of this.children) {
            if (child.frame.includes(event.point)) {
                if (!child.frame.includes((_a = this.previousEvent) === null || _a === void 0 ? void 0 : _a.point)) {
                    child.handle(new MouseEnterEvent(event.point));
                }
                child.handle(event);
            }
            else {
                if (child.frame.includes((_b = this.previousEvent) === null || _b === void 0 ? void 0 : _b.point)) {
                    child.handle(new MouseExitEvent(event.point));
                }
            }
        }
        this.previousEvent = event;
    }
    draw(dirty = null) {
        super.draw(dirty);
        dirty = this.frame.intersection(dirty);
        for (let child of this.children) {
            child.draw(dirty);
        }
    }
}
