import { Container } from "./Container.js";
import { Display } from "./Display.js";
import { Event, MouseEnterEvent, MouseExitEvent } from "./Event.js";
import { Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";
export class Scroll extends Container {
    constructor(config) {
        super(config);
        this.offsetX = 0;
        this.offsetY = 0;
        this.minOffsetX = 0;
        this.minOffsetY = 0;
        this.contentFrame = new Rect(0, 0, 0, 0);
        this.childMap = {};
        this.isLayoutRoot = true;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 5000;
        this.canvas.height = 5000;
        this.hiddenCtx = this.canvas.getContext("2d");
        if (config.data instanceof Observable) {
            config.data.subscribe((v) => {
                this.reload(v, config.renderItem);
            });
        }
        else {
            this.children = config.data.map((v) => config.renderItem(v));
            this.children.forEach((child) => (child.parent = this));
        }
    }
    get translateX() {
        return this.frame.x + this.offsetX;
    }
    get translateY() {
        return this.frame.y + this.offsetY;
    }
    reload(data, renderItem) {
        const childMap = {};
        this.children = [];
        for (let item of data) {
            if (!(item.id in this.childMap)) {
                const child = renderItem(item);
                child.parent = this;
                this.children.push(child);
            }
            else {
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
            this.drawContent(); // OPTIMIZE THIS
        });
    }
    handle(e) {
        var _a, _b;
        e.translate(-this.translateX, -this.translateY);
        for (let child of this.displayChildren) {
            if (child.frame.includes(e.point)) {
                if (!child.frame.includes((_a = Event.previous) === null || _a === void 0 ? void 0 : _a.point)) {
                    child.handle(new MouseEnterEvent(e.point));
                }
                child.handle(e);
            }
            else {
                if (child.frame.includes((_b = Event.previous) === null || _b === void 0 ? void 0 : _b.point)) {
                    child.handle(new MouseExitEvent(e.point));
                }
            }
        }
        e.translate(this.translateX, this.translateY);
        super.handle(e);
    }
    scroll(deltaX, deltaY) {
        this.offsetX = Math.max(Math.min(this.offsetX + deltaX, 0), this.minOffsetX);
        this.offsetY = Math.max(Math.min(this.offsetY + deltaY, 0), this.minOffsetY);
        let visible = this.outerFrame;
        for (let cur = this.parent; cur; cur = cur.parent) {
            visible = visible.translate(cur.translateX, cur.translateY);
        }
        Display.instance.compose(visible);
    }
    compose(dirty, translate) {
        translate = translate.translate(this.translateX, this.translateY);
        Display.instance.copy(this.canvas, dirty, translate);
        for (let child of this.displayChildren) {
            if (!(child instanceof Container))
                continue;
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
    draw(ctx, dirty, recursive) {
        ctx.save();
        super.draw(ctx, dirty);
        ctx.restore();
        if (recursive) {
            // INITIAL RENDER
            this.drawContent();
        }
    }
}
