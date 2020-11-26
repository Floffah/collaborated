import API from "../API";
import {GraphQLObjectType, GraphQLSchema} from "graphql"

export default function query(api: API) {
    return new GraphQLSchema({
        query: new GraphQLObjectType({
            name: "query",
            fields: {
                
            }
        })
    })
}