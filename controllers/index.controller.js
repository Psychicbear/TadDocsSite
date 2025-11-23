import utils from "../utils/utils.js";

/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */

class Index {
    constructor() {} //generally the constructor is going to be empty since we don't really want our controller calls sharing state if we can avoid it.


    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async index(req, res) {
        req.user = {
            name: "Riley",
        };
        const { user } = req; //get the user object from our req so we aren't typing req.user everywhere.

        res.render("./index.pug", {
            user: user,
        });
    }
}

//instantiate our one instance of index controller
const index_controller = new Index();

export default index_controller;
