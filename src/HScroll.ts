import {
  Event,
  MouseDownEvent,
  MouseMoveEvent,
  MouseUpEvent,
  WheelEvent,
} from "./Event.js";
import { Scroll } from "./Scroll.js";

export class HScroll<T extends { id: string }> extends Scroll<T> {
  private isScrollling = false;
  private prevX = -1;
  handle(e: Event): void {
    super.handle(e);
    if (e.handled) return;
    if (e instanceof MouseDownEvent) {
      this.isScrollling = true;
      this.prevX = e.point.x;
      e.handled = true;
    } else if (e instanceof MouseMoveEvent) {
      if (this.isScrollling) {
        this.scroll(e.point.x - this.prevX, 0);
        this.prevX = e.point.x;
        e.handled = true;
      }
    } else if (e instanceof MouseUpEvent) {
      this.isScrollling = false;
    }
  }

  layout(): void {
    let x = 0;
    let y = 0;
    this.contentFrame.height = this.frame.height;
    this.contentFrame.width = 0;
    for (let child of this.displayChildren) {
      let [width, height] = child.deviceProps.dimension;
      let [top, right, bottom, left] = child.deviceProps.margin.map((x) =>
        Math.max(0, x)
      );
      child.frame.x = x + left;
      child.frame.y = y + top;
      child.frame.width = width;
      child.frame.height = Math.min(height, this.frame.height - top - bottom);
      child.outerFrame.x = x;
      child.outerFrame.y = y;
      child.outerFrame.width = left + width + right;
      child.outerFrame.height = child.frame.height + top + bottom;
      x += child.outerFrame.width;
      this.contentFrame.width += child.outerFrame.width;
    }
    this.minOffsetX = Math.min(this.frame.width - this.contentFrame.width, 0);
    for (let child of this.displayChildren) {
      child.layout();
    }
  }
}
