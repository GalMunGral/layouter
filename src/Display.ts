import { MouseDownEvent, MouseMoveEvent, MouseUpEvent } from "./Event.js";
import { Point, Rect } from "./Geometry.js";
import { View } from "./View.js";

export class Display {
  public static instance: Display;
  public canvas = document.createElement("canvas");
  public ctx = this.canvas.getContext("2d")!;

  constructor(public root: View) {
    Display.instance = this;
    this.setupEvents();
    document.body.style.margin = "0px";
    document.body.append(this.canvas);
    this.render();
  }

  render() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.root.frame = new Rect(0, 0, this.canvas.width, this.canvas.height);
    this.root.visible = this.root.frame;
    this.root.layout();
    this.root.draw(this.root.frame);
  }

  setupEvents() {
    window.onresize = debounce(() => {
      this.render();
    }, 100);
    window.onmousedown = (e) => {
      this.root.handle(new MouseDownEvent(new Point(e.clientX, e.clientY)));
    };
    window.onmouseup = (e) => {
      this.root.handle(new MouseUpEvent(new Point(e.clientX, e.clientY)));
    };
    window.onmousemove = throttle((e) => {
      this.root.handle(new MouseMoveEvent(new Point(e.clientX, e.clientY)));
    });
  }
}

function debounce(f: (...arg: any[]) => void, timeout = 16) {
  let handle = -1;
  return function () {
    clearTimeout(handle);
    handle = setTimeout(f, timeout, ...arguments);
  };
}

function throttle(f: (...arg: any[]) => void, timeout = 16) {
  let t = Date.now();
  return function () {
    const now = Date.now();
    if (now - t < timeout) return;
    t = now;
    f(...arguments);
  };
}
