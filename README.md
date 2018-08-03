# platform-chaos

[![Build Status](https://travis-ci.org/azure/platform-chaos-cli.svg?branch=master)](https://travis-ci.org/azure/platform-chaos-cli)

A tool for introducing chaos into PaaS offerings using configurable extensions. ⚙️ 🌩 

![hero image](.github/hero.png)

Platform chaos is a collection of tools and sdks that enable engineers to experiement on distributed systems built atop PaaS offerings to ensure confidence in such a system's capabilities. It does so by defining a common interface for inducing chaos, through a construct we call chaos extensions. Given this common interface, we're able to provide tooling that can schedule, start, and stop chaotic events.

This project is the cli that enables chaos invocation from the command line. If you're looking for instructions for creating chaos extensions, see [Related Projects](#related-projects) below.

## How to use

To consume this cli, first install it from [NPM](https://npmjs.com/package/platform-chaos-cli):

```
npm install platform-chaos-cli
```

Then execute it using `chaos` from your shell, leveraging the following CLI.

## CLI

```
λ chaos --help
chaos [command] [args]

Commands:
  chaos.js list [search]                        lists registered extensions
  chaos.js register <name> <uri> [desc]         register a chaos extension
  chaos.js resgen <subId> [resGroup] [resName]  create a properly formatted resource identifier
  chaos.js start <extension> [key]              starts some chaos
  chaos.js stop <extension> [key]               stops some chaos
  chaos.js token                                interactively authentiate the user, and print
                                                  an accessToken to stdout
  chaos.js unregister <name>                    unregister a chaos extension

Options:
  --version   Show version number                                                       [boolean]
  -h, --help  Show help                                                                 [boolean]

Learn more @ https://github.com/Azure/platform-chaos-cli
```

### register

Creates and/or updates a `~/.chaos-extensions.json` file. This file represents
all the extensions the tool is aware of and able to run. Use __register__ to add new extensions:

```
chaos register myextension https://myextension.com "a description of my extension"
```

### list

Lists all the registered extensions by printing them to `stdout`. Optionally filters by `search` term.

```
chaos list [search]
```

### unregister

Updates a `~/.chaos-extensions.json` file. This file represents
all the extensions the tool is aware of and able to run. Use __unregister__ to remove extensions:

```
chaos unregister myextension
```

### start

__Start__ is a registered chaos extension, effectively enabling a chaotic event. This command requires
that a `--resources` argument is given, accepting an array of comma-separated resource identifier strings.
Optionally, the `--accessToken` argument may be provided, accepting an Azure access token in the form of `Bearer <token>`.
If `--accessToken` is not provided, the caller will be prompted to login interactively.

```
chaos start myextension --resources "subId/resGroupName/resName","subId/resGroupName/resName2"
```

### stop

__Stop__ is a registered chaos extension, effectively disabling a chaotic event. This command requires
that a `--resources` argument is given, accepting an array of comma-separated resource identifier strings.
Optionally, the `--accessToken` argument may be provided, accepting an Azure access token in the form of `Bearer <token>`.
If `--accessToken` is not provided, the caller will be prompted to login interactively.

```
chaos stop myextension --resources "subId/resGroupName/resName","subId/resGroupName/resName2"
```

### resgen

Generates a resource identifier string given an Azure subscription id, optionally an Azure resource group name,
and (still optionally) an Azure resource name. The resulting tri-part string (in the form of `subId/resGroupName/resName`)
will be output to `stdout`.

```
chaos resGen mySubId myResGroupName myResName
```

### token

Interactively authenticates the user, and prints the valid `accessToken` to `stdout`. This `accessToken` can be used as the `--accessToken <value>` in the [start](#start) and [stop](#stop) commands.

```
chaos token
```

## Related Projects

* [platform-chaos](https://github.com/Azure/platform-chaos) - A node sdk for building services capable of injecting chaos into PaaS offerings.
* [platform-chaos-api](https://github.com/Azure/platform-chaos-api) - An API for introducing chaos into Azure PaaS offerings using configurable extensions.

## Contributing

This project welcomes contributions and suggestions! Here's what you need to know to get started.

### Feedback and Feature Requests

> When you're ready, you can open issues [here](https://github.com/Azure/platform-chaos-cli/issues)!

To submit feedback or request features please do a quick search for similar issues,
then open a new issue. If you're requesting a new feature, please briefly explain in the issue what scenario you're planning to use the feature for.

### Development Requirements

To get started developing, you'll need to first ensure you have these tools installed:

* [Git](https://git-scm.com)
* [NodeJS](https://nodejs.org)

Once you've installed those, clone this repository and install dependencies:

```
git clone https://github.com/Azure/platform-chaos-cli.git
cd platform-chaos-cli
npm install
```

Now you're ready to begin contributing!

### Testing

To run the tests for this project, first ensure you've installed the [requirements](#development-requirements). Then use npm to run the tests locally:

```
npm test
```

Note that this command is meant to be run from the project directory. That is,
the folder that you cloned the project into (likey `platform-chaos-cli`). 

### Legal

Most contributions require you to agree to a Contributor License Agreement (CLA)
declaring that you have the right to, and actually do, grant us the rights to use your contribution.
For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

### Submitting Pull Requests

> When you're ready, you can submit pull requests [here](https://github.com/Azure/platform-chaos-cli/pulls)!

We've defined a pull request template that should be filled out when you're submitting a pull request. You'll see it when you create your PR. Please fill it out to the best of your ability!

Further, your pull request should: 

* Include a description of what your change intends to do
* Be a child commit of a reasonably recent commit in the **master** branch 
    * Requests need not be a single commit, but should be a linear sequence of commits (i.e. no merge commits in your PR)
* It is desirable, but not necessary, for the tests to pass at each commit
* Have clear commit messages 
    * e.g. "Refactor feature", "Fix issue", "Add tests for issue"
* Include adequate tests 
    * At least one test should fail in the absence of your non-test code changes. If your PR does not match this criteria, please specify why
    * Tests should include reasonable permutations of the target fix/change
    * Include baseline changes with your change

Note that once you've [submitted a pull request](https://github.com/Azure/platform-chaos-cli/pulls) you may need to sign a CLA - see [the legal section](#legal) for more information.

### Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.