[![Netlify Status](https://api.netlify.com/api/v1/badges/5b2928d4-ab11-45ed-a18e-3040feeb74ca/deploy-status)](https://app.netlify.com/sites/determined-pike-df8a24/deploys)
![CodeQL](https://github.com/Floffah/collaborated/workflows/CodeQL/badge.svg)
![TODO](https://github.com/Floffah/collaborated/workflows/TODO/badge.svg)
![ESLint](https://github.com/Floffah/collaborated/workflows/ESLint/badge.svg)
[![DeepScan grade](https://deepscan.io/api/teams/12988/projects/16021/branches/332484/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=12988&pid=16021&bid=332484)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

**PLEASE NOTE**
 - In this repository, issues should only be created for bug reports. If you have a feature request, question, or anything else you want to talk about, use the discussions tab.
 - Before you speculate anything about the `server` folder that isn't in packages, please read it's [readme](packages/server/README.md)

# Collaborated

```js
// TODO: write readme
```

run `yarn build` for help with the build command

## Developers
 - Please make sure when developing, your IDE or code editor has prettier support. If using intellij or webstorm, make sure you have the prettier plugin installed. This project has idea configs in the repo so it should automatically configure when using this project.

See a list of planned/implemented features [here](features.md)

When testing and on Windows 10 with Windows Terminals installed (the build command detects this) it is recommended to pass `--exclude web` to the `yarn build dev` command and run `yarn workspace @collaborated/web next dev` separately so it is easier to see.

If you are on linux or don't have Windows Terminals installed, the build command runs everything in parallel in development mode.

run `yarn build` for more information 

### Branches

 - `master` - This is where all pull requests and edits should be sent to. Can be tested at https://master.capp.floffah.dev
 - `beta` - Every time master is at a point where it needs to be tested in "production" but without breaking anything, master will be merged into beta. Can be tested at https://beta.capp.floffah.dev
 - `production` - This is the production branch that vercel pushes to https://capp.floffah.dev

### Packages

#### Projects
| **Package** | **Description** | **State** |
|:---:|:---:|:---:|
| [app](packages/app) | Electron application | Paused |
| [common](packages/common) | Common types and structures shared between packages | Inactive, may be re-used |
| [interact](packages/interact) | The JS/TS library for interacting with the Collaborated API. Inspired by Discord.JS | Under heavy development, heavily relied on |
| [manager](packages/manager) | Service manager implemented in Golang for managing the elixir implementation of the server | Paused alongside server (Elixir) |
| [gql](packages/gql) | Small library for creating GraphQL schemas programmatically (code-first) | Developed as needed by server (Node)
| [server (Elixir)](packages/server) | Elixir implementation of the Collaborated API using phoenix and absinthe | Paused until server (node) fails stress tests |
| [server (Node)](packages/server-js) | NodeJS (TS) implementation of the Collaborated API using prisma, fastify, and mercurius | Under heavy development until it fails stress tests |
| [web](packages/web) | The front end of Collaborated written in React (NextJS, TS) | Under heavy development |
| [test](test) | Small package for testing the interact library and a server implementation | Developed as interact and server are in needing of testing |


## Links
For docs and the component library clone the repo and start storybook in the web package. Documentation will be moved elsewhere once needed but is not a priority<br/>
[Production deployment](https://capp.floffah.dev)
[Preview (beta) deployment](https://beta.capp.floffah.dev) <br/>
[Preview (master) deployment](https://master.capp.floffah.dev) <br/>
[Discord](https://discord.gg/tTfksMfb3z)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://discord.gg/bc8Y2y9"><img src="https://avatars0.githubusercontent.com/u/27270386?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Floffah</b></sub></a><br /><a href="https://github.com/Floffah/collaborated/commits?author=Floffah" title="Code">💻</a> <a href="https://github.com/Floffah/collaborated/commits?author=Floffah" title="Documentation">📖</a> <a href="#design-Floffah" title="Design">🎨</a> <a href="#ideas-Floffah" title="Ideas, Planning, & Feedback">🤔</a> <a href="#projectManagement-Floffah" title="Project Management">📆</a> <a href="#question-Floffah" title="Answering Questions">💬</a> <a href="https://github.com/Floffah/collaborated/pulls?q=is%3Apr+reviewed-by%3AFloffah" title="Reviewed Pull Requests">👀</a> <a href="#research-Floffah" title="Research">🔬</a> <a href="#security-Floffah" title="Security">🛡️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
