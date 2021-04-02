import { useMemo } from "react";
import { Action, ActionType } from "./action";
import { applyMiddleware, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { isBrowser } from "./context";

let store: Store<State, Action> | undefined;

export interface State {
    theme: string;
    mode: {
        preview: boolean;
    };
}

export const initialState: State = {
    theme: "dark",
    mode: {
        preview: isBrowser()
            ? sessionStorage.getItem("preview") === "true" ?? false
            : false,
    },
};

const reducer: (state: State | undefined, a: Action) => State = (
    state = initialState,
    a,
) => {
    const s = (a1: any) => ({ ...state, ...a1 });

    switch (a.type) {
        case ActionType.ChangeTheme:
            return s({ theme: a.opts[0] });
        case ActionType.PreviewToggle:
            return {
                ...state,
                mode: {
                    ...state.mode,
                    preview: a.opts[0] ?? !state.mode.preview,
                },
            };
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
