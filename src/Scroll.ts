import { Container } from "./Container.js";
import { Display } from "./Display.js";
import { Event, MouseEnterEvent, MouseExitEvent } from "./Event.js";
import { Point, Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";
import { View, ViewConfig } from "./View.js";

type ScrollConfig<T extends { id: string }> = {
  data: Array<T> | Observable<Array<T>>;
  renderItem: (t: T, i: number) => View;
};

export abstract class Scroll<T extends { id: string } = any> extends Container {
  public hiddenCtx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  protected offsetX = 0;
  protected offsetY = 0;
  protected minOffsetX = 0;
  protected minOffsetY = 0;
  public contentFrame: Rect = new Rect(0, 0, 0, 0);
  private childMap: Record<string, View> = {};
  public override isLayoutRoot = true;

  constructor(config: ViewConfig & ScrollConfig<T>) {
    super(config);
    this.canvas = document.createElement("canvas");
    this.canvas.width = 5000;
    this.canvas.height = 5000;
    this.hiddenCtx = this.canvas.getContext("2d")!;

    if (config.data instanceof Observable) {
      config.data.subscribe((v) => {
        this.reload(v, config.renderItem);
        queueMicrotask(() => {
          this.layout();
          this.drawContent(); // OPTIMIZE THIS
          let visible = this.outerFrame;
          for (let cur = this.parent; cur; cur = cur.parent) {
            visible = visible.translate(cur.translateX, cur.translateY);
          }
          Display.instance.compose(visible);
        });
      });
    } else {
      this.children = config.data.map((v, i) => config.renderItem(v, i));
      this.children.forEach((child) => (child.parent = this));
    }
  }

  override get translateX() {
    return this.frame.x + this.offsetX;
  }

  override get translateY() {
    return this.frame.y + this.offsetY;
  }
  private reload(data: Array<T>, renderItem: (t: T, i: number) => View): void {
    const childMap: Record<string, View> = {};
    this.children = [];
    for (let [i, item] of data.entries()) {
      if (!(item.id in this.childMap)) {
        const child = renderItem(item, i);
        child.parent = this;
        this.children.push(child);
      } else {
        this.children.push(this.childMap[item.id]);
        delete this.childMap[item.id];
      }
      childMap[item.id] = this.children[this.children.length - 1];
    }
    for (let view of Object.values(this.childMap)) {
      view.destruct();
    }
    this.childMap = childMap;
  }

  override handle(e: Event): void {
    e.translate(-this.translateX, -this.translateY);
    for (let child of this.displayChildren) {
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
    e.translate(this.translateX, this.translateY);
    super.handle(e);
  }

  protected scroll(deltaX: number, deltaY: number) {
    this.offsetX = Math.max(
      Math.min(this.offsetX + deltaX, 0),
      this.minOffsetX
    );
    this.offsetY = Math.max(
      Math.min(this.offsetY + deltaY, 0),
      this.minOffsetY
    );
    let visible = this.outerFrame;

    for (let cur = this.parent; cur; cur = cur.parent) {
      visible = visible.translate(cur.translateX, cur.translateY);
    }
    Display.instance.compose(visible);
  }

  override compose(dirty: Rect, translate: Point) {
    translate = translate.translate(this.translateX, this.translateY);
    Display.instance.copy(this.canvas, dirty, translate);
    for (let child of this.displayChildren) {
      if (!(child instanceof Container)) continue;
      const d = child.frame
        .translate(translate.x, translate.y)
        .intersect(dirty);
      if (d) {
        child.compose(d, translate);
      }
    }
  }

  drawContent() {
    const { x, y, width, height } = this.contentFrame;
    this.hiddenCtx.clearRect(x, y, width, height);
    for (let child of this.displayChildren) {
      child.draw(this.hiddenCtx, this.contentFrame, true);
    }
  }

  override draw(
    ctx: CanvasRenderingContext2D,
    dirty: Rect,
    recursive?: boolean
  ) {
    ctx.save();
    super.draw(ctx, dirty);
    ctx.restore();
    if (recursive) {
      // INITIAL RENDER
      this.drawContent();
    }
  }
}
