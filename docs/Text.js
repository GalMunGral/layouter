import { Display } from "./Display.js";
import { View } from "./View.js";
export class Text extends View {
    constructor(content, config) {
        super(config);
        this.content = content;
    }
    draw(dirty) {
        super.draw(dirty);
        const ctx = Display.instance.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
        ctx.clip();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(this.content, this.frame.x + this.frame.width / 2, this.frame.y + this.frame.height / 2);
        ctx.restore();
    }
}
