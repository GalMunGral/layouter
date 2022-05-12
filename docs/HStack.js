import { Stack } from "./Stack.js";
export class HStack extends Stack {
    layout() {
        if (!this.children.length)
            return;
        this.allocateWidth();
        let x = this.frame.x;
        for (let child of this.children) {
            child.frame.height = this.frame.height;
            child.frame.y = this.frame.y;
            child.frame.x = x;
            x += child.frame.width;
        }
        for (let child of this.children) {
            this.finalize(child);
        }
        this.layoutChildren();
    }
    allocateWidth() {
        let total = this.frame.width;
        let totalWeight = 0;
        for (let child of this.children) {
            const config = child.layoutConfig;
            total -= Math.min(config.dimension[0], this.frame.width);
            totalWeight += config.weight;
        }
        let rem = total;
        for (let child of this.children) {
            const config = child.layoutConfig;
            let extra = Math.round((total * config.weight) / totalWeight);
            rem -= extra;
            child.frame.width = config.dimension[0] + extra;
        }
        if (rem) {
            this.children[this.children.length - 1].frame.width += rem;
        }
    }
}
