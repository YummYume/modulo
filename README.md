# Modulo
The Modulo project.

## How to install
- Clone the project using `git clone --recurse-submodules https://github.com/YummYume/modulo.git`
- Copy the `.env` file in the root folder and name it `.env.local`, override any needed variable (**!!if you change the db username and/or password, you also need to change the configuration for the mariadb connection in api/.env!!**)
- Copy the `docker-compose-dev.yml.dist` in the root folder and name it `docker-compose-dev.yml`, override any needed configuration
- Run `make start`
- *Extra* : add `127.0.0.1 modulo.local` in your hosts file
- You can now access the different services of modulo (using `localhost` or `modulo.local`)

## Ports
- <a href="https://modulo.local" target="_blank">API</a> (Symfony) : **80** (http, redirects to 443) and **443** (https)
- <a href="http://modulo.local:3000" target="_blank">App</a> (React) : **3000**
- DB (default mariadb port) : **3306**
- <a href="http://modulo.local:8080" target="_blank">phpmyadmin</a> : **8080**
- <a href="http://modulo.local:1080" target="_blank">Mailcatcher</a> : **1080**

## Commands
- `make start` : executes `make rm`, `make up`, `make perm`, `make jwt-keypair`, `make db-drop`, `make yarn-api-compile` and `make sync-dependencies`, in this exact order
- `make up` : kills every running container and rebuilds + run them, then executes `make perm`, `make composer` and `make jwt-keypair`, in this exact order
- `make up-db` : executes `make up` and `make db`, in this exact order
- `make stop` : stops and kills every running container
- `make rm` : remove stopped containers
- `make down` : stops and removes all containers, networks, volumes and images
- `make db` : creates everything related to the database (including fixtures)
- `make db-drop` : drops the current database and recreates it with `make db`
- `make perm` : grants permissions for the api folders
- `make ssh-api` : `sh` in the api container
- `make ssh-app` : `sh` in the app container
- `make ssh-nginx` : `bash` in the nginx container
- `make composer` : runs `composer update` and `composer install` for the api container
- `make jwt-keypair` : runs `php bin/console lexik:jwt:generate-keypair` in the api container to generate the jwt keys
- `make yarn` : runs `yarn install` for the app container
- `make yarn-api` : runs `yarn install` for the api container
- `make yarn-api-compile` : runs `yarn dev` for the api container
- `make yarn-api-watch` : runs `yarn watch` for the api container
- `make composer-sync` : runs `make composer` and `make sync-dependencies-api`, in this exact order
- `make yarn-sync` : runs `make yarn` and `make sync-dependencies-app`, in this exact order
- `make yarn-api-sync` : runs `make yarn-api` and `make sync-dependencies-yarn-app`, in this exact order
- `make cc` : clears cache for the api container
- `make cl` : clears the nginx logs (the nginx container must be STOPPED to run this command)
- `make sync-dependencies-api` : syncs the `vendor` api folder with the host
- `make sync-dependencies-app` : syncs the `node_modules` app folder with the host
- `make sync-dependencies-yarn-api` : syncs the `node_modules` api folder with the host
- `make sync-dependencies` : runs `make sync-dependencies-api`, `make sync-dependencies-app` and `make sync-dependencies-yarn-api`, in this exact order

## Install a new dependency
**This is important** : To install a `yarn` or `composer` package, `ssh` into the container (`make ssh-app` or `make ssh-api`) and install it there, then run `make sync-dependencies` (or any `sync-dependencies` command to sync only the required container)

## The API Submodule
**If you didn't clone with the `--recurse-submodules` option :**
- Run `git submodule update --init` in the project's root folder

**To make a change in the API :**
- Go into the API folder and create and/or checkout to a branch
- Make your changes and push
- Go back to the project's root folder and run `git add api`, then commit and push

**To get the latest version of the API submodule :**
- Run `git submodule update` in the project's root folder

## Extra
- **Nginx** logs are available in **nginx/logs**
- Use **make** commands for **Windows** :
  - Install GnuWin32 <a href="https://altushost-swe.dl.sourceforge.net/project/gnuwin32/make/3.81/make-3.81.exe" target="_blank">here</a>
  - Add the make.exe (**GnuWin32/bin**) to your *PATH*
- If a command does not work, use `make perm` and make sure you are running your cmd as an administrator
