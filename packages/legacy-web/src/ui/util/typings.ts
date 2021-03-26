import { ReactNode } from "react";

export type ComponentProps<P> = Readonly<P> &
    Readonly<{ children?: ReactNode }>;
