import { Display } from "./Display.js";
import { Observable } from "./Observable.js";
import { View } from "./View.js";
export class Text extends View {
    constructor(config) {
        super(config);
        this.lines = [];
        this.content = "";
        if (this.children[0] instanceof Observable) {
            // TODO combine observables
            this.children[0].subscribe((v) => {
                queueMicrotask(() => {
                    this.layout();
                    this.redraw();
                });
                this.content = v;
            });
        }
        else {
            this.content = this.children.join("");
        }
    }
    get font() {
        const props = this.deviceProps;
        return `${props.fontWeight} ${props.fontSize}px ${props.fontFamily}`;
    }
    handle(e) {
        super.handle(e);
    }
    layout() {
        this.lines = [];
        const props = this.deviceProps;
        let line = "";
        for (let c of this.content) {
            if (this.getTextWidth(line + c) > this.contentWidth) {
                this.lines.push(line);
                line = c;
                if (props.fontSize * (this.lines.length + 1) > this.contentHeight)
                    return;
            }
            else {
                line += c;
            }
        }
        this.lines.push(line);
    }
    getTextWidth(s) {
        const ctx = Display.instance.displayCtx;
        ctx.font = this.font;
        const metrics = ctx.measureText(s);
        return (Math.abs(metrics.actualBoundingBoxLeft) +
            Math.abs(metrics.actualBoundingBoxRight));
    }
    draw(ctx, dirty) {
        ctx.save();
        super.draw(ctx, dirty);
        const props = this.deviceProps;
        ctx.font = this.font;
        ctx.fillStyle = "rgba(" + props.color.join(",") + ")";
        ctx.textBaseline = "top";
        if (this.props.textAlign == "center") {
            ctx.textAlign = "center";
            for (let [i, line] of this.lines.entries()) {
                ctx.fillText(line, this.frame.x + this.frame.width / 2, this.frame.y + props.padding[0] + props.fontSize * i);
            }
        }
        else {
            ctx.textAlign = "left";
            for (let [i, line] of this.lines.entries()) {
                ctx.fillText(line, this.frame.x + props.padding[3], this.frame.y + props.padding[0] + props.fontSize * i);
            }
        }
        ctx.restore();
    }
}
