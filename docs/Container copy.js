import { Event, MouseClickEvent, MouseEnterEvent, MouseExitEvent, } from "./Event.js";
import { LayoutView } from "./LayoutView.js";
export class Container extends LayoutView {
    constructor(config, children = []) {
        super(config);
        this.children = children;
        for (let child of children) {
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
        super.draw(dirty);
        for (let child of this.children) {
            const d = dirty.intersect(child.visible);
            if (d)
                child.draw(d);
        }
    }
}