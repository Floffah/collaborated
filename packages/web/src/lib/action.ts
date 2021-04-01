export enum ActionType {
    ChangeTheme,
    PreviewToggle,
}

export type Action = ThemeAction | PreviewAction | BaseAction;

export interface BaseAction {
    type: ActionType;
    opts: any[];
}

export interface ThemeAction extends BaseAction {
    type: ActionType.ChangeTheme;
    opts: [string];
}

export interface PreviewAction extends BaseAction {
    type: ActionType.PreviewToggle;
    opts: [boolean];
}
