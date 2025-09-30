import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";

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
    freezeTableName: true
  }
);

export { PropertyModel as Property };
