import { View } from "./View.js";
export class Container extends View {
    draw(ctx, clip) {
        super.draw(ctx, clip);
        clip = this.frame.intersection(clip);
        for (let child of this.children) {
            child.draw(ctx, clip);
        }
    }
}
