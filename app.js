import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import util from './utils/utils.js';

import index from './routes/index.routes.js';


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

// ------ BIND ROUTES ------
app.use('/', index);

//Alternate port for testing
const PORT = process.env.PORT === 'production' ? process.env.PORT : 3000;

// ------ START SERVER ------
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

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