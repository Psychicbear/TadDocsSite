import utils from "../utils/utils.js";
import { Page } from "../models/index.models.js";

/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */

class Properties {
    constructor() {} //generally the constructor is going to be empty since we don't really want our controller calls sharing state if we can avoid it.

    /**
     *
     * @param {Request} req
     * @param {Response} res
     */

}

//instantiate our one instance of app controller
const properties_controller = new Properties();

export default properties_controller;