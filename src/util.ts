export function createElement<T>(
  type: new (p: T) => any,
  props: T,
  ...children: any[]
) {
  return new type({ ...props, children });
}

export function shallowEqual(a: any, b: any) {
  const aIsObject = typeof a == "object" && a;
  const bIsObject = typeof b == "object" && b;

  if (aIsObject && bIsObject) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      if (a[key] !== b[key]) return false;
    }
    return true;
  }

  if (aIsObject || bIsObject) return false;

  return a === b;
}
