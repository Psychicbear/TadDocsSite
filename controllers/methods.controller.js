import utils from "../utils/utils.js";
import { listMethodsById } from "../models/interfaces/methods.interface.js";

/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */

class Methods {
    constructor() {} //generally the constructor is going to be empty since we don't really want our controller calls sharing state if we can avoid it.

    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async viewMethod(req, res) {
        if (!req.params.methodId) return res.status(404).send("No methodId provided");
        res.render("./pages/method/view.pug", { methodId: req.params.methodId, admin: req.isAdmin });
    }

    async listMethods(req, res) {
        if (!req.params.parentId) return res.status(404).send("No class for method list provided");
        const methods = await listMethodsById(req.params.parentId);
        if (!methods) return res.status(404).send("No methods found for provided class");
        res.render("./pages/method/list.pug", { methods: methods, admin: req.isAdmin, parentId: req.params.parentId  });
    }

    async editMethod(req, res) {
        if (!req.params.methodId) return res.status(404).send("No methodId provided");
        res.render("./pages/method/edit.pug", { methodId: req.params.methodId, admin: req.isAdmin });
    }

    async addArgument(req, res) {
        if (!req.params.methodId) return res.status(404).send("No methodId provided");
        res.render("./pages/method/add_argument.pug", { methodId: req.params.methodId, admin: req.isAdmin });
    }
}

//instantiate our one instance of app controller
const methods_controller = new Methods();

export default methods_controller;