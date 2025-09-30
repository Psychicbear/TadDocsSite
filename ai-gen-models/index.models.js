import { Page } from "./pages.model.js";
import { Class } from "./classes.model.js";
import { Method } from "./methods.model.js";
import { Property } from "./properties.model.js";
import { Argument } from "./arguments.model.js";
import { sequelize } from "./db/sqlConfig.js";

// Associations
Page.hasOne(Class, { foreignKey: "page_id" });
// Page.hasOne(Method, { foreignKey: "page_id" });
// Page.hasOne(Property, { foreignKey: "page_id" });

Class.hasMany(Method, { foreignKey: "class_id" });
Class.hasMany(Property, { foreignKey: "class_id" });

Method.hasMany(Argument, { foreignKey: "method_id" });

sequelize.sync({ alter: true });
export { Page, Class, Method, Property, Argument };
