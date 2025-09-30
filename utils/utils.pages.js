import assert from "./utils.assert.js";

/**
 * @typedef {import('./types.mjs').OurRequest} Request
 * @typedef {import('./types.mjs').ExpressResponse} Response
 */

const ERROR_CODES = {
    400: [
        "400 - Bad Request",
        "Could not process the request",
        "If you think this is in error please contact us",
    ],
    403: [
        "403 - Forbidden",
        "You aren't meant to be here sorry.",
        "If you think this is in error please contact us",
    ],
    404: [
        "404 - Not Found",
        "The requested resource can not be found",
        "If you think this is in error please contact us",
    ],
    415: [
        "415 - Unsupported Media Type",
        "File Given is not supported for this action",
        "This is usually a sign you have uploaded a file of the wrong filetype, or it may not match some other kind of condition. If you think this is in error please contact us",
    ],
    500: [
        "500 - Internal Server Error",
        "Uh Oh, something has gone wrong",
        "Please contact us if this persists",
    ],
    503: [
        "503 - Service Unavailable",
        "Something on the server is currently not available",
        "Please contact us if this persists",
    ],
};

class ErrorPageBuilder {
    #title = "";
    #message = "";
    /** @type {(String | {title:string, message:string})[]} */
    #details = [];
    /**
     *
     * @param {number} code
     */
    constructor(code) {
        assert.type(code, "number");
        this.code = code;
        this.#get_default_content_from_error_code(code);
    }
    /** @param {number} code */
    #get_default_content_from_error_code(code) {
        assert.type(code, "number");
        let err_code = code.toString(); //change it to a string for us to use as our key
        if (Object.keys(ERROR_CODES).includes(code.toString())) {
            err_code = ERROR_CODES[code.toString()][0];
            if (this.#title === "") {
                this.#title = ERROR_CODES[code.toString()][1];
            }
            if (this.#message === "") {
                this.#message = ERROR_CODES[code.toString()][2];
            }
        }
    }
    /**
     * Sets the title to be displayed for this error page.
     * @param {string} value - new title value
     * @returns {this} - the page builder so we can continue chaining methods
     */
    title(value) {
        assert.type(value, "string");
        this.#title = value;
        return this;
    }
    /**
     *
     * @param {string} value - new message value
     * @returns {this} - the page builder so we can continue chaining methods
     */
    message(value) {
        assert.type(value, "string");
        this.#message = value;
        return this;
    }

    /**
     * @param {(String | {title:string, message:string})[]} value
     */
    details(value) {
        assert.not_null(value);
        assert.array(value);
        this.#details = value;
        return this;
    }
    /**
     * Hand the response object to the builder to use to call render.
     * Will handle
     * @param {Request} req
     * @param {Response} res
     */
    render(req, res) {
        assert.not_null(req);
        assert.not_null(req.user);
        assert.not_null(res);
        const is_htmx = req.headers["hx-request"] === "true";
        let view_path = "./base";
        if (is_htmx) {
            view_path = "./base/fragments";
        }
        res.render(`${view_path}/error.pug`, {
            user: req.user,
            title: this.#title,
            message: this.#message,
            details: this.#details,
        });
    }
}

class Pages {
    constructor() {}
    sign_on() {}

    /**
     * @param {number} code
     * @returns
     */
    error(code) {
        return new ErrorPageBuilder(code);
    }
}

export default new Pages();
/**
 * pages.error(code, res).title("").message("").render(req,res);
 * pages.error(code,res).title("").message("").hxrender(req,res); <- render to fragment
 * pages.error(code, res).title("other title").message(" blurb ").details([]).render(); <- takes a list of one or more details to put on the screen, useful for lists
 */
