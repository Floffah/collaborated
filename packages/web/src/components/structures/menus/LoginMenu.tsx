import { useTranslation } from "next-i18next";
import React, { createRef, useContext, useEffect, useState } from "react";

import { ButtonContainer, LoginBody, LoginHeader, LoginMenuContainer, Reminder } from "./LoginMenu.styles";
import TextInput from "../../input/TextInput";
import { mdiEmail, mdiLock } from "@mdi/js";
import Button from "../../input/Button";
import { ClientContext } from "../../helpers/context";
import { useRouter } from "next/router";
import { useHotkeys } from "react-hotkeys-hook";
import Tooltip from "../../feedback/Tooltip";

export const LoginMenu: React.FC = (_p) => {
    const { t } = useTranslation("login");
    const tc = useTranslation("common").t;
    const [uerr, setUerr] = useState(false);
    const [perr, setPerr] = useState(false);
    const [isConn, setIsConn] = useState(false);

    const uref = createRef<HTMLInputElement>();
    const pref = createRef<HTMLInputElement>();
    const bref = createRef<HTMLButtonElement>();
    const client = useContext(ClientContext);
    const router = useRouter();

    useEffect(() => {
        const progressListener = (p: number) => {
            console.log(`Login progress: ${p * 100}%`);
        };
        const readyListener = () => {
            router.push("/dash");
        };

        client.client.on("loginprogress", progressListener);
        client.client.on("ready", readyListener);

        return () => {
            client.client.removeListener("loginprogress", progressListener);
            client.client.removeListener("ready", readyListener);
        };
    });

    const login = async () => {
        let either = false;
        if (!uref.current || /^[\s\t]*$/.test(uref.current.value)) {
            either = true;
            setUerr(true);
        } else setUerr(false);
        if (!pref.current || /^[\s\t]*$/.test(pref.current.value)) {
            either = true;
            setPerr(true);
        } else setPerr(false);
        if (either) return;
        if (!uref.current || !pref.current) return; // this is for typescript's sake
        setIsConn(true);
        try {
            await client.client.login({
                email: uref.current.value,
                password: pref.current.value,
            });
        } catch (e) {
            console.log(e);
            if (e.message.includes("Invalid auth")) {
                setUerr(true);
                setPerr(true);
            }
        }
        setIsConn(false);
    };

    useHotkeys(
        "enter",
        (k) => {
            console.log(k);
            if (document.activeElement === uref.current || document.activeElement === pref.current) {
                bref.current?.focus();
            }
        },
        {
            enableOnTags: ["INPUT"],
        },
    );

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
                    <Tooltip title={tc("noimpl")} placement="top" mode="hover">
                        <Button fontSize={18} disabled type="primary">
                            {t("reg")}
                        </Button>
                    </Tooltip>
                    <Button fontSize={18} type="primary" onClick={() => login()} disabled={isConn} ref={bref}>
                        {t("login")}
                    </Button>
                </ButtonContainer>
                <Reminder>{tc("preview-reminder")}</Reminder>
            </LoginBody>
        </LoginMenuContainer>
    );
};
