import { Event, MouseClickEvent, MouseDownEvent, MouseUpEvent, WheelEvent, } from "./Event.js";
import { Point, Rect } from "./Geometry.js";
export class Display {
    constructor(root) {
        this.root = root;
        this.displayCanvas = document.createElement("canvas");
        this.displayCtx = this.displayCanvas.getContext("2d");
        this.isLayoutRoot = true;
        Display.instance = this;
        this.setupEvents();
        document.body.style.margin = "0px";
        document.body.append(this.displayCanvas);
        this.canvas = document.createElement("canvas");
        this.canvas.width = 10000;
        this.canvas.height = 10000;
        this.ctx = this.canvas.getContext("2d");
        this.render();
        console.log(this.root);
    }
    render() {
        this.displayCanvas.width = window.innerWidth * window.devicePixelRatio;
        this.displayCanvas.height = window.innerHeight * window.devicePixelRatio;
        this.displayCanvas.style.width = window.innerWidth + "px";
        this.displayCanvas.style.height = window.innerHeight + "px";
        this.root.outerFrame = this.root.frame = new Rect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
        this.root.layout();
        this.root.draw(this.ctx, this.root.outerFrame, true);
        this.compose(this.root.frame);
    }
    compose(dirty) {
        this.copy(this.canvas, dirty, new Point(0, 0));
        this.root.compose(dirty, new Point(0, 0));
    }
    copy(canvas, dest, translate) {
        const src = dest.translate(-translate.x, -translate.y);
        this.displayCtx.drawImage(canvas, src.x, src.y, src.width, src.height, dest.x, dest.y, dest.width, dest.height);
    }
    setupEvents() {
        window.onresize = debounce(() => {
            this.render();
        }, 100);
        window.onmousedown = (e) => {
            const pos = new Point(e.clientX * window.devicePixelRatio, e.clientY * window.devicePixelRatio);
            const evt = new MouseDownEvent(pos);
            this.root.handle(evt);
            Event.previous = evt;
        };
        window.onmouseup = (e) => {
            const pos = new Point(e.clientX * window.devicePixelRatio, e.clientY * window.devicePixelRatio);
            const evt = new MouseUpEvent(pos);
            this.root.handle(evt);
            Event.previous = evt;
        };
        window.onclick = (e) => {
            const pos = new Point(e.clientX * window.devicePixelRatio, e.clientY * window.devicePixelRatio);
            const evt = new MouseClickEvent(pos);
            this.root.handle(evt);
            Event.previous = evt;
        };
        // window.onmousemove = throttle((e) => {
        //   const pos = new Point(
        //     e.clientX * window.devicePixelRatio,
        //     e.clientY * window.devicePixelRatio
        //   );
        //   const evt = new MouseMoveEvent(pos);
        //   this.root.handle(evt);
        //   Event.previous = evt;
        // });
        window.onwheel = throttle((e) => {
            const pos = new Point(e.clientX * window.devicePixelRatio, e.clientY * window.devicePixelRatio);
            const evt = new WheelEvent(pos, e.deltaX * window.devicePixelRatio, e.deltaY * window.devicePixelRatio);
            this.root.handle(evt);
            Event.previous = evt;
        }, 16);
    }
}
function debounce(f, timeout = 16) {
    let handle = -1;
    return function () {
        clearTimeout(handle);
        handle = setTimeout(f, timeout, ...arguments);
    };
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
