export class Event {
    constructor(point) {
        this.point = point;
        this.handled = false;
    }
}
export class MouseDownEvent extends Event {
}
export class MouseUpEvent extends Event {
}
export class MouseMoveEvent extends Event {
}
export class MouseEnterEvent extends Event {
}
export class MouseClickEvent extends Event {
}
export class MouseExitEvent extends Event {
}
export class WheelEvent extends Event {
    constructor(point, deltaX, deltaY) {
        super(point);
        this.deltaX = deltaX;
        this.deltaY = deltaY;
    }
}
