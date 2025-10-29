import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";
import { Class } from "./classes.model.js";
import { Property } from "./properties.model.js";
import { Method } from "./methods.model.js";
import { Argument } from "./arguments.model.js";
import { Example } from "./examples.model.js";

class Page extends Model {

  /* 
    #####################
    # Find page queries #
    #####################
  */

  // Get the root "$." page
  static async getRoot() {
    let page = await this.findOne({ where: { name: "tad", page_type: "class" }, raw: true });
    return await this.findWithDetails(page);
  }

  static async getBySlug(slug) {
    let page = await this.findOne({ where: { slug: slug }, raw: true });
    if(!page) return null;
    return await this.findWithDetails(page);
  }

  // Get a page with subtype-specific details
  static async findWithDetails(page) {
    let query = {};
    switch(page.page_type) {
      case "method":
        query = this.includeMethodDetails()
      case "property":
        query = this.includePropertyDetails();
      case "class":
        query = this.includeClassDetails();
    }
    query.include.push({ model: Example, as: "CodeExample" });
    let hydratedPage = await this.findByPk(page.id, query);
    return hydratedPage;
  }

  /*
    * Class-specific details
    * This returns a Page eagerly loaded with its Class details
    * Used for rendering Class pages
  */
    static includeClassDetails() {
      return {
        include: [
                {
                  model: Class,
                  as: "SubClasses",
                  include: [{ model: this, as: "MainPage" }]
                },
                {
                  model: Class,
                  as: "MainClass",
                  include: [
                    { model: Property, as: "Properties", include: [{ model: this, as: "MainPage" }] },
                    {
                      model: Method,
                      as: "Methods",
                      include: [
                        { model: this, as: "MainPage" },
                        { model: Argument, as: "Arguments" }
                      ]
                    }
                  ]
                }
              ],
              // Order nested Arguments by their arg_index. Use the nested path through associations.
              order: [
                [{ model: Class, as: "MainClass" }, { model: Method, as: "Methods" }, { model: Argument, as: "Arguments" }, "arg_index", "ASC"]
              ]
      }
    }

  /*
    * Property-specific details
    * This returns a Page eagerly loaded with its Property details
    * Used for rendering Property pages
  */

  static includePropertyDetails() {
    return { include: [{model: Property, as: "MainProperty"}] }
  }

  /*
    * Method-specific details
    * This returns a Page eagerly loaded with its Method details and Arguments
    * Used for rendering Method pages
  */
  static includeMethodDetails() {
    return { include: [{model: Method, as: "MainMethod", include: [{model: Argument, as: "Arguments"}]}] }
  }

}


/*
  * Page model representing documentation pages in the database.
*/
const PageModel = Page.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    short_description: DataTypes.TEXT,
    long_description: DataTypes.TEXT,
    page_type: {
      type: DataTypes.ENUM("class", "method", "property"),
      allowNull: false
    },
    code_example_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Example", key: "id" }
    }
  },
  {
    sequelize,
    timestamps: true,
    paranoid: false,
    freezeTableName: true
  }
);

export { PageModel as Page };
