import { Stack } from "./Stack.js";
export class HStack extends Stack {
    layout() {
        if (!this.displayChildren.length)
            return;
        this.allocateWidth();
        let x = this.frame.x;
        for (let child of this.displayChildren) {
            child.outerFrame.height = this.frame.height;
            child.outerFrame.y = this.frame.y;
            child.outerFrame.x = x;
            x += child.outerFrame.width;
        }
        for (let child of this.displayChildren) {
            this.finalize(child);
        }
        this.layoutChildren();
    }
    allocateWidth() {
        let total = this.frame.width;
        let totalWeight = 0;
        for (let child of this.displayChildren) {
            const props = child.deviceProps;
            total -= Math.min(props.dimension[0], this.frame.width);
            totalWeight += props.weight;
        }
        let rem = total;
        for (let child of this.displayChildren) {
            const props = child.deviceProps;
            child.outerFrame.width = props.dimension[0];
            if (totalWeight) {
                let extra = Math.round((total * props.weight) / totalWeight);
                rem -= extra;
                child.outerFrame.width += extra;
            }
        }
        if (rem < 0) {
            this.displayChildren[this.displayChildren.length - 1].outerFrame.width +=
                rem;
        }
    }
}
