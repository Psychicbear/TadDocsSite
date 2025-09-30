import { sequelize, testConnection } from "./sqlConfig.js";
import { Note } from "../notes.model.js";

async function createTables() {
    try {
        await testConnection();
        await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
        console.log("All tables created successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        await sequelize.close();
    }
}

createTables();