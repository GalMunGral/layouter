import { View } from "./View.js";
export class Container extends View {
    get displayChildren() {
        return this.children.filter((c) => c.props.visible);
    }
    destruct() {
        this.children.forEach((c) => c.destruct());
    }
}
