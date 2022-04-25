import { Display } from "./Display.js";
import {
  Event,
  MouseClickEvent,
  MouseDownEvent,
  MouseUpEvent,
} from "./Event.js";
import { Rect } from "./Geometry.js";

export interface LayoutConfig {
  dimension: [number, number];
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
  public visible: Rect | null = null;
  public config: Config;
  public parent?: View;

  constructor(config: Partial<Config>) {
    const _config = {
      dimension: config.dimension ?? [0, 0],
      margin: config.margin ?? [-1, -1, -1, -1],
      weight: config.weight ?? 1,
      backgroundColor: config.backgroundColor ?? "rgba(0,0,0,0)",
      borderColor: config.borderColor ?? "rgba(0,0,0,0)",
      borderRadius: config.borderRadius ?? [0, 0, 0, 0],
      borderWidth: config.borderWidth ?? [0, 0, 0, 0],
      shadowcolor: config.shadowcolor ?? "rgba(0,0,0,0)",
      shadowWidth: config.shadowWidth ?? [0, 0, 0, 0],
    };
    this.config = this.observe(_config);
  }

  protected observe(config: Config): Config {
    const view = this;
    return new Proxy(config, {
      set(target, prop, value, receiver) {
        if (value == Reflect.get(target, prop, receiver)) return true;
        try {
          return Reflect.set(target, prop, value, receiver);
        } finally {
          if (prop == "dimension" || prop == "margin" || prop == "weight") {
            view.parent?.layout();
            view.parent?.redraw();
          } else {
            view.redraw();
          }
        }
      },
    });
  }

  protected redraw(): void {
    if (this.visible) {
      this.draw(this.visible);
    }
  }

  public handle(e: Event): void {}

  public layout(): void {}

  public draw(dirty: Rect): void {
    const ctx = Display.instance.ctx;
    ctx.save();

    ctx.beginPath();
    ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
    ctx.clip();

    ctx.fillStyle = this.config.backgroundColor ?? "black";
    const { x, y, width, height } = this.frame;
    ctx.fillRect(x, y, width, height);

    ctx.restore();
  }
}
