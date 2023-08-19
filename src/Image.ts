import { Display } from "./Display.js";
import { Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";
import { View, ViewConfig } from "./View.js";

type ImageConfig = {
  url: string | Observable<string>;
  objectFit: "contain" | "cover";
};

export class Image extends View {
  private el: HTMLImageElement | null = null;
  private imageFrame: Rect = new Rect(0, 0, 0, 0);
  public objectFit: "contain" | "cover";
  constructor(config: ViewConfig & ImageConfig) {
    super(config);
    this.objectFit = config.objectFit;
    if (config.url instanceof Observable) {
      config.url.subscribe((v) => {
        const el = document.createElement("img");
        el.src = v;
        el.onload = () => {
          this.el = el;
          this.layout();
          this.redraw("image updated");
        };
      });
    } else {
      const el = document.createElement("img");
      el.src = config.url;
      el.onload = () => {
        this.el = el;
        this.layout();
        this.redraw("image loaded");
      };
    }
  }

  public override layout(): void {
    if (!this.el) return;
    if (this.objectFit == "contain") {
      const scale = Math.min(
        this.frame.width / this.el.naturalWidth,
        this.frame.height / this.el.naturalHeight
      );
      this.imageFrame.width = this.el.naturalWidth * scale;
      this.imageFrame.height = this.el.naturalHeight * scale;
      this.imageFrame.x =
        this.frame.x + (this.frame.width - this.imageFrame.width) / 2;
      this.imageFrame.y =
        this.frame.y + (this.frame.height - this.imageFrame.height) / 2;
    } else {
      const scale = Math.min(
        this.el.naturalWidth / this.frame.width,
        this.el.naturalHeight / this.frame.height
      );
      this.imageFrame.width = this.frame.width * scale;
      this.imageFrame.height = this.frame.height * scale;
      this.imageFrame.x = (this.el.naturalWidth - this.imageFrame.width) / 2;
      this.imageFrame.y = (this.el.naturalHeight - this.imageFrame.height) / 2;
    }
  }

  public override draw(ctx: CanvasRenderingContext2D, dirty: Rect): void {
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
