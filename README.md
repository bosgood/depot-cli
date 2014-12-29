depot-cli
=======

A command-line interface to [depot](https://github.com/bosgood/depot) for deploying and managing apps.

# Installation

```shell
npm install -g depot-cli
```

# Help

```shell
depot --help
```

# Commands

## `list-apps`

**Purpose**: Lists all available apps.

**Usage**: `depot list-apps`

## `info`

**Purpose**: Show app information.

**Usage**: `depot info <appId>`

**Parameters**:

  * *appId* - application id

## `status`

**Purpose**: Show server information.

**Usage**: `depot status`

## `list-versions`

**Purpose**: Lists all versions of an app.

**Usage**: `depot list-versions --app=<appId>`

**Parameters**:

  * *appId* - application id

## `deploy-version`

**Purpose**: Marks a deployed version of an app as the latest version.

**Usage**: `depot release-version --app=<appId> --version=<versionId>`

**Parameters**:

  * *appId* - application id
  * *versionId* - id of version to release
