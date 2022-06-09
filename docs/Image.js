import { Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";
import { View } from "./View.js";
export class Image extends View {
    constructor(config) {
        super(config);
        this.el = null;
        this.imageFrame = new Rect(0, 0, 0, 0);
        this.objectFit = config.objectFit;
        if (config.url instanceof Observable) {
            config.url.subscribe((v) => {
                const el = document.createElement("img");
                el.src = v;
                el.onload = () => {
                    this.el = el;
                    this.layout();
                    this.redraw();
                };
            });
        }
        else {
            const el = document.createElement("img");
            el.src = config.url;
            el.onload = () => {
                this.el = el;
                this.layout();
                this.redraw();
            };
        }
    }
    layout() {
        if (!this.el)
            return;
        if (this.objectFit == "contain") {
            const scale = Math.min(this.frame.width / this.el.naturalWidth, this.frame.height / this.el.naturalHeight);
            this.imageFrame.width = this.el.naturalWidth * scale;
            this.imageFrame.height = this.el.naturalHeight * scale;
            this.imageFrame.x =
                this.frame.x + (this.frame.width - this.imageFrame.width) / 2;
            this.imageFrame.y =
                this.frame.y + (this.frame.height - this.imageFrame.height) / 2;
        }
        else {
            const scale = Math.min(this.el.naturalWidth / this.frame.width, this.el.naturalHeight / this.frame.height);
            this.imageFrame.width = this.frame.width * scale;
            this.imageFrame.height = this.frame.height * scale;
            this.imageFrame.x = (this.el.naturalWidth - this.imageFrame.width) / 2;
            this.imageFrame.y = (this.el.naturalHeight - this.imageFrame.height) / 2;
        }
    }
    draw(ctx, dirty) {
        ctx.save();
        super.draw(ctx, dirty);
        if (this.el) {
            if (this.objectFit == "contain") {
                ctx.drawImage(this.el, this.imageFrame.x, this.imageFrame.y, this.imageFrame.width, this.imageFrame.height);
            }
            else {
                ctx.drawImage(this.el, this.imageFrame.x, this.imageFrame.y, this.imageFrame.width, this.imageFrame.height, this.frame.x, this.frame.y, this.frame.width, this.frame.height);
            }
        }
        ctx.restore();
    }
}
