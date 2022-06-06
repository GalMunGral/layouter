import { Display } from "./Display.js";
import { Event } from "./Event.js";
import { Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";
import { Scroll } from "./Scroll.js";

export type vec4 = [number, number, number, number];
export type vec2 = [number, number];

export type ViewProps<C> = {
  dimension: vec2;
  margin: vec4;
  weight: number;
  backgroundColor: vec4;
  borderColor: vec4;
  borderRadius: vec4;
  borderWidth: vec4;
  shadowColor: vec4;
  shadowWidth: vec4;
  padding: vec4;
  font: string;
  size: number;
  color: vec4;
};

export type ViewConfig<C = any> = Partial<{
  [K in keyof ViewProps<C>]: ViewProps<C>[K] | Observable<ViewProps<C>[K]>;
}> & { children?: Array<C> };

export abstract class View<C = any> {
  public frame: Rect = new Rect(0, 0, 0, 0);
  public visible: Rect | null = null;
  public parent?: View<any>;
  public children: Array<C> = [];

  private _props: ViewProps<C> = {
    dimension: [0, 0],
    margin: [0, 0, 0, 0],
    weight: 1,
    backgroundColor: [0, 0, 0, 0],
    borderColor: [0, 0, 0, 0],
    shadowColor: [0, 0, 0, 0],
    borderWidth: [0, 0, 0, 0],
    borderRadius: [0, 0, 0, 0],
    shadowWidth: [0, 0, 0, 0],
    padding: [4, 4, 4, 4],
    font: "Computer Modern",
    size: 16,
    color: [0, 0, 0, 1],
  };

  constructor(config: ViewConfig<C>) {
    if (config.children) {
      this.children = config.children;
      delete config.children;
    }
    for (let key of Object.keys(config) as Array<keyof ViewProps<C>>) {
      const init = config[key];
      if (init instanceof Observable) {
        init.subscribe((v) => {
          (this.props[key] as any) = v;
        });
      } else if (config[key]) {
        (this._props[key] as any) = init;
      }
    }
  }

  get props(): ViewProps<C> {
    const view = this;
    return new Proxy(this._props, {
      set(target, prop, value, receiver) {
        if (value == Reflect.get(target, prop, receiver)) return true;
        try {
          return Reflect.set(target, prop, value, receiver);
        } finally {
          if (view) {
            if (prop == "dimension" || prop == "margin" || prop == "weight") {
              let cur: View = view;
              const root = Display.instance.root;
              while (cur != root && !(cur instanceof Scroll)) cur = cur.parent!;
              queueMicrotask(() => {
                cur.layout();
                cur.redraw();
              });
            } else {
              queueMicrotask(() => {
                view.redraw();
              });
            }
          }
        }
      },
    });
  }

  protected get contentWidth(): number {
    return this.frame.width - this.props.padding[1] - this.props.padding[3];
  }

  protected get contentHeight(): number {
    return this.frame.height - this.props.padding[0] - this.props.padding[2];
  }

  public abstract layout(): void;

  public draw(dirty: Rect): void {
    const ctx = Display.instance.ctx;
    ctx.save();

    ctx.beginPath();
    ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
    ctx.clip();

    ctx.fillStyle = "rgba(" + this.props.backgroundColor.join(",") + ")";
    const { x, y, width, height } = this.frame;
    ctx.fillRect(x, y, width, height);
    ctx.restore();

    // TODO: SHADOWS
    const { shadowColor, shadowWidth } = this.props;
    const colorStart = "rgba(" + shadowColor.join(",") + ")";
    const colorEnd = "rgba(" + shadowColor.slice(0, 3).join(",") + ",0)";
    const x0 = x - shadowWidth[3];
    const x1 = x;
    const x2 = x + width;
    const x3 = x + width + shadowWidth[1];
    const y0 = y - shadowWidth[0];
    const y1 = y;
    const y2 = y + height;
    const y3 = y + height + shadowWidth[2];

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x3, y0);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.clip();
    {
      const gradient = ctx.createLinearGradient(x0, y1, x0, y0);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(x0, y0, x3 - x0, y1 - y0);
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x2, y1);
    ctx.lineTo(x3, y0);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.clip();
    {
      const gradient = ctx.createLinearGradient(x2, y0, x3, y0);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(x2, y0, x3 - x2, y3 - y0);
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y2);
    ctx.lineTo(x0, y3);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.clip();
    {
      const gradient = ctx.createLinearGradient(x0, y2, x0, y3);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(x0, y2, x3 - x0, y3 - y2);
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x1, y2);
    ctx.lineTo(x0, y3);
    ctx.closePath();
    ctx.clip();
    {
      const gradient = ctx.createLinearGradient(x1, y0, x0, y0);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(x0, y0, x1 - x0, y3 - y0);
    }
    ctx.restore();
  }
  public abstract handle(e: Event): void;
  public redraw(): void {
    if (this.visible) {
      Display.instance.root.draw(this.visible);
    }
  }
  public destruct(): void {}
}
