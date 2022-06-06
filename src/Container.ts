import { Display } from "./Display.js";
import { Rect } from "./Geometry.js";
import { View, ViewConfig } from "./View.js";
import {
  Event,
  MouseClickEvent,
  MouseEnterEvent,
  MouseExitEvent,
} from "./Event.js";

export interface StyleConfig {}

export abstract class Container extends View<View> {
  constructor(config: ViewConfig<View>) {
    super(config);
    for (let child of this.children) {
      child.parent = this;
    }
  }

  override handle(e: Event): void {
    for (let child of this.children) {
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
    if (e instanceof MouseClickEvent && !e.handled) {
      this.props.weight++;
      this.props.dimension[0]++;
      this.props.dimension[1]++;
      e.handled = true;
    }
  }

  protected layoutChildren() {
    for (let child of this.children) {
      child.visible = child.frame.intersect(this.visible);
      child.layout();
    }
  }

  override draw(dirty: Rect) {
    const ctx = Display.instance.ctx;
    ctx.save();

    ctx.beginPath();
    ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
    ctx.clip();

    ctx.fillStyle = this.props.backgroundColor;
    const { x, y, width, height } = this.frame;
    ctx.fillRect(x, y, width, height);

    ctx.restore();

    for (let child of this.children) {
      const d = dirty.intersect(child.visible);
      if (d) child.draw(d);
    }
  }
}
