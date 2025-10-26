import utils from "../utils/utils.js";
import { listSubById } from "../models/interfaces/classes.interface.js";

/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */

class Classes {
    constructor() {} //generally the constructor is going to be empty since we don't really want our controller calls sharing state if we can avoid it.

    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async listSubclasses(req, res) {
        let subClasses = await listSubById(req.params.parentId)
        subClasses = subClasses || []
        res.render("./pages/class/list.pug", { subClasses: subClasses, admin: req.isAdmin, parentId: req.params.parentId });
    }

    async viewClass(req, res) {
        if (!req.params.classId) return res.status(404).send("No classId provided");
        res.render("./pages/class/view.pug", { parentId: req.params.classId, admin: req.isAdmin });
    }
}

//instantiate our one instance of app controller
const classes_controller = new Classes();

export default classes_controller;