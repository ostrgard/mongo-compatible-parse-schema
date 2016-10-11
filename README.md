# mongo-compatible-parse-schema
Create a mongoimport-ready parse schema, that's compatible with parse-server. Taking a Parse application id and a master key, it downloads and formats the schema.

Why?
---
Currently, you can only use the official Parse migration tool to migrate a parse server from Parse.com. The exportable .json files is incompatible with [parse-server](https://github.com/ParsePlatform/parse-server). [moflo](https://github.com/moflo)'s [parse-mongodb-export](https://github.com/moflo/parse-mongodb-export),  helps you format the export in a compatible way, but the api needs a schema to maintain and include relationsdata. The schema can be exportet from the Parse API, but is sadly incompatible with parse-server.

This tool downloads and formats the schema for you.

Installation
---
```npm install mongo-compatible-parse-schema```

Usage
---
Download the schema using your Parse.com application id and masterkey and output it as _SCHEMA.json:

```mongo-compatible-parse-schema -a <ApplicationId> -m <MasterKey>```

Using an exportet schema from the parse api:

```mongo-compatible-parse-schema -f <file>```

Then import it as the `_SCHEMA` collection [in mongo along with the exportet database](https://github.com/moflo/parse-mongodb-export#usage).

API
---
```
Usage: index [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -a, --application-id [name]  Your parse.com application id. Required if not providing a file.
    -m, --master-key [name]      Your parse.com master key. Required if not providing a file.
    -f, --file [name]            JSON file exportet from https://api.parse.com/1/schemas. Required if not providing an application id and master key.
    -o, --out [name]             Output file name for converted JSON [_SCHEMA.json]
    -v, --verbose                Use verbose mode
```