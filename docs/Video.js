import { Rect } from "./Geometry.js";
import { View } from "./View.js";
export class Video extends View {
    constructor(config) {
        super(config);
        this.el = null;
        this.imageFrame = new Rect(0, 0, 0, 0);
        this.rafHandle = -1;
        this.objectFit = config.objectFit;
        const el = document.createElement("video");
        el.autoplay = true;
        el.onloadeddata = () => {
            this.el = el;
        };
        el.onplay = () => {
            this.layout();
            const drawFrame = () => {
                this.redraw();
                this.rafHandle = requestAnimationFrame(drawFrame);
            };
            this.rafHandle = requestAnimationFrame(drawFrame);
        };
        el.onpause = () => {
            cancelAnimationFrame(this.rafHandle);
        };
        el.src = config.url;
    }
    layout() {
        if (!this.el)
            return;
        if (this.objectFit == "contain") {
            const scale = Math.min(this.frame.width / this.el.videoWidth, this.frame.height / this.el.videoHeight);
            this.imageFrame.width = this.el.videoWidth * scale;
            this.imageFrame.height = this.el.videoHeight * scale;
            this.imageFrame.x =
                this.frame.x + (this.frame.width - this.imageFrame.width) / 2;
            this.imageFrame.y =
                this.frame.y + (this.frame.height - this.imageFrame.height) / 2;
        }
        else {
            const scale = Math.min(this.el.videoWidth / this.frame.width, this.el.videoHeight / this.frame.height);
            this.imageFrame.width = this.frame.width * scale;
            this.imageFrame.height = this.frame.height * scale;
            this.imageFrame.x = (this.el.videoWidth - this.imageFrame.width) / 2;
            this.imageFrame.y = (this.el.videoHeight - this.imageFrame.height) / 2;
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
