# Koii UI for Node

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
  Koii Node uses private packages published in Gitlab private NPM registry.\
  To be able to properly install dependencies NPM need to be configured in following way:

```
npm config set -- //gitlab.com/api/v4/packages/npm/:_authToken=<GITLAB_ACCESS_TOKEN>
npm config set @koii-network:registry https://gitlab.com/api/v4/packages/npm/
```

where `<GITLAB_ACCESS_TOKEN>` is a [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)

# linux batch 
- You may need to install these packages:
```
sudo apt-get update
sudo apt-get install build-essential
```

# Open terminal outside VS code 
- There is a dependency that requires sudo access of which vs code doesn't provide by default
- Install dependencies / packages:

```
npm install
```

- Run command: This command works on Linux Mint 
```
echo fs.inotify.max_user_watches= 524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

- Restart your computer to ensure there isn't a grandfathered in broken backend process

## Starting Development

Start the app in the `dev` environment:

```bash
npm run dev
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

Then ready to be run/installed version of application can be found in `release/build`
