import { Display } from "./Display.js";
import { MouseUpEvent } from "./Event.js";
import { Fonts } from "./Font.js";
import { LayoutView } from "./View.js";
export class Text extends LayoutView {
    constructor(content, config) {
        super(config);
        this.content = content;
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
            console.log("[TEXT]", this.content.split("").map((c) => this.font.glyphs[c]));
        }
    }
    layout() {
        // TODO: text layout
        // TODO: kerning
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
        ctx.translate(this.frame.x, this.frame.y);
        ctx.scale(this.scale, this.scale);
        ctx.fillStyle = this.styleConfig.color;
        for (let c of this.content) {
            const glyph = this.font.glyphs[c];
            if (glyph) {
                this.drawGlyph(ctx, glyph);
                ctx.translate(glyph.width, 0);
            }
            else {
                // TODO: spaces ?
                ctx.translate(this.unitsPerEm / 4, 0);
            }
        }
        ctx.restore();
    }
}
