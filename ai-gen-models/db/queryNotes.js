import { Note } from "../notes.model.js";
import { sequelize } from "./sqlConfig.js";
import { Op } from "sequelize";

async function queryNotes() {
    try {
        const notes = await Note.findAll();

        console.log("Queried Notes:");
        notes.forEach(note => {
            console.log(`- ${note.title}: ${note.content}`);
        });
    } catch (error) {
        console.error("Error querying notes:", error);
    } finally {
        await sequelize.close();
    }
}

queryNotes();