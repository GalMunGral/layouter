import { Point, Rect } from "./Geometry.js";
import { View, ViewConfig } from "./View.js";

export interface StyleConfig {}

export abstract class Container extends View<View> {
  protected get displayChildren() {
    return this.children.filter((c) => c.props.visible);
  }

  public override setDebugPath(path: string): void {
    super.setDebugPath(path);
    this.children.forEach((c, i) =>
      c.setDebugPath(
        `${path}/${i}::${Object.getPrototypeOf(c).constructor.name}`
      )
    );
  }

  public abstract compose(dirty: Rect, translate: Point): void;

  public override destruct(): void {
    this.children.forEach((c) => c.destruct());
  }
}
