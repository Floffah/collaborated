import styled from "styled-components";
import { BaseButton } from "../../input/Button.styles";
import { darken } from "polished";

export const LoginMenuContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 245px;
    background-color: ${(props) => props.theme.login.bg};
    border-radius: 5px;
    padding: 20px;
`;

export const LoginHeader = styled.div`
    background-color: ${(props) => props.theme.login.header.bg};
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 20px);
    height: 45px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 10px;

    p {
        user-select: none;
        color: ${(props) => props.theme.login.header.color};
        margin: 0;
        font-size: 35px;
        text-align: center;
        font-weight: 400;
        font-family: ${(props) => props.theme.font};
        top: -5px;
        position: relative;
    }
`;

export const LoginBody = styled.div`
    position: absolute;
    height: calc(100% - 55px);
    left: 43px;
    top: 87px;
    margin: auto;

    // \${InputContainer} {
    //   margin-top: 27px;
    // }
`;

export const ButtonContainer = styled.div`
    margin: 20px 0 0 0;

    ${BaseButton} {
        width: 190px;
        height: 35px;
    }

    ${BaseButton}:nth-child(2) {
        margin-left: 22px;
    }
`;

export const Reminder = styled.p`
    color: ${(props) => darken(0.4, props.theme.text.defaultColor)};
    font-size: 13px;
    margin: 7px 0 0 0;
    text-align: center;
    user-select: none;
`;
