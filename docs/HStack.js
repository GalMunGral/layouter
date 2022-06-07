import { Stack } from "./Stack.js";
export class HStack extends Stack {
    layout() {
        if (!this.children.length)
            return;
        this.allocateWidth();
        let x = this.frame.x;
        for (let child of this.children) {
            child.outerFrame.height = this.frame.height;
            child.outerFrame.y = this.frame.y;
            child.outerFrame.x = x;
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
            const props = child.props;
            total -= Math.min(props.dimension[0], this.frame.width);
            totalWeight += props.weight;
        }
        let rem = total;
        for (let child of this.children) {
            const props = child.props;
            let extra = Math.round((total * props.weight) / totalWeight);
            rem -= extra;
            child.outerFrame.width = props.dimension[0] + extra;
        }
        if (rem) {
            this.children[this.children.length - 1].outerFrame.width += rem;
        }
    }
}
