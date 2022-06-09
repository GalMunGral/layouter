import { Path } from "../Path.js";
import { createElement } from "../util.js";
export function Icon({ paths }) {
    return (createElement(Path, { weight: 1, dimension: [16, 16], color: [255, 255, 255, 1], paths: paths }));
}
