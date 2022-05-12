import { Display } from "./Display.js";
import { MouseUpEvent } from "./Event.js";
import { Fonts } from "./Font.js";
import { LayoutView } from "./View.js";
export class Text extends LayoutView {
    constructor(content, config) {
        super(config);
        this.content = content;
        this.lines = [];
        // TODO: padding;
        this.padding = [2, 2, 2, 2];
        this.font = Fonts.get(this.styleConfig.font);
        this.unitsPerEm = this.font.unitsPerEm;
        this.styleConfig.size;
        this.scale = this.styleConfig.size / this.unitsPerEm;
    }
    initStyle(config) {
        var _a, _b, _c;
        return {
            color: (_a = config.color) !== null && _a !== void 0 ? _a : "black",
            backgroundColor: (_b = config.backgroundColor) !== null && _b !== void 0 ? _b : "white",
            font: (_c = config.font) !== null && _c !== void 0 ? _c : "Computer Modern",
            size: config.size || 16,
        };
    }
    handle(e) {
        if (e instanceof MouseUpEvent) {
            // this.layoutConfig.weight++;
            console.log(this.content.split("").map((c) => this.font.glyphs[c]));
            e.handled = true;
        }
    }
    layout() {
        this.lines = [];
        const words = this.content.split(/\s/);
        const lineHeight = this.styleConfig.size; // ??
        const spaceWidth = this.styleConfig.size / 4; // ??
        const glyphWidth = (c) => this.font.glyphs[c].width * this.scale;
        let contentHeight = 0;
        let line = "";
        let lineWidth = 0;
        for (let word of words) {
            const wordWidth = word.split("").reduce((w, c) => w + glyphWidth(c), 0);
            if (lineWidth + wordWidth >
                this.frame.width - this.padding[1] - this.padding[3]) {
                if (contentHeight + lineHeight >
                    this.frame.height - this.padding[0] - this.padding[2])
                    break;
                this.lines.push(line);
                contentHeight += lineHeight;
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
        if (!this.font)
            return;
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
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(this.frame.x + this.padding[3], this.frame.y + this.padding[0] + this.styleConfig.size * i);
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
