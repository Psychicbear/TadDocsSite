import assert from "../../utils/utils.assert.js";
import { Example, Page } from "../index.models.js";
import { sequelize } from "../db/sqlConfig.js";

/**
 * Using Fake data for now to get things mocked out and done
 */

export class ExampleInterface {
    /** @param {Example} data */
    constructor(data = Example) {
        assert.not_null(data);
        this.data = data;
    }
    async all() {
        return this.data;
    }

    async createExampleForPage(data) {
        const t = await sequelize.transaction();
        try {
            const { name, publicCode, page_id } = data
            console.log("Creating example with:", data);


            const example = await Example.create({
                name: name,
                publicCode: publicCode,
            }, { transaction: t });
            if(!example) throw new Error("Failed to create example");

            if(data.description) example.description = data.description;
            if(data.privateCode) example.privateCode = data.privateCode;
            await example.save({ transaction: t });

            const addToPage = await Page.findByPk(page_id);
            if(!addToPage) throw new Error("Parent page not found");
            addToPage.code_example_id = example.id;
            await addToPage.save({ transaction: t });

            await t.commit()
            return addToPage
        } catch (err) {
            console.error(`Error in creating example ${data.name}:  ${err}`);
            await t.rollback();
            return null;
        }
    }

    async listExampleOptions() {
        try {
            const examples = await Example.findAll({
                attributes: ['id', 'name', 'description'],
            });
            console.log(examples)
            return examples;
        } catch (error) {
            console.error("Error in listExampleOptions:", error);
            return null;
        }
    }

    async findExampleById(exampleId) {
        try {
            const example = await Example.findByPk(exampleId);
            return example;
        } catch (error) {
            console.error("Error in findExampleById:", error);
            return null;
        }
    }

    async addExampleToPage(exampleId, pageId) {
        const t = await sequelize.transaction();
        try {
            const example = await Example.findByPk(exampleId);
            if(!example) throw new Error("Example not found");

            const page = await Page.findByPk(pageId);
            if(!page) throw new Error("Page not found");

            page.code_example_id = example.id;
            await page.save({ transaction: t });

            await t.commit();
            return page;
        } catch (err) {
            console.error("Error in addExampleToPage:", err);
            await t.rollback();
            return null;
        }
    }

    async removeExampleFromPage(pageId) {
        const t = await sequelize.transaction();
        try {
            const page = await Page.findByPk(pageId);
            if(!page) throw new Error("Page not found");

            page.code_example_id = null;
            await page.save({ transaction: t });

            await t.commit();
            return page;
        } catch (err) {
            console.error("Error in removeExampleFromPage:", err);
            await t.rollback();
            return null;
        }
    }

    async updateExample(example_id, data) {
        const t = await sequelize.transaction();
        try {
            const { name, description, publicCode, privateCode } = data;
            const example = await Example.findByPk(example_id);
            if(!example) throw new Error("Example not found");

            if(name) example.name = name;
            if(description) example.description = description;
            if(publicCode) example.publicCode = publicCode;
            if(privateCode) example.privateCode = privateCode;
            await example.save({ transaction: t });

            await t.commit();
            return example;
        } catch (err) {
            console.error("Error in updateExample:", err);
            await t.rollback();
            return null;
        }
    }

    async deleteById(exampleId) {
        const t = await sequelize.transaction();
        try {
            const example = await Example.findByPk(exampleId);
            if(!example) throw new Error("Example not found");

            await example.destroy({ transaction: t, force: true });

            await t.commit();
            return true;
        } catch (err) {
            console.error("Error in deleteById:", err);
            await t.rollback();
            return false;
        }
    }

    /**
     *
     * @param {string} id
     */
    async getById(id) {
        assert.type(id, "string");
        return this.data[Number(id)];
    }
}

const singleton = new ExampleInterface([
    {
        id: "1",
        name: "one",
        public: "print('hi')",
        private: "console.log('hi')",
    },
    {
        id: "2",
        name: "two",
        public: "shape.rectangle(20,20,20,20)",
        private: `import { tad, shape } from "/js/lib/TeachAndDraw.js";

        tad.use(update);
        console.log(tad, document.querySelector("#myCanvas"));
        tad.w=280;
        tad.h=280;
        function update() {shape.border="#282c34";shape.colour="#282c34";shape.rectangle(tad.w/2,tad.h/2,tad.w,tad.h);shape.colour="blue";shape.rectangle(50,50,50,tad.h);}`,
    },
]);
export default singleton;
