[![Netlify Status](https://api.netlify.com/api/v1/badges/5b2928d4-ab11-45ed-a18e-3040feeb74ca/deploy-status)](https://app.netlify.com/sites/determined-pike-df8a24/deploys)
![CodeQL](https://github.com/Floffah/collaborated/workflows/CodeQL/badge.svg)
![TODO](https://github.com/Floffah/collaborated/workflows/TODO/badge.svg)
![ESLint](https://github.com/Floffah/collaborated/workflows/ESLint/badge.svg)
[![DeepScan grade](https://deepscan.io/api/teams/12988/projects/16021/branches/332484/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=12988&pid=16021&bid=332484)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

**PLEASE NOTE**

- In this repository, issues should only be created for bug reports. If you have a feature request, question, or
  anything else you want to talk about, use the discussions tab.
- Before you speculate anything about the `server` folder that isn't in packages, please read
  it's [readme](packages/server/README.md)

# Collaborated

```js
// TODO: write readme
```

run `yarn build` for help with the build command

## Developers

- Please make sure when developing, your IDE or code editor has prettier support. If using intellij or webstorm, make
  sure you have the prettier plugin installed. This project has idea configs in the repo so it should automatically
  configure when using this project.

See a list of planned/implemented features [here](features.md)

When testing and on Windows 10 with Windows Terminals installed (the build command detects this) it is recommended to
pass `--exclude web` to the `yarn build dev` command and run `yarn workspace @collaborated/web next dev` separately so
it is easier to see.

If you are on linux or don't have Windows Terminals installed, the build command runs everything in parallel in
development mode.

run `yarn build` for more information

### Branches

- `master` - This is where all pull requests and edits should be sent to. Can be tested
  at https://master.capp.floffah.dev
- `beta` - Every time master is at a point where it needs to be tested in "production" but without breaking anything,
  master will be merged into beta. Can be tested at https://beta.capp.floffah.dev
- `production` - This is the production branch that vercel pushes to https://capp.floffah.dev

### Packages

#### Projects

| **Package** | **Description** | **State** |
|:---:|:---:|:---:|
| [app](packages/app) | Electron application | Paused |
| [common](packages/common) | Common types and structures shared between packages | Inactive, may be re-used |
| [interact](packages/interact) | The JS/TS library for interacting with the Collaborated API. Inspired by Discord.JS | Under heavy development, heavily relied on |
| [manager](packages/manager) | Service manager implemented in NodeJS for managing the node based server implementation | Developing as needed by server (Node) |
| [legacy-manager](packages/legacy-manager) | Service manager implemented in Golang for managing the elixir implementation of the server | Paused alongside server (Elixir) |
| [gql](packages/gql) | Small library for creating GraphQL schemas programmatically (code-first) | Developed as needed by server (Node)
| [server (Elixir)](packages/server) | Elixir implementation of the Collaborated API using phoenix and absinthe | Paused until server (node) fails stress tests |
| [server (Node)](packages/server-js) | NodeJS (TS) implementation of the Collaborated API using prisma, fastify, and mercurius | Under heavy development until it fails stress tests |
| [web](packages/web) | The front end of Collaborated written in React (NextJS, TS) | Under heavy development |
| [test](test) | Small package for testing the interact library and a server implementation | Developed as interact and server are in needing of testing |

## Links

For docs and the component library clone the repo and start storybook in the web package. Documentation will be moved
elsewhere once needed but is not a priority<br/>
[Production deployment](https://capp.floffah.dev) <br/>
[Preview (beta) deployment](https://beta.capp.floffah.dev) <br/>
[Preview (master) deployment](https://master.capp.floffah.dev) <br/>
[Discord](https://discord.gg/tTfksMfb3z)

## Todo

### 0.0.1 milestone

- [ ] [All todo issues](https://github.com/Floffah/collaborated/issues?q=is%3Aopen+is%3Aissue+label%3Atodo+milestone%3A0.0.1)
- [x] Full authentication lifecycle
    - [x] Server-side implementation
        - [x] Header tokens (bot and user)
        - [x] Connection param tokens in subscriptions (bot and user)
        - [x] GraphQL mutations for generating access and refresh tokens
        - [x] Ability to refresh an access token
    - [x] Interact library implementation
        - [x] Support for header tokens (bot and user)
        - [x] Support for connection param tokens in subscriptions (bot and user)
        - [x] Ability to use the token generation mutation when passed an email and password
        - [x] Being able to refresh an access token once expired
- User management
    - [ ] Sessions
        - [x] On the next query after expiry, auto invalidate user tokens
- Structures
    - [ ] Groups
        - [ ] Prisma model
        - [ ] GraphQL fields
            - [ ] Create
            - [ ] Update
            - [ ] Delete
            - [ ] Users (transfer ownership, join, leave)
        - [ ] Interact
            - [ ] Structure
            - [ ] Graphql fields support
        - [ ] Frontend
            - [ ] Show in project drawer
            - [ ] Summaries
                - [ ] Graphs
                - [ ] Latest news
                - [ ] Project list
                - [ ] Channel list
                - [ ] Settings
    - [ ] Projects
        - Many projects to one group
        - [ ] Prisma model
        - [ ] GraphQL fields
            - [ ] Create
            - [ ] Update
            - [ ] Delete
            - [ ] Users (transfer ownership, assign, unassign)
        - [ ] Interact
            - [ ] Structure
            - [ ] Graphql fields support
        - [ ] Frontend
            - [ ] Show in groups
            - [ ] Channel list
            - [ ] Settings
- Pages
    - [ ] Settings

This list is unfinished. As more things are implemented, I'll add more. Don't want to overwhelm myself lol

### Future plans

Feel free to send pull requests for these plans but don't expect them to be merged until after the 0.0.1 milestone

- Custom pubsub server (in Go) to replace Redis as a self-hosted more specialised solution

## Contributors ✨

<a href="https://github.com/floffah/collaborated/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=floffah/collaborated" />
</a>
