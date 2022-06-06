import { Display } from "./Display.js";
import {
  Event,
  MouseClickEvent,
  MouseEnterEvent,
  MouseExitEvent,
} from "./Event.js";
import { Rect } from "./Geometry.js";
import { LayoutConfig, LayoutView } from "./View.js";

export interface StyleConfig {
  backgroundColor: string;
  borderColor: string;
  borderRadius: [number, number, number, number];
  borderWidth: [number, number, number, number];
  shadowcolor: string;
  shadowWidth: [number, number, number, number];
}

export abstract class Container extends LayoutView<StyleConfig> {
  public children: Array<LayoutView<any>> = [];
  constructor(config: Partial<LayoutConfig & StyleConfig>) {
    super(config);
    if (config.children)
      for (let child of config.children) {
        child.parent = this;
      }
    // TODO: other methods
    const parent = this;

    this.children = this.layoutConfig.children;

    this.children.push = function (view: LayoutView<any>): number {
      view.parent = parent;
      Array.prototype.push.call(this, view);
      queueMicrotask(() => {
        parent.layout();
        parent.redraw();
      });
      return this.length;
    };
  }

  public initStyle(config: Partial<StyleConfig & LayoutConfig>): StyleConfig {
    return {
      backgroundColor: config.backgroundColor ?? "rgba(0,0,0,0)",
      borderColor: config.borderColor ?? "rgba(0,0,0,0)",
      borderWidth: config.borderWidth ?? [0, 0, 0, 0],
      borderRadius: config.borderRadius ?? [0, 0, 0, 0],
      shadowcolor: config.shadowcolor ?? "rgba(0,0,0,0)",
      shadowWidth: config.shadowWidth ?? [0, 0, 0, 0],
    };
  }

  override handle(e: Event): void {
    for (let child of this.children) {
      if (child.frame.includes(e.point)) {
        if (!child.frame.includes(Event.previous?.point)) {
          child.handle(new MouseEnterEvent(e.point));
        }
        child.handle(e);
      } else {
        if (child.frame.includes(Event.previous?.point)) {
          child.handle(new MouseExitEvent(e.point));
        }
      }
    }
    if (e instanceof MouseClickEvent && !e.handled) {
      this.layoutConfig.weight++;
      this.layoutConfig.dimension[0]++;
      this.layoutConfig.dimension[1]++;
      e.handled = true;
    }
  }

  protected layoutChildren() {
    for (let child of this.children) {
      child.visible = child.frame.intersect(this.visible);
      child.layout();
    }
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

    ctx.restore();

    for (let child of this.children) {
      const d = dirty.intersect(child.visible);
      if (d) child.draw(d);
    }
  }
}
