# Accounts micro-service

This is a micro services project example based on the book hands on microservices with JavaScript [GitHub](https://github.com/PacktPublishing/Hands-on-Microservices-with-JavaScript/tree/main/Ch09/accountservice)

## How to run

> [!NOTE]
> This project depends on the following micro-services:
> Transactions micro-service project. [GitHub](https://github.com/simonhoyos/microservices-js-transaction-service)
> Account micro-service project. [GitHub](https://github.com/simonhoyos/microservices-js-account-service)
> Authentication micro-service project. [GitHub](https://github.com/simonhoyos/microservices-js-authentication-service)

1. Run the transaction micro-service project.
1. Clone this repository
1. Run `nvm use` to set the node version
1. Run `yarn install` to install the dependencies
1. Run `docker compose up` to start the database
1. Run migrations with `yarn knex migrate:latest` (check `package.json` for the aliased script)
1. Make sure you have defined all the environment variables in the `.env` file. You can use the `.env.example` file as a reference.
1. Make sure `KAFKA_TOPIC` is the same in both services.
1. Run `yarn dev` to start the development server
1. Ping the server at `http://localhost:9000/health-check` to check if it's running
1. Run the authentication micro-service project.
