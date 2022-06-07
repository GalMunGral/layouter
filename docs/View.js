import { Display } from "./Display.js";
import { Rect } from "./Geometry.js";
import { Observable } from "./Observable.js";
export class View {
    constructor(config) {
        this.frame = new Rect(0, 0, 0, 0);
        this.outerFrame = new Rect(0, 0, 0, 0);
        this.visible = null;
        this.isLayoutRoot = false;
        this.children = [];
        this._props = {
            dimension: [0, 0],
            margin: [0, 0, 0, 0],
            weight: 1,
            backgroundColor: [0, 0, 0, 0],
            borderColor: [0, 0, 0, 0],
            shadowColor: [0, 0, 0, 0],
            borderWidth: 1,
            borderRadius: [0, 0, 0, 0],
            shadowOffset: [0, 0],
            shadowBlur: 0,
            padding: [4, 4, 4, 4],
            fontFamily: "monospace",
            textAlign: "center",
            color: [0, 0, 0, 1],
            size: 16,
        };
        if (config.children) {
            this.children = config.children;
            delete config.children;
        }
        for (let key of Object.keys(config)) {
            const init = config[key];
            if (init instanceof Observable) {
                init.subscribe((v) => {
                    this.props[key] = v;
                });
            }
            else if (config[key]) {
                this._props[key] = init;
            }
        }
    }
    get deviceProps() {
        const props = JSON.parse(JSON.stringify(this.props));
        for (let key of ["borderWidth", "shadowBlur", "size"]) {
            props[key] *= window.devicePixelRatio;
        }
        for (let key of [
            "dimension",
            "margin",
            "borderRadius",
            "shadowOffset",
            "padding",
        ]) {
            props[key] = props[key].map((x) => x * window.devicePixelRatio);
        }
        return props;
    }
    get props() {
        const view = this;
        return new Proxy(this._props, {
            set(target, prop, value, receiver) {
                if (value == Reflect.get(target, prop, receiver))
                    return true;
                try {
                    return Reflect.set(target, prop, value, receiver);
                }
                finally {
                    if (view) {
                        if (prop == "dimension" || prop == "margin" || prop == "weight") {
                            let cur = view;
                            const root = Display.instance.root;
                            while (cur != root && !cur.isLayoutRoot)
                                cur = cur.parent;
                            queueMicrotask(() => {
                                cur.layout();
                                cur.redraw();
                            });
                        }
                        else {
                            queueMicrotask(() => {
                                view.redraw();
                            });
                        }
                    }
                }
            },
        });
    }
    get contentWidth() {
        const props = this.deviceProps;
        return this.frame.width - props.padding[1] - props.padding[3];
    }
    get contentHeight() {
        const props = this.deviceProps;
        return this.frame.height - props.padding[0] - props.padding[2];
    }
    draw(dirty) {
        const ctx = Display.instance.ctx;
        const { backgroundColor, borderColor, shadowColor, shadowOffset, shadowBlur, borderWidth: bw, borderRadius, } = this.deviceProps;
        const { x, y, width, height } = this.frame;
        const [r0, r1, r2, r3] = borderRadius;
        const p = new Path2D();
        p.moveTo(x + r0, y);
        p.lineTo(x + width - r1, y);
        p.arcTo(x + width, y, x + width, y + r1, r1);
        p.lineTo(x + width, y + height - r2);
        p.arcTo(x + width, y + height, x + width - r2, y + height, r2);
        p.lineTo(x + r3, y + height);
        p.arcTo(x, y + height, x, y + height - r3, r3);
        p.lineTo(x, y + r0);
        p.arcTo(x, y, x + r0, y, r0);
        ctx.save();
        ctx.beginPath();
        ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
        ctx.clip();
        ctx.fillStyle = "rgba(" + backgroundColor.join(",") + ")";
        ctx.shadowColor = "rgba(" + shadowColor.join(",") + ")";
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowOffset[0];
        ctx.shadowOffsetY = shadowOffset[1];
        ctx.beginPath();
        ctx.fill(p);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(" + borderColor.join(",") + ")";
        ctx.lineWidth = bw;
        ctx.moveTo(x + r0, y - bw / 2);
        ctx.lineTo(x + width - r1, y - bw / 2);
        ctx.arcTo(x + width + bw / 2, y - bw / 2, x + width + bw / 2, y + r1, r1 + bw / 2);
        ctx.lineTo(x + width + bw / 2, y + height - r2);
        ctx.arcTo(x + width + bw / 2, y + height + bw / 2, x + width - r2, y + height + bw / 2, r2 + bw / 2);
        ctx.lineTo(x + r3, y + height + bw / 2);
        ctx.arcTo(x - bw / 2, y + height + bw / 2, x - bw / 2, y + height - r3, r3 + bw / 2);
        ctx.lineTo(x - bw / 2, y + r0);
        ctx.arcTo(x - bw / 2, y - bw / 2, x + r0, y - bw / 2, r0 + bw / 2);
        ctx.stroke();
        ctx.restore();
    }
    redraw() {
        if (this.visible) {
            Display.instance.root.draw(this.visible);
        }
    }
    destruct() { }
}
