import API from "../API";
import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} from "graphql";
import { User } from "../../db/Clients";
import { Project } from "../../db/Projects";
import { Invite } from "../../db/Utils";

export function query_me_projects(api: API) {
    return new GraphQLObjectType<{ user: User }, any>({
        name: "me_projects",
        description:
            "GraphQL Object for interacting with projects relating to your user",
        fields: {
            create: {
                type: query_project_info,
                description: "Create a project",
                args: {
                    name: {
                        type: GraphQLString,
                        description: "Name of the project",
                    },
                },
                async resolve(s, args) {
                    if (
                        !process.argv.includes("--dev") &&
                        s.user.rates.project_created !== null &&
                        s.user.rates.project_created >
                            new Date(Date.now() - 5 * 60000)
                    ) {
                        throw "Too many requests. Wait < 5 minutes";
                    } else {
                        if (args.name) {
                            const proj = new Project();
                            proj.name = args.name;
                            proj.owner = s.user;

                            const p = await api.server.db
                                .getRepository<Project>(Project)
                                .save(proj);

                            s.user.rates.project_created = new Date();
                            s.user = await api.server.db
                                .getRepository<User>(User)
                                .save(s.user);
                            return {
                                name: p.name,
                                id: p.id,
                            };
                        } else {
                            throw "Argument `name` is not optional.";
                        }
                    }
                },
            },
            join: {
                type: GraphQLBoolean,
                description: "Join a project by invite",
                args: {
                    invite: {
                        type: GraphQLString,
                        description: "The invite to the project",
                    },
                },
                async resolve(s, args) {
                    const i = await api.server.db
                        .getRepository<Invite>(Invite)
                        .findOne({
                            relations: ["project"],
                            where: { invite: args.invite },
                        });

                    if (!i) {
                        throw "Invalid invite";
                    } else {
                        const proj = i.project;
                        proj.members.push(s.user);

                        await api.server.db
                            .getRepository<Project>(Project)
                            .save(proj);
                        return true;
                    }
                },
            },
            all: {
                type: GraphQLList(query_project_info),
                description:
                    "Get information (that you have permission to access) about all projects you have access to",
                async resolve(s) {
                    const user = (await api.server.db
                        .getRepository<User>(User)
                        .findOne({
                            relations: ["projects"],
                            where: { id: s.user.id },
                        })) as User;
                    const list: { name: string; id: number }[] = [];

                    for (const p of user.projects) {
                        list.push({ name: p.name, id: p.id });
                    }

                    return list;
                },
            },
        },
    });
}

export const query_project_info = new GraphQLObjectType({
    name: "project_info",
    description: "Information about a project",
    fields: {
        name: {
            type: GraphQLString,
            description: "Project name",
        },
        id: {
            type: GraphQLInt,
            description: "Project ID",
        },
    },
});
