import { Point } from "./Geometry.js";

export class Event {
  constructor(public point: Point) {}
}

export class MouseDownEvent extends Event {}
export class MouseUpEvent extends Event {}
export class MouseMoveEvent extends Event {}
export class MouseEnterEvent extends Event {}
export class MouseExitEvent extends Event {}
