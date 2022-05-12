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
      console.log(
        "[TEXT]",
        this.content.split("").map((c) => this.font.glyphs[c])
      );
    }
  }

  public override layout(): void {
    // TODO: text layout
    // TODO: kerning
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

    ctx.translate(this.frame.x, this.frame.y);
    ctx.scale(this.scale, this.scale);

    ctx.fillStyle = this.styleConfig.color;
    for (let c of this.content) {
      const glyph = this.font.glyphs[c];
      if (glyph) {
        this.drawGlyph(ctx, glyph);
        ctx.translate(glyph.width, 0);
      } else {
        // TODO: spaces ?
        ctx.translate(this.unitsPerEm / 4, 0);
      }
    }

    ctx.restore();
  }
}
