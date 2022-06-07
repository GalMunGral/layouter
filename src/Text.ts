import { Display } from "./Display.js";
import { Event } from "./Event.js";
import { Font, Fonts, Glyph } from "./Font.js";
import { Rect } from "./Geometry.js";
import { View, ViewConfig } from "./View.js";

export interface StyleConfig {}

export class Text extends View<string> {
  private lines: Array<string> = [];
  public content: string;

  public get font(): string {
    const props = this.deviceProps;
    return `${props.size}px ${props.fontFamily}`;
  }

  constructor(config: ViewConfig<string>) {
    super(config);
    this.content = this.children.join("");
  }

  public handle(e: Event): void {}

  public override layout(): void {
    this.lines = [];
    const props = this.deviceProps;
    let line = "";
    for (let c of this.content) {
      if (this.getTextWidth(line + c) > this.contentWidth) {
        this.lines.push(line);
        line = "";
        if (props.size * (this.lines.length + 1) > this.contentHeight) return;
      } else {
        line += c;
      }
    }
    this.lines.push(line);
  }

  private getTextWidth(word: string): number {
    const ctx = Display.instance.ctx;
    ctx.font = this.font;
    const metrics = ctx.measureText(word);
    return (
      Math.abs(metrics.actualBoundingBoxLeft) +
      Math.abs(metrics.actualBoundingBoxRight)
    );
  }

  override draw(dirty: Rect) {
    super.draw(dirty);
    const props = this.deviceProps;
    const ctx = Display.instance.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
    ctx.clip();
    ctx.fillStyle = "rgba(" + props.color.join(",") + ")";
    ctx.textBaseline = "top";
    const fontSize = props.size;
    if (this.props.textAlign == "center") {
      ctx.textAlign = "center";
      for (let [i, line] of this.lines.entries()) {
        ctx.fillText(
          line,
          this.frame.x + this.frame.width / 2,
          this.frame.y + props.padding[0] + fontSize * i
        );
      }
    } else {
      ctx.textAlign = "left";
      for (let [i, line] of this.lines.entries()) {
        ctx.fillText(
          line,
          this.frame.x + props.padding[3],
          this.frame.y + props.padding[0] + fontSize * i
        );
      }
    }
    ctx.restore();
  }
}
