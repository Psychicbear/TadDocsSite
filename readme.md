# Tad Documentation library
### This is currently a janky build ontop of an existing old demo app. Clutter must be cleared

## Developing
### Seed the database
To seed the database with some fake data for the time being, run the following:
`npm run seed`
This will reset the database then populate it with fake data.

### Run the app
To run the app I typically use nodemon to restart on changes. This can be run with either:
`npx nodemon`
OR
`npm run dev`

### Sequelize pipeline
#### Tl;dr import the models you want to use from **models/index.models.js**

Sequelize is configured and instantiated in a weird way. Initial configuration of the database is handled in the `models/db/sqlConfig.js` file, where the database is set to be created in this folder as `database.sqlite`.

`sqlConfig.js` exports the configured Sequelize instance, and each of the models in `models/` folder import this instance to configure themselves within the database.

Each of the models export their configured instance, and are loaded into the `models/index.models.js` to configure relationships. This file then exports each of the configured models with their relationships. This means that when the models need to be used anywhere on the site, they should be imported from `models/index.models.js`.