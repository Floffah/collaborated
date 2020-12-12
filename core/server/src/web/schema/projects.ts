import API from "../API";
import {GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString} from "graphql";
import {User} from "../../db/Clients";
import {Project} from "../../db/Projects";
import { Invite } from "../../db/Utils";

export function query_me_projects(api: API) {
    return new GraphQLObjectType<{ user: User }, any>({
        name: "me_projects",
        description: "GraphQL Object for interacting with projects relating to your user",
        fields: {
            create: {
                type: query_project_info(api),
                description: "Create a project",
                args: {
                    name: {type: GraphQLString, description: "Name of the project"}
                },
                resolve(s, args) {
                    return new Promise((resolve, reject) => {
                        if (!process.argv.includes("--dev") && (s.user.rates.project_created !== null && s.user.rates.project_created > (new Date(Date.now() - 5 * 60000)))) {
                            reject("Too many requests. Wait < 5 minutes");
                        } else {
                            if (!!args.name) {
                                let proj = new Project()
                                proj.name = args.name
                                proj.owner = s.user;

                                api.server.db.getRepository<Project>(Project).save(proj).then(p => {
                                    s.user.rates.project_created = new Date();
                                    api.server.db.getRepository<User>(User).save(s.user).then(u => {
                                        s.user = u;
                                        resolve({
                                            name: p.name,
                                            id: p.id
                                        })
                                    });
                                }).catch()
                            } else {
                                reject("Argument `name` is not optional.")
                            }
                        }
                    });
                }
            },
            join: {
                type: GraphQLBoolean,
                description: "Join a project by invite",
                args: {
                    invite: {type: GraphQLString, description: "The invite to the project"}
                },
                resolve(s, args) {
                    return new Promise((resolve, reject) => {
                    api.server.db.getRepository<Invite>(Invite).findOne({relations: ["project"], loadEagerRelations: true, where: {invite: args.invite}}).then(i => {
                        if(!i) {
                            reject("Invalid invite")
                        } else {
                            let proj = i.project
                            proj.members.push(s.user);
                            api.server.db.getRepository<Project>(Project).save(proj).then(() => {
                                resolve(true)
                            });
                        }
                    })
                });
                }
            }
        }
    })
}

export function query_project_info(_api: API) {
    return new GraphQLObjectType({
        name: "project_info",
        description: "Information about a project",
        fields: {
            name: {
                type: GraphQLString,
                description: "Project name",
            },
            id: {
                type: GraphQLInt,
                description: "Project ID"
            }
        }
    })
}
