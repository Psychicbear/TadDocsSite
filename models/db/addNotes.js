import { Note } from "../notes.model.js";
import { sequelize } from "./sqlConfig.js";

async function addNotes() {
    try {
        // Create sample notes
        const notes = [
            { title: "First Note", content: "This is the content of the first note." },
            { title: "Second Note", content: "This is the content of the second note." },
            { title: "Third Note", content: "This is the content of the third note." },
            { title: "Fourth Note", content: "This is the content of the fourth note." },
            { title: "Fifth Note", content: "This is the content of the fifth note." }
        ];

        for (const noteData of notes) {
            await Note.create(noteData);
            console.log(`Note titled "${noteData.title}" created.`);
        }

        console.log("Sample notes added successfully.");
    } catch (error) {
        console.error("Error adding notes:", error);
    } finally {
        await sequelize.close();
    }
}

addNotes();