import { Event, MouseMoveEvent } from "./Event.js";
import { Scroll } from "./Scroll.js";

export class HScroll<T extends { id: string }> extends Scroll<T> {
  handle(e: Event): void {
    super.handle(e);
    if (e instanceof MouseMoveEvent) {
      if (!this.scrolling) return;
      this.scroll(e.point.x - this.mousePosition.x);
      this.mousePosition = e.point;
      e.handled = true;
    }
  }

  layout(): void {
    let x = this.frame.x + this.offset;
    let y = this.frame.y;
    let contentWidth = 0;
    for (let child of this.children) {
      let [width, height] = child.props.dimension;
      let [top, right, bottom, left] = child.props.margin.map((x) =>
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
    this.minOffset = this.frame.width - contentWidth;
    this.layoutChildren();
  }
}
