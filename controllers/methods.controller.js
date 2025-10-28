import utils from "../utils/utils.js";
import { listMethodsById, getMethodDetails, editMethodArgById, editMethodById, deleteMethodById } from "../models/interfaces/methods.interface.js";
import { authCheck } from "../utils/utils.auth.js";

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
        let details = await getMethodDetails(req.params.methodId);
        if (!details) return res.status(404).send("Method not found");
        const {args, returns} = details;
        res.render("./pages/method/view.pug", { methodId: req.params.methodId, args, returns, admin: req.isAdmin });
    }

    async listMethods(req, res) {
        if (!req.params.parentId) return res.status(404).send("No class for method list provided");
        const methods = await listMethodsById(req.params.parentId);
        if (!methods) return res.status(404).send("No methods found for provided class");
        res.render("./pages/method/list.pug", { methods: methods, admin: req.isAdmin, parentId: req.params.parentId  });
    }

    async editMethod(req, res) {
        if(!authCheck(req,res)) return;
        if (!req.params.methodId) return res.status(404).send("No methodId provided");
        let edit = await editMethodById(req.params.methodId, req.body)
        if(!edit) return res.status(500).send("Error editing method");
        return res.status(200).set('HX-Trigger', {"load": {"target": ".type-details"}})
    }
    async editMethodArg(req, res){
        if(!authCheck(req,res)) return;
        const { methodId, argId } = req.params;
        if (!methodId || !argId) return res.status(404).send("No methodId or argId provided");
        let edit = await editMethodArgById(argId, req.body)
        if(!edit) return res.status(500).send("Error editing argument");
        return res.status(200).set('HX-Trigger', {"load": {"target": ".type-details"}})
    }

    async addArgument(req, res) {
        if(!authCheck(req,res)) return;
        if (!req.params.methodId) return res.status(404).send("No methodId provided");
        res.render("./pages/method/add_argument.pug", { methodId: req.params.methodId, admin: req.isAdmin });
    }

    // PLACEHOLDER - implement createMethod in models/interfaces/methods.interface.js
    async createMethod(req, res) {
        if(!authCheck(req,res)) return;
        if (!req.params.methodId) return res.status(404).send("No methodId provided");
        res.render("./pages/method/create_method.pug", { methodId: req.params.methodId, admin: req.isAdmin });
    }

    // PLACEHOLDER - implement deleteMethod in models/interfaces/methods.interface.js
    async deleteMethod(req, res) {
        if(!authCheck(req,res)) return;
        if (!req.params.methodId) return res.status(404).send("No methodId provided");

        const result = await deleteMethodById(req.params.methodId);
        if(result){

            let redir = utils.str.getPrevUrl(req.get("HX-Current-URL") || null)
            if(!(req.query.referrer === undefined) && req.query.referrer === "page"){
                console.log("Redirecting to:", redir);
                if(req.get("HX-Request")) {
                    res.status(204).set('HX-Redirect', redir).send();
                } else return res.status(200).redirect(redir);
            }

        } else return res.status(500).send("Failed to delete method");
    }

    // PLACEHOLDER - implement deleteMethodArg in models/interfaces/methods.interface.js
    async deleteMethodArg(req, res) {
        if(!authCheck(req,res)) return;
        const { methodId, argId } = req.params;
        if (!methodId || !argId) return res.status(404).send("No methodId or argId provided");
    }
}

//instantiate our one instance of app controller
const methods_controller = new Methods();

export default methods_controller;