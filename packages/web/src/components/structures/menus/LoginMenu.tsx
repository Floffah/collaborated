import { useTranslation } from "next-i18next";
import React, { createRef } from "react";

import {
    LoginMenuContainer,
    LoginHeader,
    LoginBody,
    ButtonContainer,
    Reminder,
} from "./LoginMenu.styles";
import TextInput from "../../input/TextInput";
import { mdiEmail, mdiLock } from "@mdi/js";
import Button from "../../input/Button";

export const LoginMenu: React.FC = (_p) => {
    const { t } = useTranslation("common");

    const uref = createRef<HTMLInputElement>();
    const pref = createRef<HTMLInputElement>();

    return (
        <LoginMenuContainer>
            <LoginHeader>
                <p>{t("login-title")}</p>
            </LoginHeader>
            <LoginBody>
                <TextInput
                    mode="email"
                    autoComplete="email"
                    placeholder={t("email")}
                    width={400}
                    height={35}
                    fontSize={18}
                    iconClickable={false}
                    icon={mdiEmail}
                    style={{
                        marginTop: 10,
                    }}
                    inputRef={uref}
                />
                <TextInput
                    mode="password"
                    autoComplete="current-password"
                    placeholder={t("pass")}
                    width={400}
                    height={35}
                    fontSize={18}
                    iconClickable={false}
                    icon={mdiLock}
                    style={{
                        marginTop: 20,
                    }}
                    inputRef={pref}
                />
                <ButtonContainer>
                    <Button fontSize={18} disabled type="primary">
                        {t("reg")}
                    </Button>
                    <Button fontSize={18} type="primary">
                        {t("login")}
                    </Button>
                </ButtonContainer>
                <Reminder>
                    Reminder: CTRL+P puts you in preview mode (to test the ui)
                </Reminder>
            </LoginBody>
        </LoginMenuContainer>
    );
};
