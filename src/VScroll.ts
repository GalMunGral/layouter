import { Event, MouseMoveEvent } from "./Event.js";
import { Scroll } from "./Scroll.js";

export class VScroll extends Scroll {
  handle(e: Event): void {
    super.handle(e);
    if (e instanceof MouseMoveEvent) {
      if (!this.scrolling) return;
      this.scroll(e.point.y - this.mousePosition.y);
      this.mousePosition = e.point;
      e.handled = true;
    }
  }

  layout(): void {
    let x = this.frame.x;
    let y = this.frame.y + this.offset;
    let contentHeight = 0;
    for (let child of this.children) {
      let [width, height] = child.config.dimension;
      let [top, right, bottom, left] = child.config.margin.map((x) =>
        Math.max(0, x)
      );
      child.frame.x = x + left;
      child.frame.y = y + top;
      child.frame.width = Math.min(width, this.frame.width - left - right);
      child.frame.height = height - top - bottom;
      y += height;
      contentHeight += height;
    }
    this.minOffset = this.frame.height - contentHeight;
    this.layoutChildren();
  }
}
