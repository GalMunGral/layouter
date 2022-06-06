import { Display } from "./Display.js";
import { Fonts } from "./Font.js";
import { View } from "./View.js";
import { MouseUpEvent } from "./Event.js";
export class Text extends View {
    constructor(config) {
        super(config);
        this.lines = [];
        this.content = this.children.join("");
        this.font = Fonts.get(this.props.font);
        this.unitsPerEm = this.font.unitsPerEm;
        this.props.size;
        this.scale = this.props.size / this.unitsPerEm;
    }
    get contentWidth() {
        return this.frame.width - this.props.padding[1] - this.props.padding[3];
    }
    get contentHeight() {
        return this.frame.height - this.props.padding[0] - this.props.padding[2];
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
        const spaceWidth = this.props.size / 4;
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
        const ctx = Display.instance.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.rect(dirty.x, dirty.y, dirty.width, dirty.height);
        ctx.clip();
        ctx.fillStyle = "rgba(" + this.props.backgroundColor.join(",") + ")";
        const { x, y, width, height } = this.frame;
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = "rgba(" + this.props.color.join(",") + ")";
        for (let [i, line] of this.lines.entries()) {
            if (this.props.size * (i + 1) > this.contentHeight)
                break;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(this.frame.x + this.props.padding[3], this.frame.y + this.props.padding[0] + this.props.size * i);
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
