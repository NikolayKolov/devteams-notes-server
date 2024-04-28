# Simple Notes app back end

This repository contains the back end for a simple Notes application.
Before using this repo, set up the PostgreSQL database first.

The back end is written in TypeScript and uses NodeJS, Express, JWT token authentication middleware, a PostgreSQL database linked with a [Prisma ORM](https://www.prisma.io/), [Zod](https://zod.dev/) for form data validation.

The database contains notes and users. Each user must be authenticated to access the access the API endpoints to create, edit and delete notes. 
Each user has access to only the notes he has created and is an owner of. The user password is stored in the form of a hash with salt value to increase security.
The notes can be of 2 types - text or checklist.

Both the frontend and the backend run on the same server (localhost) and must be run on the same machine.
The frontend uses a proxy setting in the vite.config.ts file to communicate with the backend on localhost.
These settings must be changed for a production deployment.

The folder structure for the project should be: a main folder named /Notes, and in it 2 folders: /server and /client.
Set up the back end and fron end in the /server and /client folders accordingly.

## Project set-up

1. Set up the PostgreSQL database first.
     - Install [PostgreSQL](https://www.postgresql.org/) and a control utility [pgAdmin 4](pgadmin.org).
     - Set up a database on the server, name it notes for example.
     - Add a password to the suer that controls the database for extra security.
     - Set up DATABASE_URL in the .env file, check the .sample.env for an example. 
2. Set up a folder structure for the project, if you haven't already:
    - Create a main folder, for example /Notes.
    - Set up the backend in a folder /Notes/server, for example.
    - Create a folder /Notes/client for the frontend.
3. Copy or clone the repo in the backend folder.
3. Test if you have NodeJS installed.
  - In Command Prompt, type 'node -v' and execute. If an error appears, go to [this site](https://nodejs.org/) and install latest stable version from there.
4. Open the backend folder with Visual Studio code, and open a terminal and execute command 'npm install'.
5. Open the NPM Scripts menu on the bottom left part and run the script 'dev', or type 'npm run dev'.
