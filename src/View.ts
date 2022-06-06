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
  shadowcolor: vec4;
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
    shadowcolor: [0, 0, 0, 0],
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

  public abstract layout(): void;
  public abstract draw(dirty: Rect): void;
  public abstract handle(e: Event): void;
  public redraw(): void {
    if (this.visible) {
      Display.instance.root.draw(this.visible);
    }
  }
  public destruct(): void {}
}
