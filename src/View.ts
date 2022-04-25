import { Rect } from "./Rect.js";

export interface LayoutConfig {
  dimensions: [number, number];
  margin: [number, number, number, number];
  weight: number;
}

export interface StyleConfig {
  backgroundColor: string;
  borderColor: string;
  borderRadius: [number, number, number, number];
  borderWidth: [number, number, number, number];
  shadowcolor: string;
  shadowWidth: [number, number, number, number];
}

export type Config = LayoutConfig & StyleConfig;

export class View {
  public frame: Rect = new Rect(0, 0, 0, 0);
  public config: Config;

  constructor(config: Partial<Config>, public children: View[] = []) {
    this.config = {
      dimensions: config.dimensions ?? [0, 0],
      margin: config.margin ?? [-1, -1, -1, -1],
      weight: config.weight ?? 1,
      backgroundColor: config.backgroundColor ?? "rgba(0,0,0,0)",
      borderColor: config.borderColor ?? "rgba(0,0,0,0)",
      borderRadius: config.borderRadius ?? [0, 0, 0, 0],
      borderWidth: config.borderWidth ?? [0, 0, 0, 0],
      shadowcolor: config.shadowcolor ?? "rgba(0,0,0,0)",
      shadowWidth: config.shadowWidth ?? [0, 0, 0, 0],
    };
  }

  layout(): void {}

  draw(ctx: CanvasRenderingContext2D, clip?: Rect): void {
    const frame = this.frame;
    clip = clip ? this.frame.intersection(clip) : this.frame;
    if (!clip?.width || !clip.height) return;

    ctx.save();

    ctx.rect(clip.x, clip.y, clip.width, clip.height);
    ctx.clip();

    ctx.fillStyle = this.config.backgroundColor ?? "black";
    const { x, y, width, height } = this.frame;
    ctx.fillRect(x, y, width, height);

    ctx.restore();
  }
}
