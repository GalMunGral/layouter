import { Display } from "./Display.js";
import { Event, WheelEvent } from "./Event.js";
import { Scroll } from "./Scroll.js";

export class HScroll<T extends { id: string }> extends Scroll<T> {
  handle(e: Event): void {
    super.handle(e);
    if (e.handled) return;
    if (e instanceof WheelEvent && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      this.scroll(-e.deltaX, 0);
      e.handled = true;
    }
  }

  layout(): void {
    let x = 0;
    let y = 0;
    let contentWidth = 0;
    for (let child of this.visibleChildren) {
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
      contentWidth += child.outerFrame.width;
    }
    this.minOffsetX = Math.min(this.frame.width - contentWidth, 0);
    for (let child of this.visibleChildren) {
      child.layout();
    }
  }
}
