import * as React from "react";

export type ComponentProps<P> = Readonly<P> & Readonly<{children?: React.ReactNode}>
