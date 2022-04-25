import { Event, MouseEnterEvent, MouseExitEvent } from "./Event.js";
import { Rect } from "./Geometry.js";
import { Config, View } from "./View.js";

export class Container extends View {
  private previousEvent?: Event;

  constructor(config: Partial<Config>, public children: View[] = []) {
    super(config);
  }

  handle(event: Event): void {
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

  draw(dirty: Rect | null = null) {
    super.draw(dirty);
    dirty = this.frame.intersection(dirty);
    for (let child of this.children) {
      child.draw(dirty);
    }
  }
}
