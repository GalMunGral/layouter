var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function parseSvgPath(d) {
    let i = 0;
    let cx, cy, x, y;
    const res = Array();
    space();
    while (i < d.length) {
        let node = moveTo() ||
            lineTo() ||
            lineToDelta() ||
            hLineToDelta() ||
            vLineToDelta() ||
            quadraticBezier() ||
            quadraticBezierDelta() ||
            smoothQuadraticBezierDelta() ||
            closePath();
        if (!node)
            throw [res, d, i];
        res.push(node);
        space();
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
    function number() {
        const reg = /[+-]?(\d*\.\d+|\d+)/y;
        reg.lastIndex = i;
        const match = reg.exec(d);
        if (match) {
            i += match[0].length;
            return Number(match[0]);
        }
        return NaN;
    }
    function command(c) {
        if (d[i] == c) {
            ++i;
            return true;
        }
        return false;
    }
    function moveTo() {
        return command("M") &&
            (x = number()) != NaN &&
            separator() &&
            (y = number()) != NaN
            ? { type: "MOVE_TO", x, y }
            : null;
    }
    function lineTo() {
        return command("L") &&
            (x = number()) != NaN &&
            separator() &&
            (y = number()) != NaN
            ? { type: "LINE_TO", x, y }
            : null;
    }
    function lineToDelta() {
        return command("l") &&
            (x += number()) != NaN &&
            separator() &&
            (y += number()) != NaN
            ? { type: "LINE_TO", x, y }
            : null;
    }
    function hLineToDelta() {
        return command("h") && (x += number()) != NaN
            ? { type: "LINE_TO", x, y }
            : null;
    }
    function vLineToDelta() {
        return command("v") && (y += number()) != NaN
            ? { type: "LINE_TO", x, y }
            : null;
    }
    function quadraticBezier() {
        return command("Q") &&
            (cx = number()) != NaN &&
            separator() &&
            (cy = number()) != NaN &&
            separator() &&
            (x = number()) != NaN &&
            separator() &&
            (y = number()) != NaN
            ? { type: "QUADRATIC_BEZIER", cx, cy, x, y }
            : null;
    }
    function quadraticBezierDelta() {
        return command("q") &&
            (cx = x + number()) != NaN &&
            separator() &&
            (cy = y + number()) != NaN &&
            separator() &&
            (x += number()) != NaN &&
            separator() &&
            (y += number()) != NaN
            ? { type: "QUADRATIC_BEZIER", cx, cy, x, y }
            : null;
    }
    function smoothQuadraticBezierDelta() {
        cx = 2 * x - cx;
        cy = 2 * y - cy;
        return command("t") &&
            (x += number()) != NaN &&
            separator() &&
            (y += number()) != NaN
            ? { type: "QUADRATIC_BEZIER", cx, cy, x, y }
            : null;
    }
    function closePath() {
        return command("Z") || command("z") ? { type: "CLOSE_PATH" } : null;
    }
    return res;
}
function loadSvgFont(config) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(config.src);
        const svg = yield res.text();
        const doc = new DOMParser().parseFromString(svg, "text/xml");
        for (let font of Array.from(doc.querySelectorAll("font"))) {
            const defaultWidth = Number(font.getAttribute("horiz-adv-x"));
            Fonts.set(config.name, {
                unitsPerEm: Number((_a = font.querySelector("font-face")) === null || _a === void 0 ? void 0 : _a.getAttribute("units-per-em")),
                glyphs: Object.fromEntries(Array.from(font.querySelectorAll("glyph")).map((node) => {
                    var _a;
                    return [
                        node.getAttribute("unicode"),
                        {
                            width: Number(node.getAttribute("horiz-adv-x")) || defaultWidth,
                            height: Number(node.getAttribute("vert-adv-y")) || 1000,
                            outline: parseSvgPath((_a = node.getAttribute("d")) !== null && _a !== void 0 ? _a : ""),
                        },
                    ];
                })),
            });
        }
    });
}
export const Fonts = new Map();
export function initFonts(config) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let c of config) {
            switch (c.type) {
                case "svg":
                    yield loadSvgFont(c);
                    break;
                default:
                    console.info("not implemented");
            }
        }
    });
}
