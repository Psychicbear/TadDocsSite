import { sequelize } from "./sqlConfig.js";
import { Page, Class, Property, Method, Argument, Example } from "../index.models.js";
import { createProp } from "../interfaces/properties.interface.js";
import { createClass } from "../interfaces/classes.interface.js";
import { createMethodFromReq } from "../interfaces/methods.interface.js";
import {parseFile, parseCode } from "../../utils/utils.parse-lib.mjs";
import path from 'path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import fs from "fs/promises";
import { UtilsString } from "../../utils/utils.string.js";
import { parseSlug } from "../interfaces/pages.interface.js";

async function seed() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const tadPath = path.join(__dirname, '/tad');
    console.log(__dirname);

    let files = await fs.readdir(tadPath);
    console.log(files);
    await sequelize.sync({ force: true }); // Reset DB

    await Example.create(
    {
        name: "one",
        public: "print('hi')",
        private: "console.log('hi')",
    })

    const exampleItem = await Example.create(
    {
        name: "two",
        public: "shape.rectangle(20,20,20,20)",
        private: `import { tad, shape } from "/js/lib/TeachAndDraw.js";

        tad.use(update);
        console.log(tad, document.querySelector("#myCanvas"));
        tad.w=280;
        tad.h=280;
        function update() {shape.border="#282c34";shape.colour="#282c34";shape.rectangle(tad.w/2,tad.h/2,tad.w,tad.h);shape.colour="blue";shape.rectangle(50,50,50,tad.h);}`,
    })

    const classPage = await Page.create({
        name: "tad",
        slug: "/",
        short_description: "$ is the core of Teach and Draw. Through the $ we can access all of the libraries functionality.",
        long_description: "$ is the core of Teach and Draw. Through the $ we can access all of the libraries functionality.",
        page_type: "class",
        code_example_id: exampleItem.id,
    });

    await classPage.createMainClass({
        parent_class_id: null
    });

    try {
        for(const file of files){
            if(path.extname(file) !== '.js') continue;
            console.log(`Parsing file: ${file}`);
            const parsed = await parseFile(path.join(tadPath, '/', file));
            try {
                let className = UtilsString.lowerFirstLetter(path.basename(file, '.js'));
                let classSlug = parseSlug(className, className, classPage);
                console.log(`Determined class slug: ${classSlug}`);
                let newClass = await createClass({
                    name: className,
                    slug: classSlug,
                    page_type: "class",
                    parent_id: classPage.id
                });
                if(!newClass){
                    throw Error(`Failed to create class for file ${file}`);
                }
                console.log(`Created class ${newClass.name} for file ${file}`);
                for(const data of parsed){
                    data.parent_id = newClass.id; // Set $ as parent for all
                    data.slug = parseSlug(data.name, data.name, newClass); // Generate slug based on parent
                    data.page_type = data.type; // Set page_type from type
                    let created = null;
                    switch(data.type){
                        case "property":
                            created = await createProp(data);
                            break;
                        case "method":
                            created = await createMethodFromReq(data);
                            break;
                        default:
                            console.warn(`Unknown type ${data.type} in file ${file}`);
                    }
                    if(!created){
                        console.error(`Failed to create ${data.type} ${data.name} from file ${file}`);
                    }
                }
            } catch (err) {
                console.error(`Error processing parsed data from file ${file}: ${err}`);
            }
            console.log(`Parsed data from ${file}:`, parsed);
        }
    } catch (err) {
        console.log("Error during seeding:", err);
    }




    console.log("✅ Seed complete");
    process.exit();
}

seed();
