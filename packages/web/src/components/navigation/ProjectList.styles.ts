import styled from "styled-components";

export const ProjectListContainer = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    width: 70px;
    height: 100%;
    background-color: ${(props) => props.theme.projects.list.bg};
    padding: 5px 10px 0 10px;
    box-sizing: border-box;
`;
