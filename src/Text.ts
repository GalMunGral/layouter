import { Display } from "./Display.js";
import { Event, MouseUpEvent } from "./Event.js";
import { Font, Fonts, Glyph } from "./Font.js";
import { Rect } from "./Geometry.js";
import { LayoutConfig, LayoutView } from "./View.js";

interface StyleConfig {
  color: string;
  padding: [number, number, number, number];
  backgroundColor: string;
  font: string;
  size: number;
}

export class Text extends LayoutView<StyleConfig> {
  private font: Font;
  private lines: Array<string> = [];
  private unitsPerEm: number;
  private scale: number;

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

  private get contentWidth(): number {
    return (
      this.frame.width -
      this.styleConfig.padding[1] -
      this.styleConfig.padding[3]
    );
  }

  private get contentHeight(): number {
    return (
      this.frame.height -
      this.styleConfig.padding[0] -
      this.styleConfig.padding[2]
    );
  }

  override initStyle(config: Partial<StyleConfig>) {
    return {
      color: config.color ?? "black",
      padding: config.padding ?? [4, 4, 4, 4],
      backgroundColor: config.backgroundColor ?? "white",
      font: config.font ?? "Computer Modern",
      size: config.size || 16,
    };
  }

  public override handle(e: Event): void {
    if (e instanceof MouseUpEvent) {
      console.log(this.content.split("").map((c) => this.font.glyphs[c]));
      e.handled = true;
    }
  }

  public override layout(): void {
    this.lines = [];
    const words = this.content.split(/\s+/);
    if (!words.length) return;

    const spaceWidth = this.styleConfig.size / 4;
    const getGlyphWidth = (c: string) => this.font.glyphs[c].width * this.scale;
    const getWordWidth = (word: string) =>
      word.split("").reduce((w, c) => w + getGlyphWidth(c), 0);

    let line = words.shift()!;
    let lineWidth = getWordWidth(line);
    for (let word of words) {
      const wordWidth = getWordWidth(word);
      if (lineWidth + spaceWidth + wordWidth > this.contentWidth) {
        this.lines.push(line);
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
      if (this.styleConfig.size * (i + 1) > this.contentHeight) break;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(
        this.frame.x + this.styleConfig.padding[3],
        this.frame.y + this.styleConfig.padding[0] + this.styleConfig.size * i
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
