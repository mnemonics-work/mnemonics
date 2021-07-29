# Mnemonics work
"Mnemonics work" is a web project created to display a collection of mnemonics, to provide an aid to students and professionals that may have difficulties to learn and master a topic.

It is an open initiative, aiming to welcome contributions.

Additional background information, motivation behind the project is available in the [Wiki section](https://github.com/mnemonics-work/mnemonics/wiki) of the project.

## Quick development setup
### Frontend:
- Tested and working with `Python 3.6.13`
- To install the development packages:
    - `pip install -r requirements/dev-requirements.txt`
- To run the development server:
    - `python manage.py runserver`
### Backend:
- To setup the node environment:
    - Use `Node 1.15.8` and `Yarn 1.22.5`
    - To install the packages run `yarn install`
- To run the development server:
    - `yarn run dev`

## Backend:
- The backend of this project is a REST API made by using Django Rest Framework
- Deployment: 
    - The backend is deployed to an Heroku instance by using Gitlab CI/CD.
- For more details see the README file inside the backend folder.

## Frontend:
- The frontend of this project is made by using React Framework (along with Ant Design), Webpack and Typescript.
- Deployment: 
    - The frontend is deployed to an S3 instance by using Gitlab CI/CD.
- For more details see the README file inside the frontend folder.

## Integration Backend-Frontend
- To accomplish a successfull integration without much effort, automatic generation of an  API client library is used.
- `drf-yasg` is used to generate the Swagger specifications of our API in `api.yaml`.
- And `@openapitools/openapi-generator-cli` is used to automatically generate the client library(from the `api.yaml` file) for our API, to be easily used in our React Components.
