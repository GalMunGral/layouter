import { Stack } from "./Stack.js";
export class VStack extends Stack {
    layout() {
        if (!this.children.length)
            return;
        this.allocateHeight();
        let y = this.frame.y;
        for (let child of this.children) {
            child.outerFrame.width = this.frame.width;
            child.outerFrame.x = this.frame.x;
            child.outerFrame.y = y;
            y += child.outerFrame.height;
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
            const props = child.deviceProps;
            total -= Math.min(props.dimension[1], this.frame.height);
            totalWeight += props.weight;
        }
        let rem = total;
        for (let child of this.children) {
            const props = child.deviceProps;
            let extra = Math.round((total * props.weight) / totalWeight);
            rem -= extra;
            child.outerFrame.height = props.dimension[1] + extra;
        }
        if (rem) {
            this.children[this.children.length - 1].outerFrame.height += rem;
        }
    }
}
