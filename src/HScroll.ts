import { Container } from "./Container.js";

export class HScroll extends Container {
  private offset = 0;

  layout(): void {
    let { x, y } = this.frame;
    for (let child of this.children) {
      let [width, height] = child.config.dimensions;
      let [top, right, bottom, left] = child.config.margin.map((x) =>
        Math.max(0, x)
      );
      height = Math.min(height, this.frame.height - top - bottom);
      child.frame.x = x + left;
      child.frame.y = y + top;
      child.frame.width = width;
      child.frame.height = height;
      x += left + width + right;
    }
  }
}
