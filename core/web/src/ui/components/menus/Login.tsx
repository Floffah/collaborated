import * as React from "react";
import styled from "styled-components";
import TextInput from "../input/TextInput";

export default class Login extends React.Component {
    render() {
        return <LoginContainer>
            <LoginHeader>
                <p>Login</p>
            </LoginHeader>
            <LoginBody>
                <TextInput/>
            </LoginBody>
        </LoginContainer>
    }
}

const LoginBody = styled.div`
position: relative;
height: calc(100% - 55px);
width: 100%;
top: 55px;
`

const LoginHeader = styled.div`
    background-color: ${props => props.theme.login.header.bg};
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100% - 20px);
    height: 55px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 10px;
        
    p { 
        color: ${props => props.theme.login.header.color};
        margin: 0;
        font-size: 40px;
        text-align: center;
        font-weight: 400;
    }
`

const LoginContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background-color: ${props => props.theme.login.bg};
    border-radius: 5px;
    padding: 20px;
`
