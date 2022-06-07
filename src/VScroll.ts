import { Event, MouseMoveEvent } from "./Event.js";
import { Scroll } from "./Scroll.js";

export class VScroll<T extends { id: string }> extends Scroll<T> {
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
      let [width, height] = child.props.dimension;
      let [top, right, bottom, left] = child.props.margin.map((x) =>
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
    this.minOffset = this.frame.height - contentHeight;
    this.layoutChildren();
  }
}
