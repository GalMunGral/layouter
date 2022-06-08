import { Display } from "./Display.js";
import { View } from "./View.js";
const { cos, sin, acos, PI, sqrt } = Math;
export class Path extends View {
    constructor(config) {
        super(config);
        this.paths = config.paths.map(({ width, height, d }) => ({
            width,
            height,
            commands: parseSvgPath(d),
        }));
    }
    draw(dirty) {
        const ctx = Display.instance.ctx;
        ctx.save();
        super.draw(dirty);
        ctx.fillStyle = "rgba(" + this.props.color.join(",") + ")";
        ctx.strokeStyle = "rgba(" + this.props.color.join(",") + ")";
        for (let path of this.paths) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(this.frame.x, this.frame.y);
            ctx.scale(this.frame.width / path.width, this.frame.height / path.height);
            ctx.beginPath();
            for (let cmd of path.commands) {
                switch (cmd.type) {
                    case "MOVE_TO":
                        ctx.moveTo(cmd.x, cmd.y);
                        break;
                    case "LINE_TO":
                    case "ELLIPSE_LINE_TO":
                        ctx.lineTo(cmd.x, cmd.y);
                        break;
                    case "CUBIC_BEZIER":
                        ctx.bezierCurveTo(cmd.cx1, cmd.cy1, cmd.cx2, cmd.cy2, cmd.x, cmd.y);
                        break;
                    case "QUADRATIC_BEZIER":
                        ctx.quadraticCurveTo(cmd.cx, cmd.cy, cmd.x, cmd.y);
                        break;
                    case "ELLIPSE":
                        ctx.ellipse(cmd.cx, cmd.cy, cmd.rx, cmd.ry, cmd.rotation, cmd.startAngle, cmd.endAngle, cmd.counterclockwise);
                        break;
                    case "CLOSE_PATH":
                        ctx.closePath();
                        break;
                }
            }
            ctx.fill();
        }
        ctx.restore();
    }
}
function parseSvgPath(d) {
    let i = 0;
    let cx, cy, x, y;
    const res = Array();
    space();
    while (i < d.length) {
        let node = parseCommands();
        if (!node.length)
            throw [res, d.slice(i), i];
        res.push(...node);
        space();
    }
    function command() {
        let res = d[i++];
        separator();
        return res;
    }
    function parseCommands() {
        try {
            switch (command()) {
                case "M":
                    return moveTo();
                case "m":
                    return moveToDelta();
                case "L":
                    return lineTo();
                case "l":
                    return lineToDelta();
                case "H":
                    return hLineTo();
                case "h":
                    return hLineToDelta();
                case "V":
                    return vLineTo();
                case "v":
                    return vLineToDelta();
                case "C":
                    return cubicBezier();
                case "c":
                    return cubicBezierDelta();
                case "S":
                    return smoothCubicBezier();
                case "s":
                    return smoothCubicBezierDelta();
                case "Q":
                    return quadraticBezier();
                case "q":
                    return quadraticBezierDelta();
                case "T":
                    return smoothQuadraticBezier();
                case "t":
                    return smoothQuadraticBezierDelta();
                case "A":
                    return ellipse();
                case "a":
                    return ellipseDelta();
                case "Z":
                case "z":
                    return closePath();
            }
        }
        catch (e) {
            console.log(e);
        }
        return [];
    }
    function space() {
        if (i >= d.length)
            return false;
        while (i < d.length && /\s/.test(d[i]))
            ++i;
        return true;
    }
    function separator() {
        space();
        if (i < d.length - 1 && /[\s,]/.test(d[i]) && /[^\s,]/.test(d[i + 1])) {
            ++i;
        }
        space();
        return true;
    }
    function flag() {
        if (d[i] > "1" || d[i] < "0")
            throw {
                error: "failed to parse flag",
                location: d.slice(i),
                res,
            };
        return d[i++] == "1";
    }
    function number() {
        const reg = /[+-]?((0|[1-9]\d*)?\.\d*[1-9]|(0|[1-9]\d*))/y;
        reg.lastIndex = i;
        const match = reg.exec(d);
        if (!match)
            throw {
                error: "failed to parse number",
                location: d.slice(i),
                res,
            };
        i += match[0].length;
        separator();
        return Number(match[0]);
    }
    function moveTo() {
        const res = [];
        do {
            x = number();
            y = number();
            res.push({ type: "MOVE_TO", x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function moveToDelta() {
        const res = [];
        do {
            x += number();
            y += number();
            res.push({ type: "MOVE_TO", x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function lineTo() {
        const res = [];
        do {
            x = number();
            y = number();
            res.push({ type: "LINE_TO", x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function lineToDelta() {
        const res = [];
        do {
            x += number();
            y += number();
            res.push({ type: "LINE_TO", x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function hLineTo() {
        const res = [];
        do {
            x = number();
            res.push({ type: "LINE_TO", x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function hLineToDelta() {
        const res = [];
        do {
            x += number();
            res.push({ type: "LINE_TO", x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function vLineTo() {
        const res = [];
        do {
            y = number();
            res.push({ type: "LINE_TO", x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function vLineToDelta() {
        const res = [];
        do {
            y += number();
            res.push({ type: "LINE_TO", x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function cubicBezier() {
        const res = [];
        do {
            let cx1 = number();
            let cy1 = number();
            let cx2 = (cx = number());
            let cy2 = (cy = number());
            x = number();
            y = number();
            res.push({ type: "CUBIC_BEZIER", cx1, cy1, cx2, cy2, x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function cubicBezierDelta() {
        const res = [];
        do {
            let cx1 = x + number();
            let cy1 = y + number();
            let cx2 = (cx = x + number());
            let cy2 = (cy = y + number());
            x += number();
            y += number();
            res.push({ type: "CUBIC_BEZIER", cx1, cy1, cx2, cy2, x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function smoothCubicBezier() {
        const res = [];
        do {
            let cx1 = 2 * x - cx;
            let cy1 = 2 * y - cy;
            let cx2 = (cx = number());
            let cy2 = (cy = number());
            x = number();
            y = number();
            res.push({ type: "CUBIC_BEZIER", cx1, cy1, cx2, cy2, x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function smoothCubicBezierDelta() {
        const res = [];
        do {
            let cx1 = 2 * x - cx;
            let cy1 = 2 * y - cy;
            let cx2 = (cx = x + number());
            let cy2 = (cy = y + number());
            x += number();
            y += number();
            res.push({ type: "CUBIC_BEZIER", cx1, cy1, cx2, cy2, x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function quadraticBezier() {
        const res = [];
        do {
            cx = number();
            cy = number();
            x = number();
            y = number();
            res.push({ type: "QUADRATIC_BEZIER", cx, cy, x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function quadraticBezierDelta() {
        const res = [];
        do {
            cx = x + number();
            cy = y + number();
            x += number();
            y += number();
            res.push({ type: "QUADRATIC_BEZIER", cx, cy, x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function smoothQuadraticBezier() {
        const res = [];
        do {
            cx = 2 * x - cx;
            cy = 2 * y - cy;
            x = number();
            y = number();
            res.push({ type: "QUADRATIC_BEZIER", cx, cy, x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function smoothQuadraticBezierDelta() {
        const res = [];
        do {
            cx = 2 * x - cx;
            cy = 2 * y - cy;
            x += number();
            y += number();
            res.push({ type: "QUADRATIC_BEZIER", cx, cy, x, y });
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function angle(ux, uy, vx, vy) {
        let sign = ux * vy - uy * vx > 1 ? 1 : -1;
        return (acos((ux * vx + uy * vy) /
            (sqrt(ux ** 2 + uy ** 2) * sqrt(vx ** 2 + vy ** 2))) * sign);
    }
    /**
     * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
     */
    function makeArc(x1, y1, x2, y2, rx, ry, theta, largeArc, sweep) {
        let x1$ = (cos(theta) * (x1 - x2)) / 2 + (sin(theta) * (y1 - y2)) / 2;
        let y1$ = (-sin(theta) * (x1 - x2)) / 2 + (cos(theta) * (y1 - y2)) / 2;
        let factor = sqrt((rx ** 2 * ry ** 2 - rx ** 2 * y1$ ** 2 - ry ** 2 * x1$ ** 2) /
            (rx ** 2 * y1$ ** 2 + ry ** 2 * x1$ ** 2));
        if (largeArc == sweep)
            factor = -factor;
        let cx$ = (factor * rx * y1$) / ry;
        let cy$ = (-factor * ry * x1$) / rx;
        let cx = cos(theta) * cx$ - sin(theta) * cy$ + (x1 + x2) / 2;
        let cy = sin(theta) * cx$ + cos(theta) * cy$ + (y1 + y2) / 2;
        let startAngle = angle(1, 0, x1$ - cx$, y1$ - cy$);
        let delta = angle(x1$ - cx$, y1$ - cy$, -x1$ - cx$, -y1$ - cy$);
        if (sweep && delta < 0)
            delta += 2 * PI;
        else if (!sweep && delta > 0)
            delta -= 2 * PI;
        return {
            type: "ELLIPSE",
            cx,
            cy,
            rx,
            ry,
            rotation: theta,
            startAngle,
            endAngle: startAngle + delta,
            counterclockwise: !sweep,
        };
    }
    function ellipse() {
        const res = [];
        do {
            let x1 = x;
            let y1 = y;
            let rx = number();
            let ry = number();
            let angle = number();
            let largeArc = flag();
            let sweep = flag();
            x = number();
            y = number();
            res.push(makeArc(x1, y1, x, y, rx, ry, (angle * PI) / 180, largeArc, sweep));
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function ellipseDelta() {
        const res = [];
        do {
            let x1 = x;
            let y1 = y;
            let rx = number();
            let ry = number();
            let angle = number();
            let largeArc = flag();
            let sweep = flag();
            x += number();
            y += number();
            res.push(makeArc(x1, y1, x, y, rx, ry, (angle * PI) / 180, largeArc, sweep));
        } while (!/[a-zA-Z]/.test(d[i]));
        return res;
    }
    function closePath() {
        return [{ type: "CLOSE_PATH" }];
    }
    return res;
}
