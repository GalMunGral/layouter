import { Stack } from "./Stack.js";

export class VStack extends Stack {
  layout(): void {
    if (!this.visibleChildren.length) return;
    this.allocateHeight();

    let y = this.frame.y;
    for (let child of this.visibleChildren) {
      child.outerFrame.width = this.frame.width;
      child.outerFrame.x = this.frame.x;
      child.outerFrame.y = y;
      y += child.outerFrame.height;
    }

    for (let child of this.visibleChildren) {
      this.finalize(child);
    }

    this.layoutChildren();
  }

  private allocateHeight(): void {
    let total = this.frame.height;
    let totalWeight = 0;
    for (let child of this.visibleChildren) {
      const props = child.deviceProps;
      total -= Math.min(props.dimension[1], this.frame.height);
      totalWeight += props.weight;
    }
    let rem = total;
    for (let child of this.visibleChildren) {
      const props = child.deviceProps;
      child.outerFrame.height = props.dimension![1];
      if (totalWeight) {
        let extra = Math.round((total * props.weight!) / totalWeight);
        rem -= extra;
        child.outerFrame.height += extra;
      }
    }
    if (rem < 0) {
      this.visibleChildren[this.visibleChildren.length - 1].outerFrame.height +=
        rem;
    }
  }
}
