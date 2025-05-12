# Accounts micro-service

This is a micro services project example based on the book hands on microservices with JavaScript [GitHub](https://github.com/PacktPublishing/Hands-on-Microservices-with-JavaScript/tree/main/Ch07/accountservice/configs)

## How to run

> [!NOTE]
> This project depends on the transactions micro-service project. Go to this repository and follow the instructions to run it. [GitHub](https://github.com/simonhoyos/microservices-js-transaction-service)

1. Clone this repository
2. Run `nvm use` to set the node version
3. Run `yarn install` to install the dependencies
4. Run `docker compose up` to start the database
5. Make sure you have defined all the environment variables in the `.env` file. You can use the `.env.example` file as a reference.
6. Make sure `KAFKA_TOPIC` is the same in both services.
7. Run migrations with `yarn knex migrate:latest` (check `package.json` for the aliased script)
8. Run `yarn dev` to start the development server
9. Ping the server at `http://localhost:9000/health-check` to check if it's running

