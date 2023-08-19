import { Display } from "./Display.js";
import { Event } from "./Event.js";
import { Point, Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";
import { View, ViewConfig } from "./View.js";

export interface StyleConfig {}

export class Text extends View<string | Observable<string>> {
  private lines: Array<string> = [];
  public content: string = "";

  public get font(): string {
    const props = this.deviceProps;
    return `${props.fontWeight} ${props.fontSize}px ${props.fontFamily}`;
  }

  constructor(config: ViewConfig<string | Observable<string>>) {
    super(config);
    if (this.children[0] instanceof Observable) {
      // TODO combine observables
      this.children[0].subscribe((v) => {
        queueMicrotask(() => {
          this.layout();
          this.redraw("text updated");
        });
        this.content = v;
      });
    } else {
      this.content = this.children.join("");
    }
  }

  public handle(e: Event): void {
    super.handle(e);
  }

  public override layout(): void {
    this.lines = [];
    const props = this.deviceProps;
    let line = "";
    for (let c of this.content) {
      if (this.getTextWidth(line + c) > this.contentWidth) {
        this.lines.push(line);
        line = c;
        if (props.fontSize * (this.lines.length + 1) > this.contentHeight)
          return;
      } else {
        line += c;
      }
    }
    this.lines.push(line);
  }

  private getTextWidth(s: string): number {
    const ctx = Display.instance.displayCtx;
    ctx.font = this.font;
    const metrics = ctx.measureText(s);
    return (
      Math.abs(metrics.actualBoundingBoxLeft) +
      Math.abs(metrics.actualBoundingBoxRight)
    );
  }

  override draw(ctx: CanvasRenderingContext2D, dirty: Rect) {
    ctx.save();
    super.draw(ctx, dirty);
    const props = this.deviceProps;
    ctx.font = this.font;
    ctx.fillStyle = "rgba(" + props.color.join(",") + ")";
    ctx.textBaseline = "top";
    if (this.props.textAlign == "center") {
      ctx.textAlign = "center";
      for (let [i, line] of this.lines.entries()) {
        ctx.fillText(
          line,
          this.frame.x + this.frame.width / 2,
          this.frame.y + props.padding[0] + props.fontSize * i
        );
      }
    } else {
      ctx.textAlign = "left";
      for (let [i, line] of this.lines.entries()) {
        ctx.fillText(
          line,
          this.frame.x + props.padding[3],
          this.frame.y + props.padding[0] + props.fontSize * i
        );
      }
    }
    ctx.restore();
  }
}
