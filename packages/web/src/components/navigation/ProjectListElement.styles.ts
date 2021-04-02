import styled from "styled-components";

export const ProjectListElementContainer = styled.div`
    width: 50px;
    position: relative;
    margin: 5px 0;
    background-color: ${(props) => props.theme.projects.element.bg};
    height: 50px;
    border-radius: 25px;
    user-select: none;
    cursor: pointer;
    transition: 0.1s background-color;

    &:hover {
        background-color: ${(props) => props.theme.projects.element.bgHover};
    }
`;
