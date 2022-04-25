import { Stack } from "./Stack.js";

export class VStack extends Stack {
  layout(): void {
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
      child.layout();
    }
  }

  private allocateHeight(): void {
    let total = this.frame.height;
    let totalWeight = 0;
    for (let child of this.children) {
      const config = child.config;
      total -= config.dimensions![1];
      totalWeight += config.weight!;
    }
    let rem = total;
    for (let child of this.children) {
      const config = child.config;
      let extra = Math.round((total * config.weight!) / totalWeight);
      rem -= extra;
      child.frame.height = config.dimensions![1] + extra;
    }
    if (rem) {
      this.children[this.children.length - 1].frame.height += rem;
    }
  }
}