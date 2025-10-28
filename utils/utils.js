import nanoid from "./utils.nanoid.js";
import assert from "./utils.assert.js";
import log from "./utils.log.js";
import pages from "./utils.pages.js";
import { UtilsString } from "./utils.string.js";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/* Old CommonJs style globals, because I'm a boomer */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("dirname",__dirname);

class Util {
    constructor() {
        this.pages = pages;
        this.log = log;
        this.assert = assert;
        this.nano = nanoid;
        this.str = UtilsString
    }
}

export default new Util();