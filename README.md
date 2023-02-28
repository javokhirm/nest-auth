# NEST AUTH

## Description

Authentication and Authorization using NestJs

## Installation

Run from **root** folder

```bash
$ npm install
```

Configure **.env.development** file

```
DB_CONNECTION=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=nest_auth
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_SYNC=true

JWT_ACCESS_SECRET=some_access_secret_key
JWT_REFRESH_SECRET=some_refresh_secret_key
```

Create a database before running the app

## Running the app

```bash
# development - watch mode (use this)
$ npm run start:dev

# production mode
$ npm run start:prod
```
