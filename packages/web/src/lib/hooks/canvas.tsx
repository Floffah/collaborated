import { useEffect, useState } from "react";

export function useCanvas(id?: string) {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    let elid = `REACT_HOOK__useCanvas`;

    if (id) elid = `${elid}__${id}`;

    useEffect(() => {
        if (canvas === null || !document.body.contains(canvas)) {
            let el = document.getElementById(elid) as HTMLCanvasElement;
            if (el === null) {
                el = document.createElement("canvas");
                el.setAttribute("id", elid);
                document.body.appendChild(el);
            }
            setCanvas(el);
        }
    });

    return canvas;
}
