import utils from "../utils/utils.js";
import { Note } from "../models/notes.model.js";

/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */

class Index {
    constructor() {} //generally the constructor is going to be empty since we don't really want our controller calls sharing state if we can avoid it.

    //we want the controller methods to be async so we can use async methods and await them, very common in db or file system touching stuff.



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
            notes: await Note.findTop(),
        });
    }
}

//instantiate our one instance of index controller
const index_controller = new Index();

export default index_controller;
