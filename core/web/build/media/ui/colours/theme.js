import{darkTheme as e}from"./dark.js";export function getTheme(r){let t=r||localStorage.getItem("capp:theme")||"dark";return t==="dark"?e():e()}
