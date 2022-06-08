import { WheelEvent } from "./Event.js";
import { Scroll } from "./Scroll.js";
export class HScroll extends Scroll {
    handle(e) {
        super.handle(e);
        if (e.handled)
            return;
        if (e instanceof WheelEvent && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            this.scroll(-e.deltaX);
            e.handled = true;
        }
    }
    layout() {
        let x = this.frame.x + this.offset;
        let y = this.frame.y;
        let contentWidth = 0;
        for (let child of this.visibleChildren) {
            let [width, height] = child.deviceProps.dimension;
            let [top, right, bottom, left] = child.deviceProps.margin.map((x) => Math.max(0, x));
            child.frame.x = x + left;
            child.frame.y = y + top;
            child.frame.width = width;
            child.frame.height = Math.min(height, this.frame.height - top - bottom);
            child.outerFrame.x = x;
            child.outerFrame.y = y;
            child.outerFrame.width = left + width + right;
            child.outerFrame.height = child.frame.height + top + bottom;
            x += child.outerFrame.width;
            contentWidth += child.outerFrame.width;
        }
        this.minOffset = Math.min(this.frame.width - contentWidth, 0);
        this.layoutChildren();
    }
}
