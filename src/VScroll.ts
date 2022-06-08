import { Event, WheelEvent } from "./Event.js";
import { Scroll } from "./Scroll.js";

export class VScroll<T extends { id: string }> extends Scroll<T> {
  handle(e: Event): void {
    super.handle(e);
    if (e.handled) return;
    if (e instanceof WheelEvent && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      this.scroll(-e.deltaY);
      e.handled = true;
    }
  }

  layout(): void {
    let x = this.frame.x;
    let y = this.frame.y + this.offset;
    let contentHeight = 0;
    for (let child of this.visibleChildren) {
      let [width, height] = child.deviceProps.dimension;
      let [top, right, bottom, left] = child.deviceProps.margin.map((x) =>
        Math.max(0, x)
      );
      child.frame.x = x + left;
      child.frame.y = y + top;
      child.frame.width = Math.min(width, this.frame.width - left - right);
      child.frame.height = height;
      child.outerFrame.x = x;
      child.outerFrame.y = y;
      child.outerFrame.width = child.frame.width + left + right;
      child.outerFrame.height = height + top + bottom;
      y += child.outerFrame.height;
      contentHeight += child.outerFrame.height;
    }
    this.minOffset = Math.min(this.frame.height - contentHeight, 0);
    this.layoutChildren();
  }
}
