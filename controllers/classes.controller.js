import utils from "../utils/utils.js";
import { listSubById, deleteClassById, createClass } from "../models/interfaces/classes.interface.js";
import { authCheck } from "../utils/utils.auth.js";

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

    async addClassForm(req, res) {
        if(!authCheck(req,res)) return;
        if(!req.params.parentId) return res.status(404).send("No classId provided");
        res.render("./pages/class/add.pug", {  admin: req.isAdmin, parentId: req.params.parentId });
    }

    async createClass(req, res) {
        if(!authCheck(req,res)) return;
        console.log(req.body)
        if (!req.body.parent_id) return res.status(404).send("No parentId provided");
        let added = await createClass(req.body);
        if(!added) return  res.status(500).send("Error creating class");
        return res.status(200).set('HX-Trigger', "classReload").send()
    }

    async deleteClass(req, res){
        if(!authCheck(req,res)) return;
        const classId = req.params.classId;
        if(!classId) return res.status(400).send("No classId provided");

        const result = await deleteClassById(classId);
        if(result){
            if(req.query.referrer === "parent"){
                res.status(200).set("HX-Trigger", "classReload").send();
            } else if(req.query.referrer === "page"){
                let redir = utils.str.getPrevUrl(req.get("HX-Current-URL") || null)
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