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
	$(EXECAPI) bin/console doctrine:database:create --if-not-exists
	$(EXECAPI) bin/console doctrine:schema:update --force
	$(EXECAPI) bin/console doctrine:fixtures:load --append

db-drop:
	$(EXECAPI) bin/console doctrine:database:drop --if-exists --force
	make db

perm:
ifeq ($(OS),Linux)
	sudo chown -R www-data:$(USER)
	sudo chmod -R g+rwx .
else
	$(EXECAPI) chown -R www-data:root var/
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
