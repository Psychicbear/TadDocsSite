import utils from "../utils/utils.js";
import examples from "../models/interfaces/examples.interface.js";

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
    async list(req, res) {
        const all = await examples.all();

        res.render("./snippets/view.pug", {
            snippet: all[1],
        });
        return;
    }

    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async read(req, res) {
        const { snippetId } = req.params;
        console.log({snippetId});

        const target = await examples.getById(snippetId);
        if(!target) {
            res.send(`404 ${snippetId} not found!`);
            return;
        }

        res.render("./snippets/view.pug", {
            snippet: target,
        });
        return;
    }
    /**
     * Route for retrieving the private code and sending it off to a running view we can import in via iframe.
     * @param {Request} req
     * @param {Response} res
     */
    async run(req, res) {
        const { snippetId } = req.params;

        const target = await examples.getById(snippetId);
        if(!target) {
            res.send(`404 ${snippetId} not found!`);
            return;
        }

        res.render("./snippets/run.pug", {
            snippet: target,
        });
        return;
    }
}

//instantiate our one instance of index controller
const examples_controller = new Examples();

export default examples_controller;
