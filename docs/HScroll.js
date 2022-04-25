import { MouseMoveEvent } from "./Event.js";
import { Scroll } from "./Scroll.js";
export class HScroll extends Scroll {
    handle(e) {
        super.handle(e);
        if (e instanceof MouseMoveEvent) {
            if (!this.scrolling)
                return;
            this.scroll(e.point.x - this.mousePosition.x);
            this.mousePosition = e.point;
        }
    }
    layout() {
        let x = this.frame.x + this.offset;
        let y = this.frame.y;
        let contentWidth = 0;
        for (let child of this.children) {
            let [width, height] = child.config.dimensions;
            let [top, right, bottom, left] = child.config.margin.map((x) => Math.max(0, x));
            child.frame.x = x + left;
            child.frame.y = y + top;
            child.frame.width = width - left - right;
            child.frame.height = Math.min(height, this.frame.height - top - bottom);
            x += width;
            contentWidth += width;
        }
        this.minOffset = this.frame.width - contentWidth;
        this.layoutChildren();
    }
}
