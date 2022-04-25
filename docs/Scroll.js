import { Container } from "./Container.js";
import { MouseDownEvent, MouseUpEvent } from "./Event.js";
import { Point } from "./Geometry.js";
export class Scroll extends Container {
    constructor() {
        super(...arguments);
        this.offset = 0;
        this.minOffset = 0;
        this.scrolling = false;
        this.mousePosition = new Point(0, 0);
        this.delta = 0;
    }
    scroll(delta) {
        this.delta = delta;
        this.offset += delta;
        this.offset = Math.min(this.offset, 0);
        this.offset = Math.max(this.offset, this.minOffset);
        this.layout();
        this.redraw();
    }
    handle(e) {
        super.handle(e);
        if (e instanceof MouseDownEvent) {
            this.scrolling = true;
            this.mousePosition = e.point;
        }
        else if (e instanceof MouseUpEvent) {
            this.scrolling = false;
            const simulateInertia = () => {
                if (!this.delta) {
                    return;
                }
                this.scroll(this.delta);
                this.delta += this.delta > 0 ? -1 : 1;
                setTimeout(simulateInertia, 16);
            };
            simulateInertia();
        }
    }
}
