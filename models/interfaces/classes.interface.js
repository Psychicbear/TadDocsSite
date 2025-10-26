import { Page, Class } from '../index.models.js';
import { sequelize } from '../db/sqlConfig.js';
import { parseSlug } from './pages.interface.js';

export async function listSubById(parentClassId){
    const t = await sequelize.transaction();
    try {
        const subclasses = await Class.findAll({
            where: { parent_class_id: parentClassId },
            // attributes: [], // We only want the associated Page data
            transaction: t, 
            include: [{
                model: Page, as: 'MainPage',
                attributes: ['id', 'name', 'short_description', 'slug'],
            }],
            raw: true,
            nest: true 
        });
        console.log(subclasses)
        /*
            Expected result format:
            [
                { "Page": { "id": 11, "name": "Subclass A Page", "short_description": "...", slug: "/parent/subclass-a" },
                { "Page": { "id": 12, "name": "Subclass B Page", "short_description": "...", slug: "/parent/subclass-b" },
            ]
        */
        let flattened = subclasses.map(subclass => subclass.MainPage)
        await t.commit();
        return flattened;
    } catch (error) {
        await t.rollback();
        console.error("Error in listSubclasses:", error);
        return null;
    }
}

export async function createClass(data) {
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

        console.log("Creating class page with slug:", page.slug);
        if(data.short_desc) page.short_description = data.short_desc;
        if(data.long_desc) page.long_description = data.long_desc;

        await page.save({ transaction: t });

        const model = await page.createMainClass({ parent_class_id: parent_id }, { transaction: t });

        if(!model) { throw new Error("Failed to create main " + page_type);}
        await t.commit()
        return page;
    } catch (err) {
        console.error(`Error in creating class ${data.name}:  ${err}`);
        await t.rollback();
        return null;
    }
}