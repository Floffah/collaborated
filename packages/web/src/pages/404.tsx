import { useTranslation } from "next-i18next";
import Head from "next/head";

import React from "react";

import styled from "styled-components";
import { buildStaticPropsFN } from "../lib/ssg";
import Link from "next/link";

export default function E404() {
    const errs = useTranslation("errors").t;

    return (
        <div>
            <Head>
                <title>404 {errs("not-found")} | Collaborated</title>
            </Head>
            <E404Container>
                <p>404</p>
                <p>{errs("not-found")}</p>
                <div />
                <Link href="/" replace>
                    {errs("go-home")}
                </Link>
            </E404Container>
        </div>
    );
}

const E404Container = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    p:nth-child(1) {
        font-size: 90px;
        margin: 0;
    }

    p:nth-child(2) {
        display: inline-block;
    }

    div:nth-child(3) {
        background-color: white;
        width: 1px;
        height: 20px;
        display: inline-block;
        top: 4px;
        margin: 0 10px 0 10px;
        position: relative;
    }
`;

export const getStaticProps = buildStaticPropsFN({ ns: ["errors"] });
