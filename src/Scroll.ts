import { Container } from "./Container.js";
import { Event, MouseDownEvent, MouseUpEvent } from "./Event.js";
import { Point } from "./Geometry.js";
import { Observable } from "./Observable.js";
import { View, ViewConfig } from "./View.js";

type ScrollConfig<T extends { id: string }> = {
  data: Array<T> | Observable<Array<T>>;
  renderItem: (t: T) => View;
};

export abstract class Scroll<T extends { id: string }> extends Container {
  protected offset = 0;
  protected minOffset = 0;
  protected scrolling = false;
  protected mousePosition: Point = new Point(0, 0);
  protected delta = 0;
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
      this.redraw();
    });
  }

  protected scroll(delta: number) {
    this.delta = delta;
    this.offset += delta;
    this.offset = Math.min(this.offset, 0);
    this.offset = Math.max(this.offset, this.minOffset);
    this.layout();
    this.redraw();
  }

  handle(e: Event): void {
    super.handle(e);
  }
}
