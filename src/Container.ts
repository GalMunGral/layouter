import { Rect } from "./Geometry.js";
import { View, ViewConfig } from "./View.js";
import {
  Event,
  MouseClickEvent,
  MouseEnterEvent,
  MouseExitEvent,
} from "./Event.js";
import { Display } from "./Display.js";

export interface StyleConfig {}

export abstract class Container extends View<View> {
  constructor(config: ViewConfig<View>) {
    super(config);
    for (let child of this.children) {
      child.parent = this;
    }
  }

  override handle(e: Event): void {
    for (let child of this.visibleChildren) {
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

  protected get visibleChildren() {
    return this.children.filter((c) => c.props.visible && c.visible);
  }

  public override destruct(): void {
    this.children.forEach((c) => c.destruct());
  }
}
