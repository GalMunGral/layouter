import { Event } from "./Event.js";
import { Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";

export type ViewProps<C> = {
  dimension: [number, number];
  margin: [number, number, number, number];
  weight: number;
  backgroundColor: string;
  borderColor: string;
  borderRadius: [number, number, number, number];
  borderWidth: [number, number, number, number];
  shadowcolor: string;
  shadowWidth: [number, number, number, number];
  padding: [number, number, number, number];
  font: string;
  size: number;
  color: string;
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
    margin: [-1, -1, -1, -1],
    weight: 1,
    backgroundColor: "rgba(0,0,0,0)",
    borderColor: "rgba(0,0,0,0)",
    shadowcolor: "rgba(0,0,0,0)",
    borderWidth: [0, 0, 0, 0],
    borderRadius: [0, 0, 0, 0],
    shadowWidth: [0, 0, 0, 0],
    padding: [4, 4, 4, 4],
    font: "Computer Modern",
    size: 16,
    color: "black",
  };

  constructor(config: ViewConfig<C>) {
    if (config.children) {
      this.children = config.children;
      delete config.children;
    }
    for (let key of Object.keys(config) as Array<keyof ViewProps<C>>) {
      const init = config[key];
      if (init instanceof Observable) {
        (this._props[key] as any) = init;
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
          if (prop == "dimension" || prop == "margin" || prop == "weight") {
            view.parent?.layout();
          }
          view.parent?.redraw();
        }
      },
    });
  }

  public abstract layout(): void;
  public abstract draw(dirty: Rect): void;
  public abstract handle(e: Event): void;
  public redraw(): void {
    if (this.visible) {
      this.draw(this.visible);
    }
  }
}
