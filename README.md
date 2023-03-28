# Desktop UI for Node

## Description

This repo contains the desktop application as the UI for the [Koii Node](https://github.com/koii-network/node)

The project structure is based on [Electron React Boilerplate](https://electron-react-boilerplate.js.org)

## Prerequisites

- [NodeJS](https://nodejs.org/en/)
- Configured Koii Network private npm registry

## Installation

- Clone the repository

```
git clone https://github.com/koii-network/desktop-node
```

- NPM config\
  Desktop Node uses private packages published in Gitlab private NPM registry.\
  To be able to properly install dependencies NPM need to be configured in following way:

```
npm config set -- //gitlab.com/api/v4/packages/npm/:_authToken=<GITLAB_ACCESS_TOKEN>
npm config set @koii-network:registry https://gitlab.com/api/v4/packages/npm/
```

where `<GITLAB_ACCESS_TOKEN>` is a [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)

- Install dependencies / packages:

```
npm install
```

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

Then ready to be run/installed version of application can be found in `release/build`
