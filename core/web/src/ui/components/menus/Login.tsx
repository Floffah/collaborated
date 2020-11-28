import * as React from "react";
import styled from "styled-components";
import TextInput, {InputContainer} from "../input/TextInput";
import Button from "../interactable/Button";

export interface LoginProps {
    float?: boolean
}

export default class Login extends React.Component<LoginProps, any> {
    static defaultProps: LoginProps = {
        float: false
    };

    render() {
        return <LoginContainer float={this.props.float || false}>
            <LoginHeader float={this.props.float || false}>
                <p>Login</p>
            </LoginHeader>
            <LoginBody>
                <TextInput placeholder="Username" width={400} height={35} fontSize={17} notEmpty errorLabel errorWait/>
                <TextInput placeholder="Password" mode="password" width={400} height={35} fontSize={17} notEmpty errorLabel errorWait/>

                <ButtonGroup>
                    <ButtonPartOne size="medium" type="primary">Register</ButtonPartOne>
                    <ButtonPartTwo size="medium" type="primary">Log In</ButtonPartTwo>
                </ButtonGroup>
            </LoginBody>
        </LoginContainer>
    }
}

const ButtonGroup = styled.div`
`

const ButtonPartOne = styled(Button)`
    width: 203px;
    margin-right: 5px;
    position: relative;
`
const ButtonPartTwo = styled(Button)`
    width: 203px;
    margin-left: 5px;
    position: relative;
`

const LoginBody = styled.div`
    position: relative;
    height: calc(100% - 55px);
    width: 100%;
    top: 55px;
    margin-left: 40px;
    margin-top: 40px;
    
    ${InputContainer} {
        margin-top: 0px;
    }
`

const LoginHeader = styled.div<{float: boolean}>`
    background-color: ${props => props.theme.login.header.bg};
    margin: 0;
    position: ${props => props.float ? "fixed" : "absolute"};
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
        font-family: ${props => props.theme.font};
    }
`

const LoginContainer = styled.div<{float:boolean}>`
    position: ${props => props.float ? "fixed" : "relative"};
    ${props => props.float ? "top: 50%;" : ""}
    ${props => props.float ? "left: 50%;" : ""}
    ${props => props.float ? "transform: translate(-50%, -50%);" : ""}
    width: 500px;
    height: 400px;
    background-color: ${props => props.theme.login.bg};
    border-radius: 5px;
    padding: 20px;
`
