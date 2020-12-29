import "source-map-support/register";
import "reflect-metadata";
// eslint-disable-next-line workspaces/require-dependency
import Server from "./web/Server";
import "dotenv/config";

const server = new Server();
server.init();
