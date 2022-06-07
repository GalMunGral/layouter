import { Point } from "./Geometry.js";

export class Event {
  static previous: Event;
  public handled = false;
  constructor(public point: Point) {}
}

export class MouseDownEvent extends Event {}
export class MouseUpEvent extends Event {}
export class MouseMoveEvent extends Event {}
export class MouseEnterEvent extends Event {}
export class MouseClickEvent extends Event {}
export class MouseExitEvent extends Event {}
export class WheelEvent extends Event {
  constructor(point: Point, public deltaX: number, public deltaY: number) {
    super(point);
  }
}
