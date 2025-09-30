import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import util from './utils/utils.js';
import { sequelize } from './models/db/sqlConfig.js';
// Import models (registers associations). Do not import a file that calls sync()
import './models/index.models.js';

import index from './routes/index.routes.js';
import notes from './routes/notes.routes.js';
import apps from './routes/apps.routes.js';
import pages from './routes/pages.routes.js';


/* Old CommonJs style globals, because I'm a boomer */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const hasMissingEnvironmentVariables =
    process.env.PORT === undefined || process.env.NODE_ENV === undefined;
if (hasMissingEnvironmentVariables) {
    throw new Error("MISSING ENVIRONMENT VARIABLES");
}

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

console.log(`Static files served from ${path.join(__dirname, 'public')}`);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------ BIND ROUTES ------
app.use('/', index);
app.use('/notes', notes);
app.use('/apps', apps)
app.use('/tad', pages)

//Alternate port for testing
const PORT = process.env.PORT === 'production' ? process.env.PORT : 3000;

// ------ START SERVER ------
let server;

async function start() {
    // In development, keep schema in sync with models. Do NOT run alter/sync in production.
    if (process.env.NODE_ENV !== 'production') {
        console.log('Running sequelize.sync({ alter: true }) (development only)');
        try {
            await sequelize.sync({ alter: false });
            console.log('Database synced (alter).');
        } catch (err) {
            console.error('Error syncing database:', err);
            process.exit(1);
        }
    }

    server = app.listen(PORT, () => {
        console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
}

start();

// ------ CLOSE DOWN THE SERVER -------------
/** @param {string} signal */
function shutdownApp(signal) {
    console.log(`Received ${signal}. Closing down...`);
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
}
process.on("SIGINT", () => shutdownApp("SIGINT"));
process.on("SIGTERM", () => shutdownApp("SIGTERM"));