import*as e from"../../../../web_modules/react.js";import r,{ThemeProvider as m}from"../../../../web_modules/styled-components.js";import{HomeOutlined as s}from"../../../../web_modules/@ant-design/icons.js";import{getTheme as n}from"../../colours/theme.js";import{RootContainer as i}from"../../ui.js";export default class a extends e.Component{constructor(o){super(o);this.state={theme:n()}}render(){return e.createElement(m,{theme:this.state.theme},e.createElement(i,null,e.createElement(l,null,e.createElement(s,null))))}}const l=r.div`
    position: fixed;
    right: 0;
    top: 0;
    width: 60px;
    height: 100%;
    background-color: ${t=>t.theme.navbar.bg};
`;
