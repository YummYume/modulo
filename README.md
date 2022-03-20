# Modulo
The Modulo project.

## How to install
- Clone the project using `git clone`
- Copy the `.env` file in the root folder and name it `.env.local`, override any needed variable (**!!if you change the db username and/or password, you also need to change the configuration for the mariadb connection in api/.env!!**)
- Copy the `docker-compose-dev.yml.dist` in the root folder and name it `docker-compose-dev.yml`, override any needed configuration
- Run `make start`
- *Extra* : add `modulo.local 127.0.0.1` in your hosts file
- You can now access the different services of modulo (using `localhost` or `modulo.local`)

## Ports
- <a href="https://modulo.local:8000" target="_blank">API</a> (Symfony) : **8000**
- <a href="http://modulo.local:3000" target="_blank">App</a> (React) : **3000**
- DB (default mariadb port) : **3306**
- <a href="http://modulo.local:8080" target="_blank">phpmyadmin</a> : **8080**
- <a href="http://modulo.local:1080" target="_blank">Mailcatcher</a> : **1080**

## Commands
- `make start` : executes `make rm`, `make up`, `make perm` and `make db-drop`, in this exact order
- `make up` : kills every running container and rebuilds + run them
- `make up-db` : executes `make up` and `make db`, in this exact order
- `make stop` : stops and kills every running container
- `make rm` : remove stopped containers
- `make down` : stops and removes all containers, networks, volumes and images
- `make db` : creates everything related to the database (including fixtures)
- `make db-drop` : drops the current database and recreates it with `make db`
- `make perm` : grant permissions to the api `var` folder
- `make ssh-api` : `sh` in the api container
- `make ssh-app` : `sh` in the app container
- `make ssh-nginx` : `bash` in the nginx container
- `make composer` : runs `composer install` for the api container
- `make yarn` : runs `yarn install` for the app container
- `make cc` : clears cache for the api container
- `make cl` : clears the nginx logs (the nginx container must be STOPPED to run this command)

## Extra
- **Nginx** logs are available in **nginx/logs**
- Use **make** commands for **Windows** :
  - Install GnuWin32 <a href="https://altushost-swe.dl.sourceforge.net/project/gnuwin32/make/3.81/make-3.81.exe" target="_blank">here</a>
  - Add the make.exe (**GnuWin32/bin**) to your *PATH*
