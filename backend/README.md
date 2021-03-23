# Mnemonics REST API

- To install the dev requirements use:
`pip install -r requirements.txt`
- To make the migrations:
  - `python manage.py makemigrations`
  - `python manage.py migrate`
- Finally, To run a dev server:
`python manage.py runserver`
  
- To generate docs in an `api.yaml` use:
    - `python manage.py generate_swagger -f yaml api.yaml`
