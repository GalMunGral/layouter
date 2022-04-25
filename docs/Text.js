import { Display } from "./Display.js";
import { MouseClickEvent } from "./Event.js";
import { View } from "./View.js";
export class Text extends View {
    constructor(content, config) {
        super(config);
        this.content = content;
    }
    handle(e) {
        super.handle(e);
        if (e instanceof MouseClickEvent) {
            this.config.weight++;
            this.config.dimension[0]++;
            this.config.dimension[1]++;
            e.handled = true;
        }
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
