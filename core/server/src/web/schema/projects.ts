import API from "../API";
import {GraphQLInt, GraphQLObjectType, GraphQLString} from "graphql";
import {User} from "../../db/Clients";
import {Project} from "../../db/Projects";

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