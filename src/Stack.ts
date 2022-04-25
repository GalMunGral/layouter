import { Container } from "./Container.js";
import { View } from "./View.js";

export class Stack extends Container {
  protected finalize(child: View): void {
    const { frame, config: config } = child;
    let [width, height] = config.dimensions ?? [0, 0];
    const [top, right, bottom, left] = config.margin!;
    if (top > -1 && bottom > -1) {
      frame.height = frame.height - top - bottom;
      frame.y += top;
    } else if (top > -1) {
      frame.height = Math.min(height, frame.height - top);
      frame.y += top;
    } else if (bottom > -1) {
      height = Math.min(height, frame.height - bottom);
      const top = frame.height - height - bottom;
      frame.height = height;
      frame.y += top;
    } else {
      height = Math.min(height, frame.height);
      const top = Math.floor((frame.height - height) / 2);
      frame.height = height;
      frame.y += top;
    }
    if (left > -1 && right > -1) {
      frame.width = frame.width - left - right;
      frame.x += left;
    } else if (left > -1) {
      frame.width = Math.min(width, frame.width - top);
      frame.x += top;
    } else if (right > -1) {
      width = Math.min(width, frame.width - right);
      const left = frame.width - width - right;
      frame.width = width;
      frame.x += left;
    } else {
      width = Math.min(width, frame.width);
      const left = Math.floor((frame.width - width) / 2);
      frame.width = width;
      frame.x += left;
    }
  }
}