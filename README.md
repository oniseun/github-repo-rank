  GitHub Ranking Backend

GitHub Ranking Backend
======================

This is the backend part of the GitHub Ranking application built with NestJS and Redis.

Recommended Setup: Start the Entire Application (App + Infra)
-------------------------------------------------------------

**It is recommended to start the whole application using Docker, which includes both the backend and the necessary infrastructure (Redis and RedisInsight). No additional setup or configuration is needed.**

To start the entire application, run the following command:

    npm run start:app

Once the application is running, head on to [http://localhost:5050/api](http://localhost:5050/api) to see the Swagger API UI and test the endpoints in real-time.

Prerequisites
-------------

*   Node.js version: v18.19.0
*   NPM
*   NVM (Node Version Manager)
*   Docker

Setup Instructions
------------------

1.  **Use the Correct Node Version**
    
    Ensure you are using the correct version of Node.js:
    
        nvm use
    
2.  **Setup Environment Variables and Install Packages**
    
    Run the following command to set up environment variables and install the required packages:
    
        npm run setup
    
3.  **Start the Infrastructure (Redis and RedisInsight)**
    
    If you only want to start the infrastructure services (Redis and RedisInsight) without the application, run the following command:
    
        npm run start:infra
    
    RedisInsight can be accessed at [http://localhost:8001](http://localhost:8001).
    
4.  **Start the Development Server**
    
    The backend will run on `localhost:5050`:
    
        npm run start:dev
    

Running Tests
-------------

### Unit Tests

To run the unit tests, use the following command:

    npm run test

### End-to-End Tests

To run the end-to-end tests, use the following command:

    npm run test:e2e

Environment Variables
---------------------

The application requires several environment variables to be set. Use the `.env` file for setting these variables. A sample file is provided for reference.

    REDIS_HOST=localhost
    REDIS_PORT=6379
    CACHE_TTL_SECONDS=3600
    GITHUB_RANKING_BASE_URL=https://raw.githubusercontent.com/EvanLi/Github-Ranking/master/Data
    PORT=5050

Make sure to replace the placeholder values with the actual values required for your setup.

Scripts
-------

*   `npm run start:app`: Starts the entire application (backend + infrastructure).
*   `npm run start:infra`: Starts the infrastructure services (Redis and RedisInsight) only.
*   `npm run start:dev`: Starts the development server.
*   `npm run test:e2e`: Runs the end-to-end tests.
*   `npm run test`: Runs the unit tests.
*   `npm run setup`: Copies environment variables from `.envsample` to `.env` and installs packages.

Additional Information
----------------------

*   The application uses the NestJS framework for building efficient and scalable server-side applications.
*   The database used is Redis.
*   The application includes comprehensive logging using Pino.

Project Structure
-----------------

    backend/
    |-- src/
    |   |-- github-ranking/
    |   |   |-- dtos/
    |   |   |   |-- get-github-ranking.dto.ts
    |   |   |   |-- github-repo.dto.ts
    |   |   |-- interfaces/
    |   |   |   |-- github-repo.interface.ts
    |   |   |-- github-ranking.controller.ts
    |   |   |-- github-ranking.controller.spec.ts
    |   |   |-- github-ranking.module.ts
    |   |   |-- github-ranking.service.ts
    |   |   |-- github-ranking.service.spec.ts
    |   |-- app.module.ts
    |-- test/
    |   |-- app.e2e-spec.ts
    |   |-- jest-e2e.json
    |-- docker-compose.yml
    |-- docker-compose-infra-only.yml
    |-- .envsample
    |-- .env (generated by setup script)
    |-- package.json
    |-- README.md
    |-- tsconfig.json

Example `.env`
--------------

Here is an example of what your `.env` should look like:

    REDIS_HOST=localhost
    REDIS_PORT=6379
    CACHE_TTL_SECONDS=3600
    GITHUB_RANKING_BASE_URL=https://raw.githubusercontent.com/EvanLi/Github-Ranking/master/Data
    PORT=5050

Usage
-----

Once the setup is complete, you can start the application by running:

    npm run start:dev

The application will be accessible at `http://127.0.0.1:5050`.

Swagger Documentation
---------------------

Swagger documentation for the API can be accessed at `http://localhost:5050/api`.