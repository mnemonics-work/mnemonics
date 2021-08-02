# Mnemonics

To run the app first use `yarn install`, then you can:
- Run it(in dev mode), use `yarn run dev`
- Run the lint, use `yarn run lint`
- To generate api client(communicate to api backend), use: `yarn run generate-api`, also after you generate the api classes, you have to export them in the `api.yml` file by doing:
    - Import the api classes from `generated-api` folder. e.g `import ExampleApi as _ExampleApi`
    - Create and export an object using the Api classes constructor passing the `config` constant(contains base url) as a parameter. e.g `export const ExampleApi = new _ExampleApi(config);` 
- To build the project use `yarn run build`, in staging environment use `yarn run build:staging` and in production environment
use `yarn run build:prod`
