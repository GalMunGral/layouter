import { Container } from "./Container.js";
import { Event, MouseEnterEvent, MouseExitEvent } from "./Event.js";
import { Point, Rect } from "./Geometry.js";
import { View, ViewConfig } from "./View.js";

export abstract class Stack extends Container {
  constructor(config: ViewConfig) {
    super(config);
    for (let child of this.children) {
      child.ctx = this.ctx;
    }
  }

  protected layoutChildren() {
    for (let child of this.displayChildren) {
      child.layout();
    }
  }

  override compose(dirty: Rect, translate: Point) {
    for (let child of this.displayChildren) {
      if (!(child instanceof Container)) continue;
      const d = child.frame
        .translate(translate.x, translate.y)
        .intersect(dirty);
      if (d) {
        child.compose(d, translate);
      }
    }
  }

  override handle(e: Event): void {
    for (let child of this.displayChildren) {
      if (child.frame.includes(e.point)) {
        if (!child.frame.includes(Event.previous?.point)) {
          child.handle(new MouseEnterEvent(e.point));
        }
        child.handle(e);
      } else {
        if (child.frame.includes(Event.previous?.point)) {
          child.handle(new MouseExitEvent(e.point));
        }
      }
    }
    super.handle(e);
  }

  override draw(
    ctx: CanvasRenderingContext2D,
    dirty: Rect,
    recursive: boolean
  ) {
    ctx.save();
    super.draw(ctx, dirty);
    for (let child of this.displayChildren) {
      // let d = child.frame.intersect(dirty);
      // if (d)
      child.draw(ctx, dirty, recursive);
    }
    ctx.restore();
  }

  protected finalize(child: View): void {
    const { frame, outerFrame, deviceProps } = child;
    let [width, height] = deviceProps.dimension;
    const [top, right, bottom, left] = deviceProps.margin;
    if (top > -1 && bottom > -1) {
      frame.y = outerFrame.y + top;
      frame.height = outerFrame.height - top - bottom;
    } else if (top > -1) {
      frame.y = outerFrame.y + top;
      frame.height = Math.min(height, outerFrame.height - top);
    } else if (bottom > -1) {
      frame.height = Math.min(height, outerFrame.height - bottom);
      frame.y = outerFrame.y + outerFrame.height - bottom - frame.height;
    } else {
      frame.height = Math.min(height, outerFrame.height);
      frame.y =
        outerFrame.y + Math.floor((outerFrame.height - frame.height) / 2);
    }
    if (left > -1 && right > -1) {
      frame.width = outerFrame.width - left - right;
      frame.x = outerFrame.x + left;
    } else if (left > -1) {
      frame.width = Math.min(width, outerFrame.width - left);
      frame.x = outerFrame.x + left;
    } else if (right > -1) {
      frame.width = Math.min(width, outerFrame.width - right);
      frame.x = outerFrame.x + outerFrame.width - right - frame.width;
    } else {
      frame.width = Math.min(width, outerFrame.width);
      frame.x = outerFrame.x + Math.floor((outerFrame.width - frame.width) / 2);
    }
  }
}
