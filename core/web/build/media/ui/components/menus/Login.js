import*as t from"../../../../web_modules/react.js";import o from"../../../../web_modules/styled-components.js";import n from"../input/TextInput.js";export default class p extends t.Component{render(){return t.createElement(l,null,t.createElement(i,null,t.createElement("p",null,"Login")),t.createElement(r,null,t.createElement(n,null)))}}const r=o.div`
position: relative;
height: calc(100% - 55px);
width: 100%;
top: 55px;
`,i=o.div`
    background-color: ${e=>e.theme.login.header.bg};
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100% - 20px);
    height: 55px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 10px;
        
    p { 
        color: ${e=>e.theme.login.header.color};
        margin: 0;
        font-size: 40px;
        text-align: center;
        font-weight: 400;
    }
`,l=o.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background-color: ${e=>e.theme.login.bg};
    border-radius: 10px;
    padding: 20px;
`;
