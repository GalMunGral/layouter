import { View } from "./View.js";
export class Container extends View {
    constructor(config) {
        super(config);
        for (let child of this.children) {
            child.parent = this;
        }
    }
    get displayChildren() {
        return this.children.filter((c) => c.props.visible);
    }
    get visibleChildren() {
        return this.children.filter((c) => c.props.visible && c.visible);
    }
    destruct() {
        this.children.forEach((c) => c.destruct());
    }
}
