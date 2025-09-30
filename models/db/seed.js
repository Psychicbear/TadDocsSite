import { sequelize } from "./sqlConfig.js";
import { Page, Class, Property } from "../index.models.js";

async function seed() {
  await sequelize.sync({ force: true }); // Reset DB

  /* Seed data 
    Teach and Draw $ class
      - loadImage(x, y, filepath) method
      - w property
      - h property
      - shape class
  */
  // Create a class page
  const classPage = await Page.create({
    name: "$.",
    short_description: "$ is the core of Teach and Draw. Through the $ we can access all of the libraries functionality.",
    long_description: "$ is the core of Teach and Draw. Through the $ we can access all of the libraries functionality.",
    page_type: "class"
  });

  await Class.create({
    page_id: classPage.id,
    parent_class_id: null
  });



  /*
    shape class
      - strokeWidth property
      - rectangle(x, y, w, h) method
  */

  const shapePage = await Page.create({
    name: "shape",
    short_description: "The shape class contains methods and properties for drawing shapes.",
    long_description: "The shape class contains methods and properties for drawing shapes.",
    page_type: "class"
  });

  await Class.create({
    page_id: shapePage.id,
    parent_class_id: classPage.id
  });

  const shapeStrokeWidthPage = await Page.create({
    name: "strokeWidth",
    short_description: "Line thickness of shape.",
    long_description: "Controls the width of the stroke of the shape. This essentially controls the thickness of the lines that draw the shape.",
    page_type: "property"
  });

  await Property.create({
    page_id: shapeStrokeWidthPage.id,
    class_id: shapePage.id,
    type: "number",
    default_value: "1"
  })

  const imagePage = await Page.create({
    name: "image",
    short_description: "The image class contains methods and properties for handling images.",
    long_description: "The image class contains methods and properties for handling images.",
    page_type: "class"
  });

  await Class.create({
    page_id: imagePage.id,
    parent_class_id: classPage.id
  });

  const rectPage = await Page.create({
    name: "rect",
    short_description: "The rect class contains methods and properties for drawing rectangular shapes.",
    long_description: "The rect class contains methods and properties for drawing rectangular shapes.",
    page_type: "class"
  });

  await Class.create({
    page_id: rectPage.id,
    parent_class_id: shapePage.id
  });

  console.log("✅ Seed complete");
  process.exit();
}

seed();
