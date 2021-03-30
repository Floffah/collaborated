export enum ActionType {
    ChangeTheme,
}

export type Action = ThemeAction | BaseAction;

export interface BaseAction {
    type: ActionType;
    opts: any[];
}

export interface ThemeAction extends BaseAction {
    type: ActionType.ChangeTheme;
    opts: [string];
}
