DOCKER=docker
COMPOSE=docker-compose -f docker-compose.yml -f docker-compose-dev.yml
EXECAPI=$(COMPOSE) exec api
EXECAPP=$(COMPOSE) exec app
EXECNGINX=$(COMPOSE) exec nginx

start:
	make rm
	make up
	make perm
	make db-drop
	make sync-dependencies
	@echo Ready!

up:
	$(COMPOSE) kill
	$(COMPOSE) build --force-rm
	$(COMPOSE) up -d
	make composer

up-db:
	make up
	make db

stop:
	$(COMPOSE) stop
	$(COMPOSE) kill

rm:
	$(COMPOSE) kill
	$(COMPOSE) rm --force

down:
	$(COMPOSE) down -v --rmi 'all'

db:
	make db-wait
	$(EXECAPI) php bin/console doctrine:database:create --if-not-exists
	$(EXECAPI) php bin/console doctrine:schema:update --force
	$(EXECAPI) php bin/console doctrine:fixtures:load --append

db-drop:
	make db-wait
	$(EXECAPI) php bin/console doctrine:database:drop --if-exists --force
	make db

db-wait:
	$(EXECAPI) php -r "set_time_limit(60);for(;;){if(@fsockopen(\"db\",3306)){break;}echo \"Waiting for DB to be ready...\n\";sleep(1);}"

perm:
	$(EXECAPI) chmod +x bin/console
ifeq ($(OS),Windows_NT)
	$(EXECAPI) chown -R www-data:root var/
else
	sudo chown -R www-data:$(USER) .
	sudo chmod -R g+rwx .
endif

ssh-api:
	$(EXECAPI) sh

ssh-app:
	$(EXECAPP) sh

ssh-nginx:
	$(EXECNGINX) bash

composer:
	$(EXECAPI) composer install

yarn:
	$(EXECAPP) yarn install

cc:
	$(EXECAPI) bin/console c:cl --no-warmup
	$(EXECAPI) bin/console c:warmup

cl:
ifeq ($(OS),Linux)
	truncate -s 0 nginx/logs/error.log
	truncate -s 0 nginx/logs/access.log
else
	break>nginx/logs/error.log
	break>nginx/logs/access.log
endif

sync-dependencies:
	@echo Syncing dependencies...
	$(DOCKER) cp modulo-api:/app/api/vendor ./api/vendor
	$(DOCKER) cp modulo-app:/usr/src/app/node_modules ./app/node_modules
	@echo Dependencies synced!
