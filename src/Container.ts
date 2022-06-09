import { Point, Rect } from "./Geometry.js";
import { View, ViewConfig } from "./View.js";

export interface StyleConfig {}

export abstract class Container extends View<View> {
  protected get displayChildren() {
    return this.children.filter((c) => c.props.visible);
  }

  public abstract compose(dirty: Rect, translate: Point): void;

  public override destruct(): void {
    this.children.forEach((c) => c.destruct());
  }
}
