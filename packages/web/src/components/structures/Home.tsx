import React from "react";

import { ApplyGlobalStyles } from "../helpers/styles";
import { useTranslation } from "next-i18next";

export const Home: React.FC = (_p) => {
    const { t } = useTranslation("common");

    return (
        <ApplyGlobalStyles>
            <p>{t("in-impl")}</p>
        </ApplyGlobalStyles>
    );
};
