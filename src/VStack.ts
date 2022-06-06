import { Stack } from "./Stack.js";

export class VStack extends Stack {
  layout(): void {
    if (!this.children.length) return;
    this.allocateHeight();

    let y = this.frame.y;
    for (let child of this.children) {
      child.frame.width = this.frame.width;
      child.frame.x = this.frame.x;
      child.frame.y = y;
      y += child.frame.height;
    }

    for (let child of this.children) {
      this.finalize(child);
    }

    this.layoutChildren();
  }

  private allocateHeight(): void {
    let total = this.frame.height;
    let totalWeight = 0;
    for (let child of this.children) {
      const props = child.props;
      total -= Math.min(props.dimension[1], this.frame.height);
      totalWeight += props.weight;
    }
    let rem = total;
    for (let child of this.children) {
      const props = child.props;
      let extra = Math.round((total * props.weight!) / totalWeight);
      rem -= extra;
      child.frame.height = props.dimension![1] + extra;
    }
    if (rem) {
      this.children[this.children.length - 1].frame.height += rem;
    }
  }
}
