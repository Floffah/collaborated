import * as React from "react";
import styled from "styled-components";
import TextInput, { InputContainer } from "../input/TextInput";
import Button from "../interactable/Button";
import { AppContext } from "../../../util/AppContext";
import { AppContainer } from "../../../app/AppContainer";
import { Popup } from "../containers/Popups";
import { Tooltip } from "../feedback/Tooltip";
import { PopOverPos } from "../containers/PopupUtil";
import { LoadingIcon } from "../common/Icons";

export interface LoginProps {
    float?: boolean;
}

export interface LoginState {
    email: string;
    pswd: string;
    hasloading: boolean;
}

export default class Login extends React.Component<LoginProps, LoginState> {
    static defaultProps: LoginProps = {
        float: false,
    };
    static contextType = AppContext;
    appc: AppContainer;

    constructor(p: any) {
        super(p);

        this.state = {
            email: "",
            pswd: "",
            hasloading: false,
        };
    }

    componentDidMount() {
        this.appc = this.context as AppContainer;
    }

    openPage(name: "privacy" | "terms") {
        if (name === "privacy") {
            this.appc.openPopup(
                <Popup>
                    <p>We private</p>
                </Popup>,
            );
        }
    }

    submit() {
        if (
            this.state.pswd !== "" &&
            !/[ \t]+/.test(this.state.pswd) &&
            !/[ \t]+/.test(this.state.email) &&
            this.state.email !== ""
        ) {
            this.setState({
                hasloading: true,
            });
            this.appc.startClient(this.state.email, this.state.pswd);
        }
    }

    echange(val: string) {
        this.setState({
            email: val,
        });
    }

    pchange(val: string) {
        this.setState({
            pswd: val,
        });
    }

    render() {
        return (
            <LoginContainer float={this.props.float || false}>
                <LoginHeader float={this.props.float || false}>
                    <p>Login</p>
                </LoginHeader>
                <LoginBody>
                    <TextInput
                        onSubmit={() => this.submit()}
                        placeholder="Email"
                        mode="email"
                        onChange={(val) => this.echange(val)}
                        width={400}
                        height={35}
                        fontSize={17}
                        notEmpty
                        errorLabel
                        errorWait
                    />
                    <TextInput
                        onSubmit={() => this.submit()}
                        placeholder="Password"
                        mode="password"
                        onChange={(val) => this.pchange(val)}
                        width={400}
                        height={35}
                        fontSize={17}
                        notEmpty
                        errorLabel
                        errorWait
                    />

                    <ButtonGroup>
                        <Tooltip
                            message="Currently disabled"
                            position={PopOverPos.Top}
                        >
                            <ButtonPartOne size="medium" type="primary">
                                Register
                            </ButtonPartOne>
                        </Tooltip>
                        <ButtonPartTwo
                            size="medium"
                            type="primary"
                            onClick={() => this.submit()}
                        >
                            {this.state.hasloading ? (
                                <LoginLoading />
                            ) : (
                                "Log In"
                            )}
                        </ButtonPartTwo>
                    </ButtonGroup>

                    <Sep />

                    <div>
                        <SepLink onClick={() => this.openPage("privacy")}>
                            Privacy Policy
                        </SepLink>
                        <SepLink onClick={() => this.openPage("terms")}>
                            Terms of Service
                        </SepLink>
                    </div>
                </LoginBody>
            </LoginContainer>
        );
    }
}

const LoginLoading = styled(LoadingIcon)`
    height: 15px;
    width: 15px;
    display: inline-block;
    position: relative;
    margin: 0;
`;

const SepLink = styled.a`
    display: block;
    text-align: center;
    width: 400px;
    color: ${(props) => props.theme.login.linkcolor};
    cursor: pointer;
    user-select: none;
    margin: 5px;
    font-family: ${(props) => props.theme.font};
`;

const Sep = styled.hr`
    width: 360px;
    height: 1px;
    position: relative;
    border-width: 0;
    color: ${(props) => props.theme.login.sepcolor};
    background-color: ${(props) => props.theme.login.sepcolor};
    margin: 27px 0 27px 20px;
`;

const ButtonGroup = styled.div`
    position: relative;
    margin-top: 27px;
`;

const ButtonPartOne = styled(Button)`
    width: 195px;
    margin-right: 5px;
    position: relative;
    height: 34px;
`;
const ButtonPartTwo = styled(Button)`
    width: 195px;
    margin-left: 5px;
    position: relative;
    height: 34px;
`;

const LoginBody = styled.div`
    position: absolute;
    height: calc(100% - 55px);
    left: 67px;
    top: 92px;

    ${InputContainer} {
        margin-top: 27px;
    }
`;

const LoginHeader = styled.div<{ float: boolean }>`
    background-color: ${(props) => props.theme.login.header.bg};
    margin: 0;
    position: ${(props) => (props.float ? "fixed" : "absolute")};
    top: 0;
    left: 0;
    width: calc(100% - 20px);
    height: 55px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 10px;

    p {
        color: ${(props) => props.theme.login.header.color};
        margin: 0;
        font-size: 40px;
        text-align: center;
        font-weight: 400;
        font-family: ${(props) => props.theme.font};
    }
`;

const LoginContainer = styled.div<{ float: boolean }>`
    position: ${(props) => (props.float ? "fixed" : "relative")};
    ${(props) => (props.float ? "top: 50%;" : "")}
    ${(props) => (props.float ? "left: 50%;" : "")}
  ${(props) => (props.float ? "transform: translate(-50%, -50%);" : "")}
  width: 500px;
    height: 400px;
    background-color: ${(props) => props.theme.login.bg};
    border-radius: 5px;
    padding: 20px;
`;
