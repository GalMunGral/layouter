export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    translate(deltaX, deltaY) {
        return new Point(this.x + deltaX, this.y + deltaY);
    }
}
export class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    intersect(other) {
        if (!other)
            return null;
        const left = Math.max(this.x, other.x);
        const right = Math.min(this.x + this.width, other.x + other.width);
        if (left >= right)
            return null;
        const width = right - left;
        const top = Math.max(this.y, other.y);
        const bottom = Math.min(this.y + this.height, other.y + other.height);
        if (top >= bottom)
            return null;
        const height = bottom - top;
        return new Rect(left, top, width, height);
    }
    translate(deltaX, deltaY) {
        return new Rect(this.x + deltaX, this.y + deltaY, this.width, this.height);
    }
    includes(p) {
        return (p &&
            p.x >= this.x &&
            p.x < this.x + this.width &&
            p.y >= this.y &&
            p.y < this.y + this.height);
    }
}
