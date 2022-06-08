export class Observable<T> {
  static combine(obs: Array<Observable<any>>) {}
  constructor(private run: (f: (v: T) => void) => () => void) {}
  public subscribe(f: (v: T) => void): () => void {
    return this.run(f);
  }
  public $<U>(g: (v: T) => U): Observable<U> {
    return new Observable<U>((f) => {
      return this.run((v) => f(g(v)));
    });
  }
}

export class State<T extends object> {
  private subscribers: {
    [K in keyof T]: Set<(v: T[K]) => void>;
  };
  constructor(private state: T) {
    const subscribers: any = {};
    for (let key of Object.keys(state)) {
      subscribers[key] = new Set();
    }
    this.subscribers = subscribers;
  }
  public get<K extends keyof T>(key: K): Observable<T[K]> {
    return new Observable<T[K]>((f) => {
      this.subscribers[key].add(f);
      f(this.state[key]);
      return () => {
        this.subscribers[key].delete(f);
      };
    });
  }

  public $<K1 extends keyof T, U>(
    deps: [K1],
    f: (v1: T[K1]) => U
  ): Observable<U>;
  public $<K1 extends keyof T, K2 extends keyof T, U>(
    deps: [K1, K2],
    f: (v1: T[K1], v2: T[K2]) => U
  ): Observable<U>;
  public $<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T, U>(
    deps: [K1, K2, K3],
    f: (v1: T[K1], v2: T[K2], v3: T[K3]) => U
  ): Observable<U>;
  public $<
    K1 extends keyof T,
    K2 extends keyof T,
    K3 extends keyof T,
    K4 extends keyof T,
    U
  >(
    deps: [K1, K2, K3, K4],
    f: (v1: T[K1], v2: T[K2], v3: T[K3], v4: T[K4]) => U
  ): Observable<U>;
  public $<
    K1 extends keyof T,
    K2 extends keyof T,
    K3 extends keyof T,
    K4 extends keyof T,
    K5 extends keyof T,
    U
  >(
    deps: [K1, K2, K3, K4, K5],
    f: (v1: T[K1], v2: T[K2], v3: T[K3], v4: T[K4], v5: T[K5]) => U
  ): Observable<U>;

  public $<U>(
    deps: Array<keyof T>,
    f: (...args: Array<T[keyof T]>) => U
  ): Observable<U> {
    const handles: Array<() => void> = [];
    return new Observable<U>((h) => {
      const g = () => h(f(...deps.map((key) => this.state[key])));
      for (let key of deps) {
        handles.push(this.get(key).subscribe(g));
      }
      return () => {
        for (let unsub of handles) unsub();
      };
    });
  }

  public set<K extends keyof T>(
    key: K,
    update: T[K] | ((v: T[K]) => T[K])
  ): void {
    if (typeof update == "function") {
      this.state[key] = (update as (v: T[K]) => T[K])(this.state[key]);
    } else {
      this.state[key] = update;
    }
    this.subscribers[key].forEach((f) => f(this.state[key]));
  }
}
