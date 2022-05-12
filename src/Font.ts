// TODO: kerning
export type Glyph = {
  width: number;
  height: number;
  outline: Array<Command>;
};

export type Font = {
  unitsPerEm: number;
  glyphs: Record<string, Glyph>;
};

interface FontConfig {
  type: "svg" | "ttf";
  src: string;
  name: string;
}

export type Command =
  | {
      type: "MOVE_TO";
      x: number;
      y: number;
    }
  | {
      type: "LINE_TO";
      x: number;
      y: number;
    }
  | {
      type: "QUADRATIC_BEZIER";
      cx: number;
      cy: number;
      x: number;
      y: number;
    }
  | {
      type: "CLOSE_PATH";
    };

function parseSvgPath(d: string): Array<Command> {
  let i = 0;
  let cx: number, cy: number, x: number, y: number;
  const res = Array<Command>();

  space();
  while (i < d.length) {
    let node =
      moveTo() ||
      lineTo() ||
      lineToDelta() ||
      hLineToDelta() ||
      vLineToDelta() ||
      quadraticBezier() ||
      quadraticBezierDelta() ||
      smoothQuadraticBezierDelta() ||
      closePath();

    if (!node) throw [res, d, i];
    res.push(node);
    space();
  }

  function space() {
    if (i >= d.length) return false;
    while (i < d.length && /\s/.test(d[i])) ++i;
    return true;
  }

  function separator(): boolean {
    space();
    if (i < d.length - 1 && /[\s,]/.test(d[i]) && /[^\s,]/.test(d[i + 1])) {
      ++i;
    }
    space();
    return true;
  }

  function number(): number {
    const reg = /[+-]?(\d*\.\d+|\d+)/y;
    reg.lastIndex = i;
    const match = reg.exec(d);
    if (match) {
      i += match[0].length;
      return Number(match[0]);
    }
    return NaN;
  }

  function command(c: string): boolean {
    if (d[i] == c) {
      ++i;
      return true;
    }
    return false;
  }

  function moveTo(): Command | null {
    return command("M") &&
      (x = number()) != NaN &&
      separator() &&
      (y = number()) != NaN
      ? { type: "MOVE_TO", x, y }
      : null;
  }

  function lineTo(): Command | null {
    return command("L") &&
      (x = number()) != NaN &&
      separator() &&
      (y = number()) != NaN
      ? { type: "LINE_TO", x, y }
      : null;
  }

  function lineToDelta(): Command | null {
    return command("l") &&
      (x += number()) != NaN &&
      separator() &&
      (y += number()) != NaN
      ? { type: "LINE_TO", x, y }
      : null;
  }

  function hLineToDelta(): Command | null {
    return command("h") && (x += number()) != NaN
      ? { type: "LINE_TO", x, y }
      : null;
  }

  function vLineToDelta(): Command | null {
    return command("v") && (y += number()) != NaN
      ? { type: "LINE_TO", x, y }
      : null;
  }

  function quadraticBezier(): Command | null {
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

  function quadraticBezierDelta(): Command | null {
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

  function smoothQuadraticBezierDelta(): Command | null {
    cx = 2 * x - cx;
    cy = 2 * y - cy;
    return command("t") &&
      (x += number()) != NaN &&
      separator() &&
      (y += number()) != NaN
      ? { type: "QUADRATIC_BEZIER", cx, cy, x, y }
      : null;
  }

  function closePath(): Command | null {
    return command("Z") || command("z") ? { type: "CLOSE_PATH" } : null;
  }

  return res;
}

async function loadSvgFont(config: FontConfig): Promise<void> {
  const res = await fetch(config.src);
  const svg = await res.text();
  const doc = new DOMParser().parseFromString(svg, "text/xml");

  for (let font of Array.from(doc.querySelectorAll("font"))) {
    const defaultWidth = Number(font.getAttribute("horiz-adv-x"));
    Fonts.set(config.name, {
      unitsPerEm: Number(
        font.querySelector("font-face")?.getAttribute("units-per-em")
      ),
      glyphs: Object.fromEntries(
        Array.from(font.querySelectorAll("glyph")).map((node) => [
          node.getAttribute("unicode")!,
          {
            width: Number(node.getAttribute("horiz-adv-x")) || defaultWidth,
            height: Number(node.getAttribute("vert-adv-y")) || 1000,
            outline: parseSvgPath(node.getAttribute("d") ?? ""),
          },
        ])
      ),
    });
  }
}

export const Fonts = new Map<string, Font>();

export async function initFonts(config: Array<FontConfig>): Promise<void> {
  for (let c of config) {
    switch (c.type) {
      case "svg":
        await loadSvgFont(c);
        break;
      default:
        console.info("not implemented");
    }
  }
}
