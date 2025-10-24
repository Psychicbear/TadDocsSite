import { Page, Class } from '../index.models.js';
import { sequelize } from '../db/sqlConfig.js';

export async function listSubById(parentClassId){
    const t = await sequelize.transaction();
    try {
        const subclasses = await Class.findAll({
            where: { parent_class_id: parentClassId },
            attributes: [], // We only want the associated Page data
            transaction: t, 
            include: [{
                model: Page, as: 'MainPage',
                attributes: ['id', 'name', 'short_description', 'slug']
            }],
            raw: true,
            nest: true 
        });
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