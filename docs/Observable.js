export class Observable {
    constructor(run) {
        this.run = run;
    }
    static combine(obs) { }
    subscribe(f) {
        return this.run(f);
    }
    $(g) {
        return new Observable((f) => {
            return this.run((v) => f(g(v)));
        });
    }
}
export class State {
    constructor(state) {
        this.state = state;
        const subscribers = {};
        for (let key of Object.keys(state)) {
            subscribers[key] = new Set();
        }
        this.subscribers = subscribers;
    }
    get(key) {
        return new Observable((f) => {
            this.subscribers[key].add(f);
            f(this.state[key]);
            return () => {
                this.subscribers[key].delete(f);
            };
        });
    }
    $(deps, f) {
        const handles = [];
        return new Observable((h) => {
            const g = () => h(f(...deps.map((key) => this.state[key])));
            for (let key of deps) {
                handles.push(this.get(key).subscribe(g));
            }
            return () => {
                for (let unsub of handles)
                    unsub();
            };
        });
    }
    set(key, update) {
        if (typeof update == "function") {
            this.state[key] = update(this.state[key]);
        }
        else {
            this.state[key] = update;
        }
        this.subscribers[key].forEach((f) => f(this.state[key]));
    }
}
