import { Rect } from "./Rect.js";
export class View {
    constructor(config, children = []) {
        this.config = config;
        this.children = children;
        this.frame = new Rect(0, 0, 0, 0);
    }
    layout() {
        for (let child of this.children) {
            const config = child.config;
            if (!config.dimensions)
                config.dimensions = [0, 0];
            if (!config.weight)
                config.weight = 1;
            if (!config.margin)
                config.margin = [-1, -1, -1, -1];
        }
        if (this.config.type == "stack") {
            this.stackLayout();
        }
        else {
            this.scrollLayout();
        }
    }
    scrollLayout() { }
    stackLayout() {
        if (this.config.direction == "vertical") {
            let total = this.frame.height;
            let totalWeight = 0;
            for (let child of this.children) {
                const config = child.config;
                total -= config.dimensions[1];
                totalWeight += config.weight;
            }
            let rem = total;
            for (let child of this.children) {
                const config = child.config;
                let extra = Math.round((total * config.weight) / totalWeight);
                rem -= extra;
                child.frame.height = config.dimensions[1] + extra;
            }
            if (rem) {
                this.children[this.children.length - 1].frame.height += rem;
            }
            let y = this.frame.y;
            for (let child of this.children) {
                child.frame.width = this.frame.width;
                child.frame.x = this.frame.x;
                child.frame.y = y;
                y += child.frame.height;
            }
        }
        else {
            let total = this.frame.width;
            let totalWeight = 0;
            for (let child of this.children) {
                const config = child.config;
                total -= config.dimensions[0];
                totalWeight += config.weight;
            }
            let rem = total;
            for (let child of this.children) {
                const config = child.config;
                let extra = Math.round((total * config.weight) / totalWeight);
                rem -= extra;
                child.frame.width = config.dimensions[0] + extra;
            }
            if (rem) {
                this.children[this.children.length - 1].frame.width += rem;
            }
            let x = this.frame.y;
            for (let child of this.children) {
                child.frame.height = this.frame.height;
                child.frame.y = this.frame.y;
                child.frame.x = x;
                x += child.frame.width;
            }
        }
        for (let child of this.children) {
            this.finalize(child);
            child.layout();
        }
    }
    finalize(child) {
        var _a;
        const { frame, config: config } = child;
        let [width, height] = (_a = config.dimensions) !== null && _a !== void 0 ? _a : [0, 0];
        const [top, right, bottom, left] = config.margin;
        if (top > -1 && bottom > -1) {
            frame.height = frame.height - top - bottom;
            frame.y += top;
        }
        else if (top > -1) {
            frame.height = Math.min(height, frame.height - top);
            frame.y += top;
        }
        else if (bottom > -1) {
            height = Math.min(height, frame.height - bottom);
            const top = frame.height - height - bottom;
            frame.height = height;
            frame.y += top;
        }
        else {
            height = Math.min(height, frame.height);
            const top = Math.floor((frame.height - height) / 2);
            frame.height = height;
            frame.y += top;
        }
        if (left > -1 && right > -1) {
            frame.width = frame.width - left - right;
            frame.x += left;
        }
        else if (left > -1) {
            frame.width = Math.min(width, frame.width - top);
            frame.x += top;
        }
        else if (right > -1) {
            width = Math.min(width, frame.width - right);
            const left = frame.width - width - right;
            frame.width = width;
            frame.x += left;
        }
        else {
            width = Math.min(width, frame.width);
            const left = Math.floor((frame.width - width) / 2);
            frame.width = width;
            frame.x += left;
        }
    }
    draw(ctx) {
        var _a;
        ctx.save();
        ctx.fillStyle = (_a = this.config.backgroundColor) !== null && _a !== void 0 ? _a : "black";
        const { x, y, width, height } = this.frame;
        ctx.fillRect(x, y, width, height);
        for (let child of this.children) {
            child.draw(ctx);
        }
        ctx.restore();
    }
}
