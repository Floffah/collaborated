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
 - Before you speculate anything about the `server` folder that isn't in packages, please read it's [readme](server/README.md)

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

## Links
[All docs](https://capp.floffah.dev/?path=/story/developers-contents--page) <br/>
[Setting up a development environment](https://capp.floffah.dev/?path=/story/developers-contributors-development-environment--page) <br/>
[Storybook](https://capp.floffah.dev) <br/>
[UI Preview](https://preview.capp.floffah.dev) (this isn't usually connected to any api) <br/>
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
