import { sequelize } from "./sqlConfig.js";
import { Page, Class, Method, Property, Argument } from "../index.models.js";

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

  // Create method pages
  const loadImagePage = await Page.create({
    name: "loadImage",
    short_description: "Queues an image to be loaded and returns an Image Entity",
    long_description: "Queues an image to be loaded and ready for use in your update function. It takes a pair of numbers for the x and y coordinates and a string indicating the location of a img file asset.,Img file assets are expected to be .png or .jpg.",
    page_type: "method"
  });

  await Method.create({
    page_id: loadImagePage.id,
    class_id: classPage.id,
    is_static: false
  });

  await Argument.bulkCreate([
    {
      method_id: loadImagePage.id,
      name: "x",
      type: "number",
      description: "The x coordinate where the image will be placed"
    },
    {
      method_id: loadImagePage.id,
      name: "y",
      type: "number",
      description: "The y coordinate where the image will be placed"
    },
    {
      method_id: loadImagePage.id,
      name: "filepath",
      type: "string",
      description: "Location of the image file to be loaded"
    }
  ]);

  // Create property page
  const wPage = await Page.create({
    name: "w",
    short_description: "Width of the canvas in pixels.",
    long_description: "Specifies the size of the width of the canvas. This value is set in pixels.",
    page_type: "property"
  });

  await Property.create({
    page_id: wPage.id,
    class_id: classPage.id,
    type: "number",
    default_value: "640"
  });

  // Create property page
  const hPage = await Page.create({
    name: "h",
    short_description: "Height of the canvas in pixels.",
    long_description: "Specifies the size of the height of the canvas. This value is set in pixels.",
    page_type: "property"
  });

  await Property.create({
    page_id: hPage.id,
    class_id: classPage.id,
    type: "number",
    default_value: "640"
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

  const strokeWidthPage = await Page.create({
    name: "strokeWidth",
    short_description: "Sets the width of the stroke used for lines and borders around shapes.",
    long_description: "Sets the width of the stroke used for lines and borders around shapes. This value is set in pixels.",
    page_type: "property"
  });

  await Property.create({
    page_id: strokeWidthPage.id,
    class_id: shapePage.id,
    type: "number",
    default_value: "1"
  });

  const rectanglePage = await Page.create({
    name: "rectangle",
    short_description: "Draws a rectangle on the canvas.",
    long_description: "Draws a rectangle on the canvas. It takes four parameters: the x and y coordinates of the top-left corner, and the width and height of the rectangle.",
    page_type: "method"
  });

  await Method.create({
    page_id: rectanglePage.id,
    class_id: shapePage.id,
    is_static: false
  });

  await Argument.bulkCreate([
    {
        method_id: rectanglePage.id,
        name: "x",
        type: "number",
        description: "The x coordinate of the top-left corner of the rectangle"
        },
        {
        method_id: rectanglePage.id,
        name: "y",
        type: "number",
        description: "The y coordinate of the top-left corner of the rectangle"
        },
        {
        method_id: rectanglePage.id,
        name: "w",
        type: "number",
        description: "The width of the rectangle"
        },
        {
        method_id: rectanglePage.id,
        name: "h",
        type: "number",
        description: "The height of the rectangle"
        }
]);



  console.log("✅ Seed complete");
  process.exit();
}

seed();
