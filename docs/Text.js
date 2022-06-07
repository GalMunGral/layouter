import { Display } from "./Display.js";
import { View } from "./View.js";
export class Text extends View {
    constructor(config) {
        super(config);
        this.lines = [];
        this.content = this.children.join("");
    }
    get font() {
        const props = this.deviceProps;
        return `${props.size}px ${props.fontFamily}`;
    }
    handle(e) { }
    layout() {
        this.lines = [];
        const props = this.deviceProps;
        let line = "";
        for (let c of this.content) {
            if (this.getTextWidth(line + c) > this.contentWidth) {
                this.lines.push(line);
                line = c;
                if (props.size * (this.lines.length + 1) > this.contentHeight)
                    return;
            }
            else {
                line += c;
            }
        }
        this.lines.push(line);
    }
    getTextWidth(s) {
        const ctx = Display.instance.ctx;
        ctx.font = this.font;
        const metrics = ctx.measureText(s);
        return (Math.abs(metrics.actualBoundingBoxLeft) +
            Math.abs(metrics.actualBoundingBoxRight));
    }
    draw(dirty) {
        const ctx = Display.instance.ctx;
        ctx.save();
        super.draw(dirty);
        const props = this.deviceProps;
        ctx.font = this.font;
        ctx.fillStyle = "rgba(" + props.color.join(",") + ")";
        ctx.textBaseline = "top";
        if (this.props.textAlign == "center") {
            ctx.textAlign = "center";
            for (let [i, line] of this.lines.entries()) {
                ctx.fillText(line, this.frame.x + this.frame.width / 2, this.frame.y + props.padding[0] + props.size * i);
            }
        }
        else {
            ctx.textAlign = "left";
            for (let [i, line] of this.lines.entries()) {
                ctx.fillText(line, this.frame.x + props.padding[3], this.frame.y + props.padding[0] + props.size * i);
            }
        }
        ctx.restore();
    }
}
