import { Display } from "./Display.js";
import { Font, Fonts, Glyph } from "./Font.js";
import { Rect } from "./Geometry.js";
import { View, ViewConfig } from "./View.js";
import { Event, MouseUpEvent } from "./Event.js";

export interface StyleConfig {}

export class Text extends View<string> {
  private font: Font;
  private lines: Array<string> = [];
  private unitsPerEm: number;
  private scale: number;
  public content: string;

  constructor(config: ViewConfig<string>) {
    super(config);
    this.content = this.children.join("");
    this.font = Fonts.get(this.props.font)!;
    this.unitsPerEm = this.font.unitsPerEm;
    this.props.size;
    this.scale = this.props.size / this.unitsPerEm;
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

    const spaceWidth = this.props.size / 4;
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
    super.draw(dirty);
    const ctx = Display.instance.ctx;
    ctx.save();
    ctx.fillStyle = "rgba(" + this.props.color.join(",") + ")";
    for (let [i, line] of this.lines.entries()) {
      if (this.props.size * (i + 1) > this.contentHeight) break;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(
        this.frame.x + this.props.padding[3],
        this.frame.y + this.props.padding[0] + this.props.size * i
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
