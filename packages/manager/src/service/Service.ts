import chalk from "chalk";
import { App, Octokit } from "octokit";
import { getDataFolder } from "../util/dirs";
import { ServiceConfig } from "./serviceconfig";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import debug from "debug";
import { parse, stringify } from "@iarna/toml";
import { prompt } from "enquirer";
import { Endpoints } from "@octokit/types";
import { createServer } from "http";
import { createNodeMiddleware } from "@octokit/app";
import { parse as jsonParse, stringify as jsonStringify } from "flatted";
import { Cache } from "./cache";

export default class Service {
    app: App;
    octo: Octokit;

    basedir = getDataFolder("Collaborated", "cappmanager", false);
    configpath = resolve(this.basedir, "config.toml");
    config: ServiceConfig;
    cachepath = resolve(this.basedir, "cache.json");
    cache: Cache;

    debug = debug("manager:service");

    repoinfo: Endpoints["GET /installation/repositories"]["response"]["data"]["repositories"][0];

    exiting = false;

    async start() {
        console.log(chalk`{blue Starting service}`);
        const initial = Date.now();

        this.bindExit();
        if (existsSync(this.cachepath)) this.cache = jsonParse(readFileSync(this.cachepath, "utf-8"));

        if (!this.cache) this.cache = {};

        await this.getConfig();
        this.debug("Grabbed the config");

        await this.startGithub();
        this.debug("Started GitHub connections");

        const startup = Date.now() - initial;
        let ms = `${startup}ms`;

        if (startup > 10000) ms = chalk`{red ${ms}}`;
        else if (startup > 5000) ms = chalk`{yellow ${ms}}`;
        else if (startup > 2000) ms = chalk`{magenta ${ms}}`;
        else ms = chalk`{green ${ms}}`;

        console.log(chalk`{blue Started in} ${ms}`);
    }

    bindExit() {
        process.on("exit", this.exit.bind(this));
        process.on("SIGINT", this.exit.bind(this));
        process.on("SIGUSR1", this.exit.bind(this));
        process.on("SIGUSR2", this.exit.bind(this));
        process.on("uncaughtException", (err) => {
            console.error(err);
            this.exit();
        });
    }

    exit() {
        if (!this.exiting) {
            this.exiting = true;
            writeFileSync(this.cachepath, jsonStringify(this.cache));
            this.debug("Wrote cache");
            process.exit();
        }
    }

    async getConfig() {
        if (!existsSync(this.basedir)) mkdirSync(this.basedir, { recursive: true });

        if (!existsSync(this.configpath)) {
            const answers: any = await prompt([
                {
                    type: "input",
                    message: "What is your app id",
                    name: "appId",
                    required: true,
                },
                {
                    type: "input",
                    message: "What is your client id",
                    name: "clientId",
                    required: true,
                },
                {
                    type: "input",
                    message: "What is your client secret",
                    name: "clientSecret",
                    required: true,
                },
                {
                    type: "input",
                    message: "What is your webhook secret",
                    name: "webhookSecret",
                    required: true,
                },
                {
                    type: "input",
                    message: "What is the path to your private key",
                    name: "privateKey",
                    initial: resolve(this.basedir, "ghprivatekey.pem"),
                    required: true,
                },
                {
                    type: "input",
                    message: "Repo name",
                    name: "repo",
                    initial: "Floffah/collaborated",
                    required: true,
                },
                {
                    type: "input",
                    message: "Installation Id",
                    name: "installationId",
                    initial: "Floffah/collaborated",
                    required: true,
                },
            ]);

            writeFileSync(this.configpath, stringify({ github: answers } as any));

            if (answers.privateKey && !existsSync(answers.privateKey)) {
                console.log(
                    chalk`{red !} {yellow Please copy your applications private key to the link: } {blue ${answers.privateKey}}`,
                );
                process.exit();
                return;
            }
        } else {
            this.config = parse(readFileSync(this.configpath, "utf-8")) as unknown as ServiceConfig;
        }
    }

    async catchUp() {
        this.debug("Needs to catch up");
    }

    async startGithub() {
        this.app = new App({
            appId: this.config.github.appId,
            privateKey: readFileSync(resolve(this.basedir, this.config.github.privateKey), "utf-8"),
            oauth: {
                clientId: this.config.github.clientId,
                clientSecret: this.config.github.clientSecret,
            },
            webhooks: {
                secret: this.config.github.webhookSecret,
            },
        });

        this.octo = await this.app.getInstallationOctokit(parseInt(this.config.github.installationId));

        for await (const repo of this.app.eachRepository.iterator()) {
            if (repo.repository.full_name === this.config.github.repo) {
                this.repoinfo = repo.repository as any;
            }
        }

        if (this.repoinfo) {
            this.debug(`Found repo ${this.repoinfo.full_name} of node id ${this.repoinfo.node_id}`);
            this.startWebhooks();
            const commits: any = await this.octo.graphql(
                `
                    query GetCommits($reponame: String!, $repoowner: String!) {
                        repository(name: $reponame, owner: $repoowner) {
                            refs(refPrefix: "refs/heads/", orderBy: { direction: DESC, field: TAG_COMMIT_DATE }, first: 10) {
                                edges {
                                    node {
                                        ... on Ref {
                                            name
                                            target {
                                                ... on Commit {
                                                    history(first: 1) {
                                                        edges {
                                                            node {
                                                                ... on Commit {
                                                                    id
                                                                    pushedDate
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `,
                {
                    reponame: this.repoinfo.name,
                    repoowner: this.repoinfo.owner.login,
                },
            );
            for (const edge of commits.repository.refs.edges) {
                if (edge.node.name === "master") {
                    for (const cedge of edge.node.target.history.edges) {
                        if (cedge.node.id !== this.cache.lastCommit) {
                            this.cache.lastCommit = cedge.node.id;
                            await this.catchUp();
                        }
                    }
                    break;
                }
            }
        } else {
            console.log(chalk`{red Could not find repo of name ${this.config.github.repo}}`);
            process.exit(1);
        }
    }

    async startWebhooks() {
        createServer(createNodeMiddleware(this.app)).listen(3000);
        this.debug("Started webhook server");
    }
}
