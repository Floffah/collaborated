export interface Theme {
    name?: string;
    font?: string;
    pagebg?: string;

    text?: {
        defaultColor?: string;
        defaultHeaderColor?: string;
    };

    links?: {
        color?: string;
        active?: string;
    };
}
