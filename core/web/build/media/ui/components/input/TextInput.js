import*as n from"../../../../web_modules/react.js";import o from"../../../../web_modules/styled-components.js";export default class r extends n.Component{constructor(e){super(e);this.state={value:""}}handleChange(e){this.setState({value:e.target.value})}render(){return n.createElement(a,{type:"text",onChange:e=>this.handleChange(e),value:this.state.value})}}const a=o.input`
    width: 200px;
    height: 30px;
    background-color: ${t=>t.theme.login.input.bg};
    border: none;
    padding: 5px;
    padding-right: 10px;
    padding-left: 10px;
    border-radius: 5px;
    font-size: 15px;
    color: ${t=>t.theme.login.input.color};
`;
