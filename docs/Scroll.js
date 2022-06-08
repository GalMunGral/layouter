import { Container } from "./Container.js";
import { Point } from "./Geometry.js";
import { Observable } from "./Observable.js";
export class Scroll extends Container {
    constructor(config) {
        super(config);
        this.offset = 0;
        this.minOffset = 0;
        this.scrolling = false;
        this.mousePosition = new Point(0, 0);
        this.delta = 0;
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
            this.redraw();
        });
    }
    scroll(delta) {
        this.delta = delta;
        this.offset += delta;
        this.offset = Math.min(this.offset, 0);
        this.offset = Math.max(this.offset, this.minOffset);
        this.layout();
        this.redraw();
    }
    handle(e) {
        super.handle(e);
    }
}
