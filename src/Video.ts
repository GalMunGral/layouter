import { Point, Rect } from "./Geometry.js";
import { View, ViewConfig } from "./View.js";

type ImageConfig = {
  url: string;
  objectFit: "contain" | "cover";
};

export class Video extends View {
  private el: HTMLVideoElement | null = null;
  private imageFrame: Rect = new Rect(0, 0, 0, 0);
  private rafHandle: number = -1;
  public objectFit: "contain" | "cover";
  constructor(config: ViewConfig & ImageConfig) {
    super(config);
    this.objectFit = config.objectFit;
    const el = document.createElement("video");
    el.autoplay = true;
    el.onloadeddata = () => {
      this.el = el;
    };
    el.onplay = () => {
      this.layout();
      const drawFrame = () => {
        this.redraw("frame updated");
        this.rafHandle = requestAnimationFrame(drawFrame);
      };
      this.rafHandle = requestAnimationFrame(drawFrame);
    };
    el.onpause = () => {
      cancelAnimationFrame(this.rafHandle);
    };
    el.src = config.url;
  }

  public override layout(): void {
    if (!this.el) return;

    if (this.objectFit == "contain") {
      const scale = Math.min(
        this.frame.width / this.el.videoWidth,
        this.frame.height / this.el.videoHeight
      );
      this.imageFrame.width = this.el.videoWidth * scale;
      this.imageFrame.height = this.el.videoHeight * scale;
      this.imageFrame.x =
        this.frame.x + (this.frame.width - this.imageFrame.width) / 2;
      this.imageFrame.y =
        this.frame.y + (this.frame.height - this.imageFrame.height) / 2;
    } else {
      const scale = Math.min(
        this.el.videoWidth / this.frame.width,
        this.el.videoHeight / this.frame.height
      );
      this.imageFrame.width = this.frame.width * scale;
      this.imageFrame.height = this.frame.height * scale;
      this.imageFrame.x = (this.el.videoWidth - this.imageFrame.width) / 2;
      this.imageFrame.y = (this.el.videoHeight - this.imageFrame.height) / 2;
    }
  }

  public draw(ctx: CanvasRenderingContext2D, dirty: Rect): void {
    ctx.save();
    super.draw(ctx, dirty);
    if (this.el) {
      if (this.objectFit == "contain") {
        ctx.drawImage(
          this.el,
          this.imageFrame.x,
          this.imageFrame.y,
          this.imageFrame.width,
          this.imageFrame.height
        );
      } else {
        ctx.drawImage(
          this.el,
          this.imageFrame.x,
          this.imageFrame.y,
          this.imageFrame.width,
          this.imageFrame.height,
          this.frame.x,
          this.frame.y,
          this.frame.width,
          this.frame.height
        );
      }
    }
    ctx.restore();
  }
}
