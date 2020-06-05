# pw-nestjs
## Description

PW nestjs backend application with microservices

## Installation
For each project
```bash
$ npm install
```
Also there needs to create following databases for microservices: `pwauth`, `pwtransactions`, `pwusers`. In general databases settings must correspond to connection settings from `typeorm.config.ts` in each microservice project.

## Running the app
For each project
```bash
# development
$ npm run start
```
api-gateway project is an entry point for all incoming requests that is hosted on 3000 port. To test all endpoints use attached PW.postman_collection.json
