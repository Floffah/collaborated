import { VNode } from "preact";

export type ComponentProps<P> = Readonly<P> & Readonly<{ children?: VNode }>;
