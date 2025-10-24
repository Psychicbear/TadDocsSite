import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import util from './utils/utils.js';
import { UtilsString } from './utils/utils.string.js';
import { sequelize } from './models/db/sqlConfig.js';
// Import models (registers associations). Do not import a file that calls sync()
import './models/index.models.js';

import index from './routes/index.routes.js';
import notes from './routes/notes.routes.js';
import apps from './routes/apps.routes.js';
import pages from './routes/pages.routes.js';
import examples from './routes/examples.routes.js';
import classes from './routes/classes.routes.js';
import methods from './routes/methods.routes.js';
import properties from './routes/properties.routes.js';


/* Old CommonJs style globals, because I'm a boomer */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const hasMissingEnvironmentVariables =
    process.env.PORT === undefined || process.env.NODE_ENV === undefined || process.env.ADMIN_IPS === undefined || process.env.PROXY_TRUSTED === undefined;
if (hasMissingEnvironmentVariables) {
    throw new Error("MISSING ENVIRONMENT VARIABLES");
}

const ADMIN_IPS = process.env.ADMIN_IPS ? process.env.ADMIN_IPS.split(',').map(ip => ip.trim()) : [];
console.log(ADMIN_IPS);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', process.env.PROXY_TRUSTED === 'true');

console.log(`Static files served from ${path.join(__dirname, 'public')}`);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ------ ADMIN IPS MIDDLEWARE. WARNING: EXPERIMENTAL ------
app.use((req, res, next) => {
    let ipv4 = UtilsString.ipv4FromString(req.ip);
    console.log(`Incoming request from IP: ${ipv4}`);
    console.log(req.ip)
    console.log(`X-Forwarded-For header: ${req.headers['x-forwarded-for']}`);
    console.log(`Real IP: ${req.headers['x-real-ip']}`);
  req.isAdmin = ADMIN_IPS.includes(ipv4) || ADMIN_IPS.includes(req.headers['x-forwarded-for']);
  next();
});

// ------ BIND ROUTES ------
app.use('/', index);
app.use('/notes', notes);
app.use('/apps', apps)
app.use('/tad', pages)
app.use('/examples', examples)
app.use('/classes', classes)
app.use('/methods', methods)
app.use('/properties', properties)

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