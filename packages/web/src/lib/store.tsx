import { useMemo } from "react";
import { Action, ActionType } from "./action";
import { applyMiddleware, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

let store: Store<State, Action> | undefined;

export interface State {
    theme: string;
}

export const initialState: State = {
    theme: "dark",
};

const reducer: (state: State, a: Action) => State = (
    state = initialState,
    a,
) => {
    const s = (a: any) => ({ ...state, ...a });

    switch (a.type) {
        case ActionType.ChangeTheme:
            return s({ theme: a.opts[0] });
        default:
            return state;
    }
};

const initStore = (pls = initialState) =>
    createStore(reducer, pls, composeWithDevTools(applyMiddleware()));

export const initializeStore = (pls?: State) => {
    let s = store ?? initStore(pls);

    if (pls && store) {
        s = initStore({ ...store.getState(), ...pls });

        store = undefined;
    }

    if (typeof window === "undefined") return s;

    if (!store) store = s;

    return s;
};

export function useStore(initial: State) {
    return useMemo(() => initializeStore(initial), [initial]);
}
