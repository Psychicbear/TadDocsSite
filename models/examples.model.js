import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";

/*
    * Example model representing code examples in the database.
    * THIS FILE ONLY DEFINES THE MODEL AND ITS SCHEMA.
    * INTERACTIONS WITH THE MODEL SHOULD BE HANDLED IN INTERFACE FILES.
    * ASSOCIATIONS ARE DEFINED IN INDEX MODEL FILE.
*/

class Example extends Model {}

const ExampleModel = Example.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    publicCode: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    privateCode: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true
  }
);


export { ExampleModel as Example };
