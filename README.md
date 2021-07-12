# Storefront Backend Project

Udacity FullStack Nanodegree

## Create the .env file

You can use this one as a guide

```
EXPRESS_PORT=3000
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_DB_TEST=storefront_test
POSTGRES_USER=postgres_storefront
POSTGRES_PASSWORD=password123
BCRYPT_PASSWORD=password123
SALT_ROUNDS=10
ENV=dev
TOKEN_SECRET=mysecrettoken123
```

## Database setup
 - Install the migration package globally: `npm install -g db-migrate`
 - Install the migration package in the project: `npm i db-migrate db-migrate-pg --save-dev`
 - Install and run the postgres docker image - command `docker-compose up` this command will also automatically create a DataBase (specified in the `.env` file) with the user and pass also specified in the `.env` file
 - Port used: Default postgres port 5432 (specified in the `docker-composed.yml` file)
 - Production database - storefront (specified in the `.env` file)
 - Test Database - storefront_test (specified in the `.env` file)
 - User: postgres_storefront (specified in the `.env` file)
 - Password: password123 (specified in the `.env` file)
 - Create all the tables in the database - command `db-migrate up` 


### What ports the backend and database are running on
node: 3000
postgres: 5432

### To install all the dependencies

Run the following command: `npm install`

- express - Node.js web app framework
- dotenv - Load environment variables
- pg - PostgreSQL client
- bcrypt - Password hashing
- jsonwebtoken - JSON web tokens


# npm scripts
- `npm run build` - build production version of app in ./dist/ folder - "build": "npx tsc"
- `npm run start-dev` - start development app /w nodemon monitoring for changes - "start-dev": "nodemon src/server.ts"
- `npm run start-prod` - Start production app from ./dist folder - "start-prod": "node ./dist/server.js"
- `npm run test` - create test database, run jasmine, then drop test database. 
- `npm run prettier` - run prettier check - "prettier": "npx prettier **/*.ts --check"
- `npm run lint` - run lint with prettier plugin, and auto fix issues. - "lint": "eslint **/*.ts --fix --quiet" 



 ## Database Schema
 - See the REQUIREMENTS.md file
## Endpoints
 - See the REQUIREMENTS.md file

