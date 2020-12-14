import * as React from "react";
import * as ReactDOM from "react-dom"
import styled from "styled-components";

interface NotifProps {

}

interface NotifState {

}

function getNotifContainer() {
    let el = document.getElementById("capp_notifs");
    if(el === null) {
        el = document.createElement("div")
        el.setAttribute("id", "capp_notifs")
        document.appendChild(el)
    }
    return el;
}

export default class Notification extends React.Component<NotifProps,NotifState> {
    static defaultProps: NotifProps = {
        children: <p>notification</p>
    }
    
    constructor(p:NotifProps) {
        super(p);
    }

    render() {
        return ReactDOM.createPortal(<NotifContainer>
            {this.props.children}
        </NotifContainer>, getNotifContainer())
    }
}

const NotifContainer = styled.div`
    position: fixed;
    right: 10px;
    top: 10px;
    padding: 5px;
`