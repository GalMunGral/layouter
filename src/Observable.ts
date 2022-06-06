export class Observable<T> {
  constructor(private push: (handler: (v: T) => void) => void) {}
  public subscribe(f: (v: T) => void) {
    this.push(f);
  }
  public $<U>(f: (v: T) => U): Observable<U> {
    return new Observable<U>((handler) => {
      this.push((v) => handler(f(v)));
    });
  }
}
