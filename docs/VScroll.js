import { Container } from "./Container.js";
export class VScroll extends Container {
    constructor() {
        super(...arguments);
        this.offset = 0;
    }
    layout() {
        let x = this.frame.x;
        let y = this.frame.y + this.offset;
        for (let child of this.children) {
            let [width, height] = child.config.dimensions;
            let [top, right, bottom, left] = child.config.margin.map((x) => Math.max(0, x));
            width = Math.min(width, this.frame.width - left - right);
            child.frame.x = x + left;
            child.frame.y = y + top;
            child.frame.width = width;
            child.frame.height = height;
            y += top + height + bottom;
        }
    }
}
