import { Rect } from "./Rect.js";
import { View } from "./View.js";

export class Container extends View {
  draw(ctx: CanvasRenderingContext2D, clip?: Rect) {
    super.draw(ctx, clip);
    clip = this.frame.intersection(clip);
    for (let child of this.children) {
      child.draw(ctx, clip);
    }
  }
}
