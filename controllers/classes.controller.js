import utils from "../utils/utils.js";
import { listSubById, deleteClassById } from "../models/interfaces/classes.interface.js";

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

    async deleteClass(req, res){
        const classId = req.params.classId;
        if(!classId) return res.status(400).send("No classId provided");

        const result = await deleteClassById(classId);
        if(result){
            let redir = utils.str.getPrevUrl(req.get("HX-Current-URL") || null)
            if(!(req.query.referrer === undefined) && req.query.referrer === "page"){
                console.log("Redirecting to:", redir);
                if(req.get("HX-Request")) {
                    res.status(204).set('HX-Redirect', redir).send();
                } else return res.status(200).redirect(redir);
            }

        } else return res.status(500).send("Failed to delete class");

    }
}

//instantiate our one instance of app controller
const classes_controller = new Classes();

export default classes_controller;