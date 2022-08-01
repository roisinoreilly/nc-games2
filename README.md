# Northcoders House of Games API

## Background

This is an API built for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

## Installation

### Create environment variables

In order to run this repository locally, you will need to run `npm install` to install packages listed in the package.json. You will also need to install the following packages by typing `npm install` followed by:

- `express`
- `supertest`

You will then need to create two .env files, .env.test and .env.development and add `PGDATABASE=` followed by the database names found in /db/setup.sql.