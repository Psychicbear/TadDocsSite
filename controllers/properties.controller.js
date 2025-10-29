import utils from "../utils/utils.js";
import { Page } from "../models/index.models.js";
import { listPropsById, getPropDetails, editPropById, createPropForModule, deletePropById } from "../models/interfaces/properties.interface.js";
import { authCheck } from "../utils/utils.auth.js";

/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */

class Properties {
    constructor() {} //generally the constructor is going to be empty since we don't really want our controller calls sharing state if we can avoid it.

    /**
     *
     * @param {Request} req
     * @param {Response} res
     */

    async viewProp(req, res) {
        if (!req.params.propId) return res.status(404).send("No propId provided");
        let details = await getPropDetails(req.params.propId);
        if (!details) return res.status(404).send("Property not found");

        res.render("./pages/property/view.pug", { propId: req.params.propId, prop: details, admin: req.isAdmin });
    }

    async listProps(req, res) {
        if (!req.params.parentId) return res.status(404).send("No class for property list provided");
        const props = await listPropsById(req.params.parentId);
        if (!props) return res.status(404).send("No properties found for provided class");
        res.render("./pages/property/list.pug", { props: props, admin: req.isAdmin, parentId: req.params.parentId  });
    }

    async editProp(req, res) {
        if(!authCheck(req,res)) return;
        if (!req.params.propId) return res.status(404).send("No propId provided");
        let edit = await editPropById(req.params.propId, req.body)
        if(!edit) return res.status(500).send("Error editing property");
        return res.status(206).set('HX-Refresh', 'true').send()
    }

    async addPropForm(req, res) {
        if(!authCheck(req,res)) return;
        if(!req.params.parentId) return res.status(404).send("No classId provided");
        res.render("./pages/property/add.pug", {  admin: req.isAdmin, parentId: req.params.parentId });
    }

    async createProp(req, res) {
        if(!authCheck(req,res)) return;
        if (!req.body.parent_id) return res.status(404).send("No parent_id provided");
        let prop = await createPropForModule(req.body);
        if(!prop) return res.status(500).send("Error creating property");
        return res.status(200).set('HX-Trigger', "propertyReload").send()
    }

    async deleteProp(req, res) {
        if(!authCheck(req,res)) return;
        if (!req.params.propId) return res.status(404).send("No propId provided");
        
        const result = await deletePropById(req.params.propId);
        if(result){
            if(req.query.referrer === "parent"){
                return res.status(206).set('HX-Refresh', 'true').send()
                // res.status(200).set("HX-Trigger", "methodReload").send();
            }else if(req.query.referrer === "page"){
                let redir = utils.str.getPrevUrl(req.get("HX-Current-URL") || null)
                console.log("Redirecting to:", redir);
                if(req.get("HX-Request")) {
                    res.status(204).set('HX-Redirect', redir).send();
                } else return res.status(200).redirect(redir);
            }

        } else return res.status(500).send("Failed to delete method");
    }
}

//instantiate our one instance of app controller
const properties_controller = new Properties();

export default properties_controller;