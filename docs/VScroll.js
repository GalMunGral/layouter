import { Container } from "./Container.js";
import { MouseDownEvent, MouseMoveEvent, MouseUpEvent, } from "./Event.js";
export class VScroll extends Container {
    constructor() {
        super(...arguments);
        this.offset = 0;
        this.maxOffset = 0;
        this.mousePosition = null;
    }
    handle(e) {
        if (e instanceof MouseDownEvent) {
            this.mousePosition = e.point;
        }
        else if (e instanceof MouseUpEvent) {
            this.mousePosition = null;
        }
        else if (e instanceof MouseMoveEvent) {
            if (!this.mousePosition)
                return;
            this.offset += e.point.y - this.mousePosition.y;
            this.offset = Math.min(this.offset, 0);
            this.offset = Math.max(this.offset, -this.maxOffset);
            this.mousePosition = e.point;
            this.layout();
            this.draw();
        }
    }
    layout() {
        let x = this.frame.x;
        let y = this.frame.y + this.offset;
        for (let child of this.children) {
            let [width, height] = child.config.dimensions;
            let [top, right, bottom, left] = child.config.margin.map((x) => Math.max(0, x));
            width = Math.min(width, this.frame.width - left - right);
            child.frame.x = x + left;
            child.frame.y = y + top;
            child.frame.width = width;
            child.frame.height = height;
            y += top + height + bottom;
        }
        this.maxOffset = y - this.frame.height;
    }
}
