import { Options } from "tsup";

export const tsup: Options = {
    // this option is the one that works, setting it as a string doesnt throws an error
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    target: ["es2020", "chrome58", "firefox57", "safari11", "edge16", "node12"],
    splitting: true,
    sourcemap: true,
    entryPoints: ["src/index.ts"],
    dts: true,
    // clean: true,
    external: ["*"],
};
