WEB = mnemonics_backend


.PHONY: up
up:
	-docker-compose up --$(mode)


.PHONY: down
down:
	-docker-compose down


.PHONY: build
build:
	-docker-compose build


.PHONY: test
test:
	-docker exec -it $(WEB) python manage.py test


.PHONY: makemigrations
makemigrations:
	-docker exec -it $(WEB) python manage.py makemigrations


.PHONY: migrate
migrate:
	-docker exec -it $(WEB) python manage.py migrate


.PHONY: createsuperuser
createsuperuser:
	-docker exec -it $(WEB) python manage.py createsuperuser


.PHONY: lint
lint:
	-black .


.PHONY: docs
docs:
	-docker exec -it $(WEB) python manage.py generate_swagger -f yaml api.yaml
