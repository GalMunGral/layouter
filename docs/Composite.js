import { Event } from "./Event";
import { Rect } from "./Geometry";
export class Composite {
    constructor() {
        this.visible = null;
    }
    get frame() {
        return this.root.frame;
    }
    redraw() {
        override;
        initLayout(public, override, draw(dirty, Rect), void {
            this: .root.draw(dirty)
        }, public, handle(e, Event), void {
            this: .root.handle(e)
        }, protected, initStyle(config, Partial(), T, {
            return: this.root.initStyle(config)
        }));
    }
}
