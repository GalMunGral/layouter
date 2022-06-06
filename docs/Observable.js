export class Observable {
    constructor(push) {
        this.push = push;
    }
    subscribe(f) {
        this.push(f);
    }
    $(f) {
        return new Observable((handler) => {
            this.push((v) => handler(f(v)));
        });
    }
}
