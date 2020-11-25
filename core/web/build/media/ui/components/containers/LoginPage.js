import*as e from"../../../../web_modules/react.js";import o,{ThemeProvider as r}from"../../../../web_modules/styled-components.js";import{getTheme as t}from"../../colours/theme.js";import a from"../menus/Login.js";import s from"../../../../web_modules/react-tsparticles.js";let l=t();export class LoginPage extends e.Component{render(){return e.createElement(r,{theme:l},e.createElement(n,{options:i}),e.createElement(a,null))}}const n=o(s)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`,i={background:{color:{value:t().page.bg}},fpsLimit:60,interactivity:{detectsOn:"window",events:{onClick:{enable:!0,mode:"push"},onHover:{enable:!0,mode:"grab",parallax:{enable:!0,force:25,smooth:25}},resize:!0},modes:{push:{quantity:4},grab:{distance:120}}},particles:{color:{value:"#ffffff"},links:{color:"#ffffff",distance:150,enable:!1,opacity:.5,width:1},collisions:{enable:!0,mode:"bounce"},move:{direction:"top",enable:!0,outMode:"out",random:!1,speed:2,straight:!1},number:{density:{enable:!0,value_area:800},value:100},opacity:{value:.5},shape:{type:"circle"},size:{random:!0,value:5}},detectRetina:!0};
