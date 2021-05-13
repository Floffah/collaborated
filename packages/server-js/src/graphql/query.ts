import { buildArgument, buildField, buildObject } from "@collaborated/gql";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { PrismaClient } from "@prisma/client";

export const AuthDetails = buildObject("AuthDetails; Post-authentication details", () => [
    buildField("access; The main access code or the current session", GraphQLString),
    buildField(
        "refresh; The refresh code that should be used to generate a new access code after the current session has ended",
        GraphQLString,
    ),
]);

export const query = buildObject<any, { db: PrismaClient }>("RootQueryType; Root query", () => [
    buildField("ping; For round-trip calculation purposes", GraphQLString, () => "pong"),
    buildField(
        "authenticate; Authenticate with an email and password",
        AuthDetails,
        (_s, _c) => ({
            access: "aaa",
            refresh: "aasdas",
        }),
        [
            buildArgument("email; Email to authenticate with", GraphQLNonNull(GraphQLString)),
            buildArgument("password; Password to authenticate with", GraphQLNonNull(GraphQLString)),
        ],
    ),
]);
