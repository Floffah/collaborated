import{render as e}from"../../web_modules/react-dom.js";import n from"./components/containers/Body.js";import*as o from"../../web_modules/react.js";import{LoginPage as r}from"./components/containers/LoginPage.js";import m from"../../web_modules/styled-components.js";export default function i(){localStorage.getItem("access")?e(o.createElement(n,null),document.getElementById("root")):e(o.createElement(r,null),document.getElementById("root"))}export const RootContainer=m.div`
position: fixed;
width: 100%;
height: 100%;
left: 0;
right: 0;
background-color: ${t=>t.theme.page.bg};
margin: 0;
`;
