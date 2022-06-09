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

  protected get displayChildren() {
    return this.children.filter((c) => c.props.visible);
  }

  protected get visibleChildren() {
    return this.children.filter((c) => c.props.visible && c.visible);
  }

  public override destruct(): void {
    this.children.forEach((c) => c.destruct());
  }
}
