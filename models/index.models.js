import { Page } from "./pages.model.js";
import { Class } from "./classes.model.js";
import { Property } from "./properties.model.js";
import { Method } from "./methods.model.js";
import { Argument } from "./arguments.model.js";
import { Example } from "./examples.model.js";
import { sequelize } from "./db/sqlConfig.js";


// Associations
// Page <-> Class (1-to-1 and 1-to-many)
Page.hasOne(Class, { as: "MainClass", foreignKey: "page_id"});
Page.hasMany(Class, { as: "SubClasses", foreignKey: "parent_class_id"});
Class.belongsTo(Page, { as: "MainPage", foreignKey: "page_id", hooks: true});
Class.belongsTo(Page, { as: "ParentClass", foreignKey: "parent_class_id" });

// Property <-> Page <-> Class
Property.belongsTo(Page, { foreignKey: "page_id", as: "MainPage", hooks: true});
Property.belongsTo(Class, { foreignKey: "class_id", as: "ParentClass" });
Class.hasMany(Property, { foreignKey: "class_id", as: "Properties", onDelete: "CASCADE", hooks: true });
Page.hasOne(Property, { foreignKey: "page_id", as: "MainProperty"});

// Method <-> Page <-> Class
Method.belongsTo(Page, { foreignKey: "page_id", as: "MainPage", hooks: true });
Method.belongsTo(Class, { foreignKey: "class_id", as: "ParentClass" });
Class.hasMany(Method, { foreignKey: "class_id", as: "Methods", onDelete: "CASCADE", hooks: true });
Page.hasOne(Method, { foreignKey: "page_id", as: "MainMethod"});

// Argument <-> Method
Argument.belongsTo(Method, { foreignKey: "method_id", as: "ParentMethod" });
Method.hasMany(Argument, { foreignKey: "method_id", as: "Arguments", onDelete: "CASCADE", hooks: true });

// Example <-> Page
Example.hasMany(Page, { foreignKey: "code_example_id", as: "CodeExample" });
Page.belongsTo(Example, { foreignKey: "code_example_id", as: "CodeExample" });

Page.addHook('afterUpdate', async (page, options) => {
    if(!page.changed('slug')) return;
    console.log(`Page slug changed for Page ID ${page.id}, updating associated Class, Property, and Method slugs if applicable.`);
    let props = await Property.findAll({ where: { class_id: page.id }, include: [{association: "MainPage"}], transaction: options.transaction });
    for(const prop of props) {
        let propPage = prop.MainPage;
        if(propPage) propPage.slug = `${page.slug}/${propPage.name}`;
        await propPage.save({ transaction: options.transaction });
        console.log(`Updated Property Page slug to ${propPage.slug}`);
    }

    let methods = await Method.findAll({ where: { class_id: page.id }, include: [{association: "MainPage"}], transaction: options.transaction });
    for(const method of methods) {
        let methodPage = method.MainPage;
        if(methodPage) methodPage.slug = `${page.slug}/${methodPage.name}`;
        await methodPage.save({ transaction: options.transaction });
        console.log(`Updated Method Page slug to ${methodPage.slug}`);
    }

    let subClasses = await Class.findAll({ where: { parent_class_id: page.id }, include: [{association: "MainPage"}], transaction: options.transaction });
    for(const subClass of subClasses) {
        let subClassPage = subClass.MainPage;
        if(subClassPage) subClassPage.slug = `${page.slug}/${subClassPage.name}`;
        await subClassPage.save({ transaction: options.transaction });
        console.log(`Updated SubClass Page slug to ${subClassPage.slug}`);
    }
})

Example.addHook('afterDestroy', async (example, options) => {
    console.log(`Example with ID ${example.id} destroyed. Removing code_example_id from associated Pages.`);
    let pages = await Page.findAll({ where: { code_example_id: example.id }, transaction: options.transaction });
    for(const page of pages) {
        page.code_example_id = null;
        await page.save({ transaction: options.transaction });
        console.log(`Removed code_example_id from Page ${page.name}`);
    }
});

// Hooks to enable deleting page that owns Class, Property, or Method when they are deleted
Class.addHook("afterDestroy", async (cls, options) => {
  console.log("Destroyed Class: ", cls.id);
  await Page.destroy({ where: { id: cls.page_id }, transaction: options.transaction, force: true });
  console.log(`Destroyed associated Page of ${cls.id}`);
});

Property.addHook("afterDestroy", async (prop, options) => {
  console.log("Destroyed Property: ", prop.id);
  await Page.destroy({ where: { id: prop.page_id }, transaction: options.transaction, force: true });
  console.log(`Destroyed associated Page of ${prop.id}`);
});

Method.addHook("afterDestroy", async (method, options) => {
  console.log("Destroyed Method: ", method.id);
  await Page.destroy({ where: { id: method.page_id }, transaction: options.transaction, force: true });
  console.log(`Destroyed associated Page of ${method.id}`);
});


sequelize.sync({ alter: false });

export { Page, Class, Property, Method, Argument, Example };
