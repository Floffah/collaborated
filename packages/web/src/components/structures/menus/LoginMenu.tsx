import { useTranslation } from "next-i18next";
import React, { createRef, useContext, useState } from "react";

import {
    ButtonContainer,
    LoginBody,
    LoginHeader,
    LoginMenuContainer,
    Reminder,
} from "./LoginMenu.styles";
import TextInput from "../../input/TextInput";
import { mdiEmail, mdiLock } from "@mdi/js";
import Button from "../../input/Button";
import { ClientContext } from "../../helpers/context";
import assert from "assert";
import { useRouter } from "next/router";

export const LoginMenu: React.FC = (_p) => {
    const { t } = useTranslation("common");
    const [uerr, setUerr] = useState(false);
    const [perr, setPerr] = useState(false);

    const uref = createRef<HTMLInputElement>();
    const pref = createRef<HTMLInputElement>();
    const c = useContext(ClientContext);
    const r = useRouter();

    const login = async () => {
        let either = false;
        if (!uref.current || /^[\s\t]+$/.test(uref.current.value)) {
            either = true;
            setUerr(true);
        }
        if (!pref.current || /^[\s\t]+$/.test(pref.current.value)) {
            either = true;
            setPerr(true);
        }
        if (either) return;
        setUerr(false);
        setPerr(false);
        assert(uref.current !== null);
        assert(pref.current !== null);
        c.client.on("loginprogress", (p) => {
            console.log(`Login progress: ${p * 100}%`);
        });
        c.client.on("ready", () => {
            r.push("/dash");
        });
        await c.client.login({
            email: uref.current.value,
            password: pref.current.value,
        });
    };

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
                    error={uerr}
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
                    error={perr}
                />
                <ButtonContainer>
                    <Button fontSize={18} disabled type="primary">
                        {t("reg")}
                    </Button>
                    <Button
                        fontSize={18}
                        type="primary"
                        onClick={() => login()}
                    >
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
