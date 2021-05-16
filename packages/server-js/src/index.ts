import Server from "./server/Server.js";
import { config } from "dotenv";
import debug from "debug";

config();
debug.enable("*");

const server = new Server();
server.go();
