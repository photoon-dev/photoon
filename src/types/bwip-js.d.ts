declare module "bwip-js" {
  export function toCanvas(opts: {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    width?: number;
    includetext?: boolean;
    textxalign?: "left" | "center" | "right";
    textsize?: number;
  }): unknown;
  const _default: { toCanvas: typeof toCanvas };
  export default _default;
}
