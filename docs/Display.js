import { MouseDownEvent, MouseMoveEvent, MouseUpEvent } from "./Event.js";
import { Point, Rect } from "./Geometry.js";
export class Display {
    constructor(root) {
        this.root = root;
        this.frame = new Rect(0, 0, window.innerWidth, window.innerHeight);
        Display.instance = this;
        this.root.frame = this.frame;
        const canvas = document.createElement("canvas");
        this.ctx = canvas.getContext("2d");
        this.setupCanvas(canvas);
    }
    setupCanvas(el) {
        el.width = window.innerWidth;
        el.height = window.innerHeight;
        el.onmousedown = (e) => this.root.handle(new MouseDownEvent(new Point(e.clientX, e.clientY)));
        el.onmouseup = (e) => this.root.handle(new MouseUpEvent(new Point(e.clientX, e.clientY)));
        el.onmousemove = throttle((e) => this.root.handle(new MouseMoveEvent(new Point(e.clientX, e.clientY))));
        document.body.style.margin = "0px";
        document.body.append(el);
    }
    draw() {
        this.root.layout();
        this.root.draw();
    }
}
function throttle(f, timeout = 16) {
    let t = Date.now();
    return function () {
        const now = Date.now();
        if (now - t < timeout)
            return;
        t = now;
        f(...arguments);
    };
}
