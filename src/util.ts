export function createElement<T>(
  type: new (p: T) => any,
  props: T,
  ...children: any[]
) {
  return new type({ ...props, children });
}
