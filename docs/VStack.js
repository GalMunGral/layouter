import { Stack } from "./Stack.js";
export class VStack extends Stack {
    layout() {
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
    allocateHeight() {
        let total = this.frame.height;
        let totalWeight = 0;
        for (let child of this.children) {
            const config = child.config;
            total -= Math.min(config.dimension[1], this.frame.height);
            totalWeight += config.weight;
        }
        let rem = total;
        for (let child of this.children) {
            const config = child.config;
            let extra = Math.round((total * config.weight) / totalWeight);
            rem -= extra;
            child.frame.height = config.dimension[1] + extra;
        }
        if (rem) {
            this.children[this.children.length - 1].frame.height += rem;
        }
    }
}
