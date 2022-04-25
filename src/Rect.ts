export class Rect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  intersection(other?: Rect) {
    if (!other) return this;
    const left = Math.max(this.x, other.x);
    const right = Math.min(this.x + this.width, other.x + other.width);
    const width = right - left;
    const top = Math.max(this.y, other.y);
    const bottom = Math.min(this.y + this.height, other.y + other.height);
    const height = bottom - top;
    return new Rect(left, top, width, height);
  }
}
