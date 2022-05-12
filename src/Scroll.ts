import { Container } from "./Container.js";
import { Event, MouseDownEvent, MouseUpEvent } from "./Event.js";
import { Point } from "./Geometry.js";

export abstract class Scroll extends Container {
  protected offset = 0;
  protected minOffset = 0;
  protected scrolling = false;
  protected mousePosition: Point = new Point(0, 0);
  protected delta = 0;

  protected scroll(delta: number) {
    this.delta = delta;
    this.offset += delta;
    this.offset = Math.min(this.offset, 0);
    this.offset = Math.max(this.offset, this.minOffset);
    this.layout();
    this.redraw();
  }

  handle(e: Event): void {
    super.handle(e);
    if (e instanceof MouseDownEvent) {
      this.scrolling = true;
      this.mousePosition = e.point;
      e.handled = true;
    } else if (e instanceof MouseUpEvent) {
      this.scrolling = false;
      const simulateInertia = () => {
        if (!this.delta) return;
        this.scroll(this.delta);
        this.delta += this.delta > 0 ? -1 : 1;
        setTimeout(simulateInertia, 16);
      };
      simulateInertia();
      e.handled = true;
    }
  }
}
