import { Display } from "./Display.js";
import { Event, MouseUpEvent } from "./Event.js";
import { Font, Fonts, Glyph } from "./Font.js";
import { Rect } from "./Geometry.js";
import { LayoutConfig, LayoutView } from "./View.js";

interface StyleConfig {
  color: string;
  backgroundColor: string;
  font: string;
  size: number;
}

export class Text extends LayoutView<StyleConfig> {
  private font: Font;
  private lines: Array<string> = [];
  private unitsPerEm: number;
  private scale: number;

  // TODO: padding;
  private padding = [2, 2, 2, 2] as const;

  constructor(
    public content: string,
    config: Partial<LayoutConfig & StyleConfig>
  ) {
    super(config);
    this.font = Fonts.get(this.styleConfig.font)!;
    this.unitsPerEm = this.font.unitsPerEm;
    this.styleConfig.size;
    this.scale = this.styleConfig.size / this.unitsPerEm;
  }

  override initStyle(config: Partial<StyleConfig>) {
    return {
      color: config.color ?? "black",
      backgroundColor: config.backgroundColor ?? "white",
      font: config.font ?? "Computer Modern",
      size: config.size || 16,
    };
  }

  public override handle(e: Event): void {
    if (e instanceof MouseUpEvent) {
      // this.layoutConfig.weight++;
      console.log(this.content.split("").map((c) => this.font.glyphs[c]));
      e.handled = true;
    }
  }

  public override layout(): void {
    this.lines = [];
    const words = this.content.split(/\s/);

    const lineHeight = this.styleConfig.size; // ??
    const spaceWidth = this.styleConfig.size / 4; // ??
    const glyphWidth = (c: string) => this.font.glyphs[c].width * this.scale;

    let contentHeight = 0;
    let line = "";
    let lineWidth = 0;
    for (let word of words) {
      const wordWidth = word.split("").reduce((w, c) => w + glyphWidth(c), 0);
      if (
        lineWidth + wordWidth >
        this.frame.width - this.padding[1] - this.padding[3]
      ) {
        if (
          contentHeight + lineHeight >
          this.frame.height - this.padding[0] - this.padding[2]
        )
          break;
        this.lines.push(line);
        contentHeight += lineHeight;
        line = word;
        lineWidth = wordWidth;
      } else {
        line += " " + word;
        lineWidth += spaceWidth + wordWidth;
      }
    }
    this.lines.push(line);
  }

  private drawGlyph(ctx: CanvasRenderingContext2D, glyph: Glyph): void {
    if (!this.font) return;
    ctx.beginPath();
    for (let cmd of glyph.outline) {
      switch (cmd.type) {
        case "MOVE_TO":
          ctx.moveTo(cmd.x, glyph.height - cmd.y);
          break;
        case "LINE_TO":
          ctx.lineTo(cmd.x, glyph.height - cmd.y);
          break;
        case "QUADRATIC_BEZIER":
          ctx.quadraticCurveTo(
            cmd.cx,
            glyph.height - cmd.cy,
            cmd.x,
            glyph.height - cmd.y
          );
          break;
        case "CLOSE_PATH":
          ctx.closePath();
          break;
      }
    }
    ctx.fill();
  }

  override draw(dirty: Rect) {
    if (!this.font) return;
    const ctx = Display.instance.ctx;
    ctx.save();
    ctx.beginPath();

    ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
    ctx.clip();

    ctx.fillStyle = this.styleConfig.backgroundColor ?? "black";
    const { x, y, width, height } = this.frame;
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = this.styleConfig.color;
    for (let [i, line] of this.lines.entries()) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(
        this.frame.x + this.padding[3],
        this.frame.y + this.padding[0] + this.styleConfig.size * i
      );
      ctx.scale(this.scale, this.scale);
      for (let c of line) {
        const glyph = this.font.glyphs[c];
        if (glyph) {
          // TODO: kerning
          this.drawGlyph(ctx, glyph);
          ctx.translate(glyph.width, 0);
        } else {
          // TODO: spaces ?
          ctx.translate(this.unitsPerEm / 4, 0);
        }
      }
    }

    ctx.restore();
  }
}
