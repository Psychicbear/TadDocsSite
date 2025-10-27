import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";

/*
    * Property model representing class properties in the database.
    * THIS FILE ONLY DEFINES THE MODEL AND ITS SCHEMA.
    * INTERACTIONS WITH THE MODEL SHOULD BE HANDLED IN INTERFACE FILES.
    * ASSOCIATIONS ARE DEFINED IN INDEX MODEL FILE.
*/

class Property extends Model {}

const PropertyModel = Property.init(
  {
    page_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: "Page", key: "id" }
    },
    class_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Class", key: "page_id" }
    },
    type: DataTypes.STRING,
    default_value: DataTypes.STRING
  },
  {
    sequelize,
    timestamps: false,
    paranoid: false,
    freezeTableName: true
  }
);

export { PropertyModel as Property };
