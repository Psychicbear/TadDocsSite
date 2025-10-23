import utils from "../utils/utils.js";

/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */

class Apps {
    constructor() {} //generally the constructor is going to be empty since we don't really want our controller calls sharing state if we can avoid it.

    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async gifsplit(req, res) {
        res.render("./apps/gifsplit.pug");
    }

    async spritesplit(req, res) {
        res.render("./apps/spritesplit.pug");
    }
}

//instantiate our one instance of app controller
const app_controller = new Apps();

export default app_controller;
