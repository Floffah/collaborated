import WebClient from "../api/WebClient";
import { useContext } from "react";
import { ClientContext } from "../../components/helpers/context";

export function useClient(): WebClient {
    const c = useContext(ClientContext);
    return c.client;
}
