import {
  Event,
  MouseClickEvent,
  MouseEnterEvent,
  MouseExitEvent,
} from "./Event.js";
import { Rect } from "./Geometry.js";
import { Config, View } from "./View.js";

export class Container extends View {
  constructor(config: Partial<Config>, public children: View[] = []) {
    super(config);
    for (let child of children) {
      child.parent = this;
    }
  }

  handle(e: Event): void {
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
    super.handle(e);
    if (e instanceof MouseClickEvent && !e.handled) {
      this.config.weight++;
      this.config.dimension[0]++;
      this.config.dimension[1]++;
      e.handled = true;
    }
  }

  protected layoutChildren() {
    for (let child of this.children) {
      child.visible = child.frame.intersect(this.visible);
      child.layout();
    }
  }

  draw(dirty: Rect) {
    super.draw(dirty);
    for (let child of this.children) {
      const d = dirty.intersect(child.visible);
      if (d) child.draw(d);
    }
  }
}
