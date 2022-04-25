import { Event, MouseEnterEvent, MouseExitEvent } from "./Event.js";
import { Rect } from "./Geometry.js";
import { HScroll } from "./HScroll.js";
import { Config, View } from "./View.js";

export class Container extends View {
  private previousEvent?: Event;

  constructor(config: Partial<Config>, public children: View[] = []) {
    super(config);
  }

  handle(event: Event): void {
    super.handle(event);
    for (let child of this.children) {
      if (child.frame.includes(event.point)) {
        if (!child.frame.includes(this.previousEvent?.point)) {
          child.handle(new MouseEnterEvent(event.point));
        }
        child.handle(event);
      } else {
        if (child.frame.includes(this.previousEvent?.point)) {
          child.handle(new MouseExitEvent(event.point));
        }
      }
    }
    this.previousEvent = event;
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
