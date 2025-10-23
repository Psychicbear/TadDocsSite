import utils from "../utils/utils.js";
import { Example } from "../models/index.models.js";

/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */

class Examples {
    constructor() {} //generally the constructor is going to be empty since we don't really want our controller calls sharing state if we can avoid it.


    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async index(req, res) {
    }
}

//instantiate our one instance of index controller
const examples_controller = new Examples();

export default examples_controller;
