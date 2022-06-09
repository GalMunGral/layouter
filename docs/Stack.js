import { Container } from "./Container.js";
import { Display } from "./Display.js";
export class Stack extends Container {
    updateVisibility(visible) {
        this.visible = this.outerFrame.intersect(visible);
        let visibleInside = this.frame.intersect(visible);
        if (!visibleInside)
            return;
        for (let child of this.children) {
            child.updateVisibility(visibleInside);
        }
    }
    layoutChildren() {
        for (let child of this.visibleChildren) {
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
    finalize(child) {
        const { frame, outerFrame, deviceProps } = child;
        let [width, height] = deviceProps.dimension;
        const [top, right, bottom, left] = deviceProps.margin;
        if (top > -1 && bottom > -1) {
            frame.y = outerFrame.y + top;
            frame.height = outerFrame.height - top - bottom;
        }
        else if (top > -1) {
            frame.y = outerFrame.y + top;
            frame.height = Math.min(height, outerFrame.height - top);
        }
        else if (bottom > -1) {
            frame.height = Math.min(height, outerFrame.height - bottom);
            frame.y = outerFrame.y + outerFrame.height - bottom - frame.height;
        }
        else {
            frame.height = Math.min(height, outerFrame.height);
            frame.y =
                outerFrame.y + Math.floor((outerFrame.height - frame.height) / 2);
        }
        if (left > -1 && right > -1) {
            frame.width = outerFrame.width - left - right;
            frame.x = outerFrame.x + left;
        }
        else if (left > -1) {
            frame.width = Math.min(width, outerFrame.width - left);
            frame.x = outerFrame.x + left;
        }
        else if (right > -1) {
            frame.width = Math.min(width, outerFrame.width - right);
            frame.x = outerFrame.x + outerFrame.width - right - frame.width;
        }
        else {
            frame.width = Math.min(width, outerFrame.width);
            frame.x = outerFrame.x + Math.floor((outerFrame.width - frame.width) / 2);
        }
    }
}
