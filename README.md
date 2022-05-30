# Modulo
The Modulo project.

## How to install
- Clone the project using `git clone git@github.com:YummYume/modulo.git`
- Copy the `.env` file in the root folder and name it `.env.local`, override any needed variable (**!!if you change the db username and/or password, you also need to change the configuration for the mariadb connection in api/.env!!**)
- Copy the `docker-compose-dev.yml.dist` in the root folder and name it `docker-compose-dev.yml`, override any needed configuration
- Run `make start`
- *Extra* : add `127.0.0.1 modulo.local api.modulo.local admin.modulo.local` in your hosts file
- *Extra* : copy the `api/.php-cs-fixer.dist.php` file and rename it `.php-cs-fixer.php` and configure your IDE to use this file with the PHP-CS-Fixer extension
- You can now access the different services of Modulo (using `localhost` or `modulo.local`)

## Ports
- <a href="https://modulo.local" target="_blank">API</a> (Symfony) : **80** (http, redirects to 443) and **443** (https)
- <a href="https://modulo.local:3000" target="_blank">App</a> (React) : **3000** (!!uses https for jwt!!)
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
- `make db-migrate` : execute migrations for the api
- `make perm` : grants permissions for the api folders
- `make ssh-api` : `sh` in the api container
- `make ssh-app` : `sh` in the app container
- `make ssh-nginx` : `bash` in the nginx container
- `make composer` : runs `composer install -n` for the api container
- `make jwt-keypair` : runs `php bin/console lexik:jwt:generate-keypair` in the api container to generate the jwt keys
- `make yarn` : runs `yarn install` for the app container
- `make yarn-api` : runs `yarn install` for the api container
- `make yarn-api-compile` : runs `make yarn-api` and `yarn dev` for the api container
- `make yarn-api-watch` : runs `make yarn-api` and `yarn watch` for the api container
- `make composer-sync` : runs `make composer` and `make sync-dependencies-api`, in this exact order
- `make yarn-sync` : runs `make yarn` and `make sync-dependencies-app`, in this exact order
- `make yarn-api-sync` : runs `make yarn-api` and `make sync-dependencies-yarn-app`, in this exact order
- `make cc` : clears cache for the api container
- `make cl` : clears the nginx logs (the nginx container must be STOPPED to run this command)
- `make php-cs-fixer` : runs php-cs fixer for the src folder of the api
- `make lint` : runs `yarn lint` for the app folder
- `make analyze` : runs `yarn analyze` for the app folder (reports are under `app/.next/analyze`)
- `make sync-dependencies-api` : syncs the `vendor` api folder with the host
- `make sync-dependencies-app` : syncs the `node_modules` app folder with the host
- `make sync-dependencies-yarn-api` : syncs the `node_modules` api folder with the host
- `make sync-dependencies` : runs `make sync-dependencies-api`, `make sync-dependencies-app` and `make sync-dependencies-yarn-api`, in this exact order
- `make cypress` : runs `yarn cypress` in the app container (see the **Tests** section below for more info)
- `make cypress-headless` : runs `yarn cypress:headless` in the app container (no GUI)

## Install a new dependency
**This is important** : To install a `yarn` or `composer` package, `ssh` into the container (`make ssh-app` or `make ssh-api`) and install it there, then run `make sync-dependencies` (or any `sync-dependencies` command to sync only the required container)

## Extra
- **Nginx** logs are available in **nginx/logs**
- Use **make** commands for **Windows** :
  - Install GnuWin32 <a href="https://altushost-swe.dl.sourceforge.net/project/gnuwin32/make/3.81/make-3.81.exe" target="_blank">here</a>
  - Add the make.exe (**GnuWin32/bin**) to your *PATH*
- If a command does not work, use `make perm` and make sure you are running your cmd as an administrator

## Formatters
- **JS** : Prettier (using `.prettierrc` config file) and Eslint (using `.eslintrc.json` config file)<br>
  In case the VScode extension doesn't work properly and throws errors like `Parsing error : Cannot find module 'next/babel'`, add the following in your `settings.json` file :<br>
  ```
  "eslint.workingDirectories": [
    "./app"
  ]
  ```
- **PHP** : PHP-CS-Fixer (using `api/.php-cs-fixer.php` config file)

## Tests
### You can run tests with Cypress :
- Download VNC Viewer <a href="https://www.realvnc.com/fr/connect/download/viewer/" target="_blank">here</a>
- Connect to 127.0.0.1:5920 in VNC Viewer
- Run `make cypress` to launch the Cypress GUI in the VNC Viewer
- You can also run `make cypress-headless` for CL tests only (no GUI)

## Demo
- The website is available at https://www.modulo-scout.fr
