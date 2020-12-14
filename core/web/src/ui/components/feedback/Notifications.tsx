import * as React from "react";
import * as ReactDOM from "react-dom"
import styled from "styled-components";

interface NotifProps {
    type?: "info"|"warn"
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
        type: "info",
    }
    
    constructor(p:NotifProps) {
        super(p);
    }

    render() {
        let EL = InfoNotif
        if(this.props.type === "warn") {
            EL = WarnNotif
        }
        return ReactDOM.createPortal(<EL>
            {this.props.children}
        </EL>, getNotifContainer())
    }
}

const NotifContainer = styled.div`
    position: fixed;
    right: 10px;
    top: 10px;
    padding: 5px;
`

const InfoNotif = styled(NotifContainer)`
    background: ${props => props.theme.notifs.info.bg}
`

const WarnNotif = styled(NotifContainer)`
    background: ${props => props.theme.notifs.warn.bg}
`