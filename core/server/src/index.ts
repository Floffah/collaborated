import "source-map-support/register"
import "reflect-metadata"
import Server from "./web/Server";
import "dotenv/config"

let server = new Server();
server.init();
