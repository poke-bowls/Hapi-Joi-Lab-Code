# Hapi-Joi-Lab-Code

Overall goals:

  Have a fully tested hapi api server with 2 sets of endpoints.

  Joi should provide payload validation.

  Lab tests should provide code coverage analysis.

  The codebase will be written for the latest stable version of `node`.

  Create a set of endpoints (Counter) then write tests for it.

  Write tests for the next set of endpoints for (KVStore), then implement the api for (KVStore)

  The goal is to become familiar with how hapi returns joi validation errors (Boom errors) and understand how to test against them.

  Then understand enough of the KVStore api spec to write failing tests against an api that is not yet implemented.

Use Curl or Postman to make http requests to the server.

Read through this entire readme before beginning.

## API Spec

accessing the root route / will return a 403 unauthorized status code the hapi way

### Counter Resource

The server should store a non-persistent object in memory named : `counterStore` that is initially set to the value `{ counter : 0 }`.

_This value will be reset when the server resets_

all Numbers must be integer

| Route                  | Validated Inputs                                 | Expected output                                                                              | Notes                                      |
|------------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------|--------------------------------------------|
| GET /counter           | _none_                                           | `{ "counter" : 0 }`                                                                          | counter value should start at `0`          |
| POST /counter          | **counter** : Number, between 0 and 1000 inclusive | `{ "counter" : n }` _where `n` is the value set_                                             | payload can be encoded as x-www-urlencoded |
| PUT /counter/increment | _none_                                           | `{ "counter" : n }` _where `n` is the new value of counter, which is previous value plus 1_  | counter value cannot exceed value 1000        |
| PUT /counter/decrement | _none_                                           | `{ "counter" : n }` _where `n` is the new value of counter, which is previous value minus 1_ | counter value can not be below 0           |

### KVStore Resource

The server should store a non-persistent object in memory named : `kvStore` that is initially set to an empty object `{}`.

_This value will be reset when the server resets_

_payload can be encoded as x-www-urlencoded_

all Numbers must be integer

| Route                      | Validated Inputs                                                                                                                                                                                             | Expected output                                                                        | Notes                                                     |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|-----------------------------------------------------------|
| GET /kvstore               | _none_                                                                                                                                                                                                       | `{ }`                                                                                  | initial value is an empty object                          |
| GET /kvstore/:key          | _none_                                                                                                                                                                                                       | `{ k : v }` _where `k` is the "key" retrieved, and where `v` is the "value" retrieved_ | if the key does not exist, return a 404 error status code |
| POST /kvstore/string       | **set** : an object {   **key** : String, only(numbers, letters, underscore, or dashes are allowed), the key name,   **value** : String with max length 10, the key value }                                        | `{ k : v }` _where `k` is the "key" set, and where `v` is the "value" set_             | if the key already exists, return a 409 error status code |
| POST /kvstore/number       | **set** : an object {   **key** : String, only(numbers, letters, underscore, or dashes are allowed), the key name,   **value** : Number between 0 and 1000, the key value }                                        | `{ k : v }` _where `k` is the "key" set, and where `v` is the "value" set_             | if the key already exists, return a 409 error status code |
| POST /kvstore/array/string | **set** : an object {   **key** : String, only(numbers, letters, underscore, or dashes are allowed), the key name,   **value** : Array of String values with max string length 10 }                                | `{ k : v }` _where `k` is the "key" set, and where `v` is the "value" set_             | if the key already exists, return a 409 error status code |
| POST /kvstore/array/number | **set** : an object {   **key** : String, only(numbers, letters, underscore, or dashes are allowed),   **value** : Array of Numbers between 0 and 1000 }                                                           | `{ k : v }` _where `k` is the "key" set, and where `v` is the "value" set_             | if the key already exists, return a 409 error status code |
| POST /kvstore/array        | **set** : an object {   **key** : String, only(numbers, letters, underscore, or dashes are allowed), the key name,   **value** : Array of String values with max string length 10, or Numbers between 0 and 1000 } | `{ k : v }` _where `k` is the "key" set, and where `v` is the "value" set_             | if the key already exists, return a 409 error status code |

## Tasks

- [ ] install the npm module `n` globally
- [ ] select the latest stable `node` version, `n stable`
- [ ] create a github repository named `Hapi Joi Lab Code`, and clone it _all work will be done in this cloned repo_
- [ ] initialize a bare `package.json` file in the project
- [ ] install `hapi` and `joi` npm modules saving it to npm dependencies
- [ ] install `lab` and `code` npm modules saving it to npm devDependencies
- [ ] in a `./src` subdirectory, setup a basic hapi server at `./src/index.js`, make sure it can run with `node src/`
- [ ] in the hapi server, define the routes defined under *Counter resource*
- [ ] in a `./lab` subdirectory, setup a test entry point at `./lab/index.js`
- [ ] define the npm test task in `./package.json`
    - `test: node ./node_modules/lab/bin/lab -e lab -m 5000 -r html -o ./lab/result/index.html ./lab`
    - running the task with `npm test` should work
- [ ] in the lab test, create an experiment to test the *Counter resource*
- [ ] in the lab test, create an experiment to test the *KVStore resource* _to the best of your ability, based on the api spec_
    - these tests should still pass, by setting the experiment to `{skip : true}`
- [ ] stop here, get your tests approved by @theRemix before continuing
- [ ] implement the *KVStore resource* _incremental refactoring of the lab tests are permitted_
    - after each individual route is implemented, unskip the matching lab test