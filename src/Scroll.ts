import { Container } from "./Container.js";
import { Display } from "./Display.js";
import { Event, MouseDownEvent, MouseUpEvent } from "./Event.js";
import { Point, Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";
import { View, ViewConfig } from "./View.js";

type ScrollConfig<T extends { id: string }> = {
  data: Array<T> | Observable<Array<T>>;
  renderItem: (t: T) => View;
};

export abstract class Scroll<T extends { id: string }> extends Container {
  protected offsetX = 0;
  protected offsetY = 0;
  protected minOffsetX = 0;
  protected minOffsetY = 0;
  private childMap: Record<string, View> = {};
  public override isLayoutRoot = true;

  constructor(config: ViewConfig & ScrollConfig<T>) {
    super(config);
    if (config.data instanceof Observable) {
      config.data.subscribe((v) => {
        this.reload(v, config.renderItem);
      });
    } else {
      this.children = config.data.map((v) => config.renderItem(v));
      this.children.forEach((child) => (child.parent = this));
    }
  }

  override get translateX() {
    return this.frame.x + this.offsetX;
  }

  override get translateY() {
    return this.frame.y + this.offsetY;
  }

  private reload(data: Array<T>, renderItem: (t: T) => View): void {
    const childMap: Record<string, View> = {};
    this.children = [];
    for (let item of data) {
      if (!(item.id in this.childMap)) {
        const child = renderItem(item);
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
    queueMicrotask(() => {
      this.layout();
      this.updateVisibility(this.visible);
      this.redraw();
    });
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
    this.redraw();
  }

  override updateVisibility(visible: Rect | null): void {
    this.visible = this.outerFrame.intersect(visible);
    let visibleInside = this.frame.intersect(visible);
    if (!visibleInside) return;
    visibleInside = visibleInside.translate(-this.translateX, -this.translateY);
    for (let child of this.children) {
      child.updateVisibility(visibleInside);
    }
  }

  override draw(dirty: Rect) {
    const ctx = Display.instance.ctx;
    ctx.save();
    super.draw(dirty);
    ctx.translate(this.translateX, this.translateY);
    const dirty$ = dirty.translate(-this.translateX, -this.translateY);
    for (let child of this.visibleChildren) {
      const d = dirty$.intersect(child.visible);
      if (d) child.draw(d);
    }
    ctx.restore();
  }

  handle(e: Event): void {
    super.handle(e);
  }
}
