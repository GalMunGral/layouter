import { Container } from "./Container.js";
import { Display } from "./Display.js";
import { Observable } from "./Observable.js";
export class Scroll extends Container {
    constructor(config) {
        super(config);
        this.offsetX = 0;
        this.offsetY = 0;
        this.minOffsetX = 0;
        this.minOffsetY = 0;
        this.childMap = {};
        this.isLayoutRoot = true;
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
            this.updateVisibility(this.visible);
            this.redraw();
        });
    }
    scroll(deltaX, deltaY) {
        this.offsetX = Math.max(Math.min(this.offsetX + deltaX, 0), this.minOffsetX);
        this.offsetY = Math.max(Math.min(this.offsetY + deltaY, 0), this.minOffsetY);
        this.redraw();
    }
    updateVisibility(visible) {
        this.visible = this.outerFrame.intersect(visible);
        let visibleInside = this.frame.intersect(visible);
        if (!visibleInside)
            return;
        visibleInside = visibleInside.translate(-this.translateX, -this.translateY);
        for (let child of this.children) {
            child.updateVisibility(visibleInside);
        }
    }
    draw(dirty) {
        const ctx = Display.instance.ctx;
        ctx.save();
        super.draw(dirty);
        ctx.translate(this.translateX, this.translateY);
        const dirty$ = dirty.translate(-this.translateX, -this.translateY);
        for (let child of this.visibleChildren) {
            const d = dirty$.intersect(child.visible);
            if (d)
                child.draw(d);
        }
        ctx.restore();
    }
    handle(e) {
        super.handle(e);
    }
}
