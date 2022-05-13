import { Display } from "./Display.js";
import { MouseUpEvent } from "./Event.js";
import { Fonts } from "./Font.js";
import { LayoutView } from "./View.js";
export class Text extends LayoutView {
    constructor(content, config) {
        super(config);
        this.content = content;
        this.lines = [];
        this.font = Fonts.get(this.styleConfig.font);
        this.unitsPerEm = this.font.unitsPerEm;
        this.styleConfig.size;
        this.scale = this.styleConfig.size / this.unitsPerEm;
    }
    get contentWidth() {
        return (this.frame.width -
            this.styleConfig.padding[1] -
            this.styleConfig.padding[3]);
    }
    get contentHeight() {
        return (this.frame.height -
            this.styleConfig.padding[0] -
            this.styleConfig.padding[2]);
    }
    initStyle(config) {
        var _a, _b, _c, _d;
        return {
            color: (_a = config.color) !== null && _a !== void 0 ? _a : "black",
            padding: (_b = config.padding) !== null && _b !== void 0 ? _b : [4, 4, 4, 4],
            backgroundColor: (_c = config.backgroundColor) !== null && _c !== void 0 ? _c : "white",
            font: (_d = config.font) !== null && _d !== void 0 ? _d : "Computer Modern",
            size: config.size || 16,
        };
    }
    handle(e) {
        if (e instanceof MouseUpEvent) {
            console.log(this.content.split("").map((c) => this.font.glyphs[c]));
            e.handled = true;
        }
    }
    layout() {
        this.lines = [];
        const words = this.content.split(/\s+/);
        if (!words.length)
            return;
        const spaceWidth = this.styleConfig.size / 4;
        const getGlyphWidth = (c) => this.font.glyphs[c].width * this.scale;
        const getWordWidth = (word) => word.split("").reduce((w, c) => w + getGlyphWidth(c), 0);
        let line = words.shift();
        let lineWidth = getWordWidth(line);
        for (let word of words) {
            const wordWidth = getWordWidth(word);
            if (lineWidth + spaceWidth + wordWidth > this.contentWidth) {
                this.lines.push(line);
                line = word;
                lineWidth = wordWidth;
            }
            else {
                line += " " + word;
                lineWidth += spaceWidth + wordWidth;
            }
        }
        this.lines.push(line);
    }
    drawGlyph(ctx, glyph) {
        if (!this.font)
            return;
        ctx.beginPath();
        for (let cmd of glyph.outline) {
            switch (cmd.type) {
                case "MOVE_TO":
                    ctx.moveTo(cmd.x, glyph.height - cmd.y);
                    break;
                case "LINE_TO":
                    ctx.lineTo(cmd.x, glyph.height - cmd.y);
                    break;
                case "QUADRATIC_BEZIER":
                    ctx.quadraticCurveTo(cmd.cx, glyph.height - cmd.cy, cmd.x, glyph.height - cmd.y);
                    break;
                case "CLOSE_PATH":
                    ctx.closePath();
                    break;
            }
        }
        ctx.fill();
    }
    draw(dirty) {
        var _a;
        const ctx = Display.instance.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
        ctx.clip();
        ctx.fillStyle = (_a = this.styleConfig.backgroundColor) !== null && _a !== void 0 ? _a : "black";
        const { x, y, width, height } = this.frame;
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = this.styleConfig.color;
        for (let [i, line] of this.lines.entries()) {
            if (this.styleConfig.size * (i + 1) > this.contentHeight)
                break;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(this.frame.x + this.styleConfig.padding[3], this.frame.y + this.styleConfig.padding[0] + this.styleConfig.size * i);
            ctx.scale(this.scale, this.scale);
            for (let c of line) {
                const glyph = this.font.glyphs[c];
                if (glyph) {
                    // TODO: kerning
                    this.drawGlyph(ctx, glyph);
                    ctx.translate(glyph.width, 0);
                }
                else {
                    // TODO: spaces ?
                    ctx.translate(this.unitsPerEm / 4, 0);
                }
            }
        }
        ctx.restore();
    }
}
