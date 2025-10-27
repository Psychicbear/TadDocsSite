import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";

/*
    * Class model representing classes in the database.
    * THIS FILE ONLY DEFINES THE MODEL AND ITS SCHEMA.
    * INTERACTIONS WITH THE MODEL SHOULD BE HANDLED IN INTERFACE FILES.
    * ASSOCIATIONS ARE DEFINED IN INDEX MODEL FILE.
*/

class Class extends Model {}

const ClassModel = Class.init(
  {
    page_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: "Page", key: "id" }
    },
    parent_class_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Class", key: "page_id" }
    }
  },
  {
    sequelize,
    paranoid: false,
    timestamps: false,
    freezeTableName: true
  }
);


export { ClassModel as Class };
