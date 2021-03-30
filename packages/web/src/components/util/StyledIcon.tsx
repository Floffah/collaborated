import { Icon } from "@mdi/react";
import React, { forwardRef, useContext } from "react";

import styled, { ThemeContext } from "styled-components";

/**
 * https://www.npmjs.com/package/@mdi/react#props
 */
export interface StyledIconProps {
    title?: string;
    desc?: string;
    path: string;
    size?: string | number;
    horizontal?: boolean;
    vertical?: boolean;
    rotate?: number;
    color?: string;
    spin?: boolean | number;

    style?: React.CSSProperties;
}

const StyledIcon = forwardRef<HTMLElement, StyledIconProps>((p, ref) => {
    const theme = useContext(ThemeContext);

    return (
        <SIconStyles
            title={p.title ?? null}
            description={p.desc ?? null}
            path={p.path}
            size={p.size ?? null}
            horizontal={p.horizontal ?? false}
            vertical={p.vertical ?? false}
            rotate={p.rotate ?? 0}
            color={p.color ?? theme.text.defaultColor}
            scolor={p.color ?? theme.text.defaultColor}
            spin={p.spin ?? false}
            ref={ref as any}
            style={p.style ?? {}}
        />
    );
});
StyledIcon.displayName = "StyledIcon";

export default StyledIcon;

export const SIconStyles = styled(Icon)<{ scolor: string }>`
    color: ${(props) => props.scolor};
    margin: 0;
`;
