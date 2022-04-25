import { Container } from "./Container.js";
import {
  Event,
  MouseDownEvent,
  MouseMoveEvent,
  MouseUpEvent,
} from "./Event.js";
import { Point } from "./Geometry.js";

export class VScroll extends Container {
  private offset = 0;
  private maxOffset = 0;
  private mousePosition: Point | null = null;

  handle(e: Event): void {
    if (e instanceof MouseDownEvent) {
      this.mousePosition = e.point;
    } else if (e instanceof MouseUpEvent) {
      this.mousePosition = null;
    } else if (e instanceof MouseMoveEvent) {
      if (!this.mousePosition) return;
      this.offset += e.point.y - this.mousePosition.y;
      this.offset = Math.min(this.offset, 0);
      this.offset = Math.max(this.offset, -this.maxOffset);
      this.mousePosition = e.point;
      this.layout();
      this.draw();
    }
  }

  layout(): void {
    let x = this.frame.x;
    let y = this.frame.y + this.offset;
    for (let child of this.children) {
      let [width, height] = child.config.dimensions;
      let [top, right, bottom, left] = child.config.margin.map((x) =>
        Math.max(0, x)
      );
      width = Math.min(width, this.frame.width - left - right);
      child.frame.x = x + left;
      child.frame.y = y + top;
      child.frame.width = width;
      child.frame.height = height;
      y += top + height + bottom;
    }
    this.maxOffset = y - this.frame.height;
  }
}
