# Celigo CLI 

There was a need I saw to augment the deployment automation capabilities of the popular iPaaS platform, integrator.io by Celigo.  This project is an attempt to fill that need in a way that may support larger corporate organizations that require a N-tiered architecture and strict separation of production and non-production services.

Planned scope for this project includes command line access to your integrator.io account to:
- List integrations, flows, and related resources
- Export definitions of flows and their related resources
- Create new integrations, flows, and related resources
- Copy (promote) flows and integrations between accounts

## Tools used

The CLI uses node with the following packages:
- yargs
- columnify
- axios
- some others I probably forgot

## Version History
This is a brief synopsis of the changes in each version.  Please feel free to contact me if you'd like to contribute.

### Version 0.0.1 - Initial Commit
This version contains the following features
- Full command line features, including --help for a listing of commands (thanks yargs!)
- An initial set of commands including:
-- list
---flows
---integrations
--extract
---connections
---exports
---flows
---imports
---integrations
---scripts
--create
---connection
---export
---flow
---import
---integration
---script
--copy
---flow

###Comments
-copy flow has only been succesfully tested with FTP connections.  There are definiately some challenges with other connection types.  Need to see which connection types will copy easily.
-The copy feature is meant to support a specific promotion methodology, which searches for connections based on name in the destination system to use for the flow being copied.

