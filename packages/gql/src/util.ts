export const infostring = (info: `${string}${";" | "; "}${string}`): { name: string; description: string } => {
    const [name, description] = info.split(/; |;/g);
    return { name, description };
};

export type InfoString = `${string}${";" | "; "}${string}`;
export type DefaultArgs = Record<any, any>;
