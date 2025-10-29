import { Page, Property, Class } from '../index.models.js';
import { sequelize } from '../db/sqlConfig.js'
import { parseSlug } from './pages.interface.js';

export async function getPropDetails(propId) {
    try {
        let prop = await Property.findByPk(propId, {
            attributes: ['type', 'default_value'],
            rejectOnEmpty: true,
            raw: true,
        })
        console.log("Fetched property details:", prop);
        return prop
    } catch (error) {
        console.error("Error in getPropDetails:", error);
        return null;
    }
}

export async function listPropsById(classId) {
    const t = await sequelize.transaction();
    try {
        const props = await Property.findAll({
            where: { class_id: classId },
            attributes: ['type', 'default_value'], // We only want the associated Page data
            transaction: t, 
            include: [{
                model: Page, as: 'MainPage',
                attributes: ['id', 'page_type', 'name', 'short_description', 'slug']
            }],
            raw: true,
            nest: true 
        });

        let flattened = props.map(prop => {
            let newProp = prop.MainPage
            newProp.type = prop.type
            newProp.default_value = prop.default_value
            return newProp
        })

        await t.commit();
        return flattened;
    } catch (error) {
        await t.rollback();
        console.error("Error in listProps:", error);
        return null;
    }
}

export async function editPropById(id, data) {
    console.log("Editing page:", id, "with the following data:");
    console.log(data);
    const t = await sequelize.transaction();
    try {
        const prop = await Property.findByPk(id, { transaction: t });
        if(!prop) throw new Error("Prop not found");

        if(data.type) prop.type = data.type;
        if(data.default_value) prop.default_value = data.default_value;
        await prop.save({ transaction: t });
        await t.commit();
        console.log("Updated page:", prop);
        return prop;

    } catch (err) {
        console.error("Error in editPageById:", err);
        await t.rollback();
        return null;
    }
}

export async function deletePropById(id) {
    const t = await sequelize.transaction();
    try {
        const prop = await Property.findByPk(id, { transaction: t });
        if(!prop) throw new Error("Page not found");

        const destroy = await prop.destroy({ transaction: t });
        if(!destroy) throw new Error("Failed to delete page");

        await t.commit();
        return destroy;
    } catch (err) {
        console.error("Error in deletePageById:", err);
        await t.rollback();
        return null;
    }
}

export async function createPropForModule(pageId, data) {
    const t = await sequelize.transaction();
    try {
        const { name, page_type, parent_id } = data

        const page = await Page.create({
            name: name,
            page_type: page_type,
        }, { transaction: t });
        if(!page) throw new Error("Failed to create page");

        if(data.slug) page.slug = data.slug;
        else { 
            let parent = await Page.findByPk(parent_id);
            if(!parent) throw new Error("Parent page not found");
            
            page.slug = parseSlug(name, name, parent);
        }

        if(data.short_desc) page.short_description = data.short_desc;
        if(data.long_desc) page.long_description = data.long_desc;
        await page.save({ transaction: t });

        const model = await page.createMainProperty({ class_id: parent_id }, { transaction: t });
        if(data.prop_type) model.type = data.prop_type;
        if(data.default_value) model.default_value = data.default_value;

        await model.save({ transaction: t });

        await t.commit()
        return page;
    } catch (err) {
        console.error("Error in createPropForModule:", err);
        await t.rollback();
        return null;
    }
}

export async function createProp(data) {
    const t = await sequelize.transaction();
    try {
        const { name, page_type, parent_id } = data


        const page = await Page.create({
            name: name,
            page_type: page_type,
        }, { transaction: t });
        if(!page) throw new Error("Failed to create page");

        if(data.slug) page.slug = data.slug;
        else page.slug = parseSlug(name, name, parent);

        if(data.short_desc) page.short_description = data.short_desc;
        if(data.long_desc) page.long_description = data.long_desc;

        await page.save({ transaction: t });

        const model = await page.createMainProperty({ class_id: parent_id }, { transaction: t });
        if(data.type) model.type = data.type;
        if(data.default_value) model.default_value = data.default_value;
        await model.save({ transaction: t });

        if(!model) { throw new Error("Failed to create main " + page_type);}
        await t.commit()
        return page;
    } catch (err) {
        console.error(`Error in creating prop ${data.name}:  ${err}`);
        await t.rollback();
        return null;
    }
}
