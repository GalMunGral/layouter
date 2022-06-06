import { Event } from "./Event.js";
import { Rect } from "./Geometry.js";

export abstract class View<
  Layout extends object = any,
  Style extends object = any
> {
  frame: Rect = new Rect(0, 0, 0, 0);
  visible: Rect | null = null;
  layoutConfig: Layout;
  styleConfig: Style;
  parent?: View<any, any>;

  constructor(config: Partial<Layout & Style>) {
    const view = this;
    this.layoutConfig = new Proxy(this.initLayout(config), {
      set(target, prop, value, receiver) {
        if (value == Reflect.get(target, prop, receiver)) return true;
        try {
          return Reflect.set(target, prop, value, receiver);
        } finally {
          view.layout();
          view.redraw();
        }
      },
    });
    this.styleConfig = new Proxy(this.initStyle(config), {
      set(target, prop, value, receiver) {
        if (value == Reflect.get(target, prop, receiver)) return true;
        try {
          return Reflect.set(target, prop, value, receiver);
        } finally {
          view.redraw();
        }
      },
    });
  }

  public abstract initLayout(config: Partial<Style & Layout>): Layout;
  public abstract initStyle(config: Partial<Style & Layout>): Style;

  public abstract layout(): void;
  public abstract draw(dirty: Rect): void;

  public abstract handle(e: Event): void;
  public redraw(): void {
    if (this.visible) {
      this.draw(this.visible);
    }
  }
}

export interface LayoutConfig<ChildType = LayoutView<any, any>> {
  dimension: [number, number];
  margin: [number, number, number, number];
  weight: number;
  children: Array<ChildType>;
}

export abstract class LayoutView<
  Style extends object,
  ChildType = LayoutView<any, any>
> extends View<LayoutConfig<ChildType>, Style> {
  override initLayout(
    config: Partial<LayoutConfig<ChildType> & Style>
  ): LayoutConfig<ChildType> {
    const view = this;
    return new Proxy(
      {
        dimension: config.dimension ?? [0, 0],
        margin: config.margin ?? [-1, -1, -1, -1],
        weight: config.weight ?? 1,
        children: config.children ?? [],
      },
      {
        set(target, prop, value, receiver) {
          if (value == Reflect.get(target, prop, receiver)) return true;
          try {
            return Reflect.set(target, prop, value, receiver);
          } finally {
            view.parent?.layout();
            view.parent?.redraw();
          }
        },
      }
    );
  }
}
