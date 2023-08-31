
<pre>                                                                                          
                                     ===-     -===                                        
                                     ====     ====                                        
                                     ====                                                 
     :--===--:.       :--===-:.      ====     ----      .:-===--..---.      .:---.--:     
  .-===========:    -====---====.    ====     ====     -=============.    :=====-.====-.  
 .====:      :.    ====.     -===.   ====     ====    ====:     :====.   -===:     .-===: 
 ====.            -====-------===-   ====     ====   :===-       -===.  :===         .=== 
 ====             -====----------:   ====     ====   :===-       -===.  -==-          ===.
 ====:            :===-              ====     ====    ====.      ====.  .=--         .=== 
  ====-:.  ..-=:   -====:.   .:=:    ====:.   ====    .====-:::-=====.   .===-.    .--:-. 
   :===========-    .-===========    :=====   ====      :=======--===.    .-==========-   
     ..::::::.         .::::::.        .:::   .:::         ...   -===.       .:---::.     
                                                        ..     .-===-                     
                                                       :===========:                      
                                                        ::------:.                        
</pre>                                                                                          


# Celigo CLI 

There was a need I saw to augment the deployment automation capabilities of the popular iPaaS platform, integrator.io by Celigo.  This project is an attempt to fill that need in a way that may support larger corporate organizations that require a N-tiered architecture and strict separation of production and non-production services.

Planned scope for this project includes command line access to your integrator.io account to:
- List integrations, flows, and related resources
- Export definitions of flows and their related resources
- Create new integrations, flows, and related resources
- Promote (copy) flows and integrations between accounts
- ***NEW*** Transform (xform) flow into a callable myAPI (experimental).  See below for more detail.
- ***NEW*** Set aliases for frequently used API keys

### To install the `celigo` command
- Open a terminal and `cd` into the celigo-cli directory
- run `npm install` to download dependancies
- run `npm link` to enable the `celigo` command.

### Key Aliases
- Aliases are saved between CLI calls, no need to keep your API key in your copy buffer!
- Set an alias for your API key with the command`celigo set alias myalias 0123456789`
- Key is stored in .env file in the application folder
- Use the alias anywhere you would use an API key (i.e. `celigo list integrations myalias`)
- To unset an alias pass a blank string as the value (i.e. `celigo set alias myalias ''` )


### Notes on the Copy functi

- Copy flow has only been succesfully tested with FTP connections.  There are definiately some challenges with other connection types.  Need to see which connection types will copy easily.
- The copy feature is meant to support a specific promotion methodology, which searches for connections based on name in the destination system to use for the flow being copied.

### Details on Transform function

This is a *HIGHLY* experimental function.  The idea is to enable the configuration of a flow to be executed as a synchronous myAPI call. At present it will return the responses of all of the steps in a flow by default.  You can always modify what data gets returned manually.  At some point I would like a way to generate the API response according to a definition file (i.e. OAS, RAML, etc.), but that will have to wait for now.  At this point I've only tested with a few connectors and there are limitations on what is supported.  Below is a collection of dos and don'ts for using this function:

- Due to some limitations in the current version, when configuring a flow to be transformed to a myAPI keep the following in mind:
  - See which connectors have been tested in the list below.
  - Handlebars statement support in the response mappings and lookup steps are minimal.  Direct references and array indexes work (with the dot notation), but nothing else will. Place any complex mappings in the downstream transform step. Any changes will require a rerun of the xform command, as these are copied into the myAPI definition.
  - Due to limitations in the internal API, lookup steps need to be "hardcoded" in the myAPI, however any imports will use the current configuration.  Make sure to rerun the xform command if any changes are made to a lookup step.
  
- Connector Status
  - Database Connectors
    - Amazon Redshift - Not Tested
    - DynamoDB - Not Tested
    - Google BigQuery - Not Tested
    - Microsoft SQL - Not Tested
    - MongoDB - Not Tested
    - MySQL - Not Tested
    - Oracle DB - Not Tested
    - PostreSQL - Tested
      - Considerations
        - For exports with Handlebars references, use the tripple-handlebar notation and manually use quotations where required.
    - Snowflake - Not Tested
  - Universal Connectors
    - AS2 - Not Tested
    - FTP - Not Tested
    - HTTP - Not Tested
    - REST API - Tested
      - Considerations
  - Application Connectors
    - Salesforce - Tested
      - Considerations


## Tools used

The CLI uses node with the following packages:
- yargs
- columnify
- axios
- some others I probably forgot

## Version History
This is a brief synopsis of the changes in each version.  Please feel free to contact me if you'd like to contribute.

### Version 0.0.2 - June 2022
A few bugs have been squished and the following commands have been added
  - list
    - exports `lists available exports in the workspace`
  - extract
    - imports `retreives definition of a given import`
  - xform
    - flow `transforms a flow definition into a myAPI (see more above)`
  - set
    - alias `createa an alias for API keys`

### Version 0.0.1 - Initial Commit
This version contains the following features
- Full command line features, including --help for a listing of commands (thanks yargs!)
- An initial set of commands including
  - list
    - flows
    - integrations
  - extract
    - connections
    - exports
    - flows
    - integrations
    - scripts
  - create
    - connection
    - export
    - flow
    - import
    - integration
    - script
  - copy
    - flow




