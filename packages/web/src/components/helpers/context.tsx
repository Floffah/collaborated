import { createContext } from "react";
import WebClient from "../../lib/api/WebClient";

export const ClientContext = createContext({
    client: (null as unknown) as WebClient,
});
