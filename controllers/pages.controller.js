import utils from "../utils/utils.js";
import { Page } from "../models/index.models.js";

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
    async home(req, res) {
        const root = await Page.getRoot();
        res.redirect(`/tad/${root.id}`);
    }

    async listPages(req, res) {
        const pages = await Page.listAll({ type: req.query.type });
        res.render("pages/list", { pages });
    }

    async viewPage(req, res) {
        const page = await Page.findWithDetails(req.params.pageId);
        console.log(page)
        if (!page) return res.status(404).send("Page not found");
        res.render("pages/view", { page });
    }
}

//instantiate our one instance of index controller
const index_controller = new Index();

export default index_controller;
