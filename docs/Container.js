import { View } from "./View.js";
import { Event, MouseClickEvent, MouseEnterEvent, MouseExitEvent, } from "./Event.js";
export class Container extends View {
    constructor(config) {
        super(config);
        for (let child of this.children) {
            child.parent = this;
        }
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
            this.props.weight++;
            this.props.dimension[0]++;
            this.props.dimension[1]++;
            e.handled = true;
        }
    }
    layoutChildren() {
        for (let child of this.children) {
            child.visible = child.outerFrame.intersect(this.visible);
            child.layout();
        }
    }
    draw(dirty) {
        super.draw(dirty);
        for (let child of this.children) {
            const d = dirty.intersect(child.visible);
            if (d)
                child.draw(d);
        }
    }
    destruct() {
        this.children.forEach((c) => c.destruct());
    }
}
