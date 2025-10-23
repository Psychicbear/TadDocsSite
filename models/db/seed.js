import { sequelize } from "./sqlConfig.js";
import { Page, Class, Property, Method, Argument, Example } from "../index.models.js";

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
    slug: "/",
    short_description: "$ is the core of Teach and Draw. Through the $ we can access all of the libraries functionality.",
    long_description: "$ is the core of Teach and Draw. Through the $ we can access all of the libraries functionality.",
    page_type: "class"
  });

  console.log(classPage.slug)

  await classPage.createMainClass({
    parent_class_id: null
  });

  const loadImagePage = await Page.create({
          name: "loadImage",
          slug: classPage.slug + "loadimage",
          short_description: "Loads an image from the specified file path and draws it at the given coordinates.",
          long_description: "The loadImage method loads an image from the specified file path and draws it at the given (x, y) coordinates on the canvas. The image is drawn with its top-left corner at the specified coordinates.",
          page_type: "method"
      })
  console.log(loadImagePage.slug);
  
  const loadImageMethod = await loadImagePage.createMainMethod({
              class_id: classPage.id,
              is_static: true
  });

  await Argument.bulkCreate([
  {
    method_id: loadImageMethod.page_id,
    arg_index: 0,
    name: "x",
    type: "number",
    description: "The x coordinate where the image will be placed"
  },
  {
    method_id: loadImageMethod.page_id,
    arg_index: 1,
    name: "y",
    type: "number",
    description: "The y coordinate where the image will be placed"
  },
  {
    method_id: loadImageMethod.page_id,
    arg_index: 2,
    name: "filepath",
    type: "string",
    description: "Location of the image file to be loaded"
  }
]);



  /*
    shape class
      - strokeWidth property
      - rectangle(x, y, w, h) method
  */

  console.log(classPage.slug + "shape")

  const shapePage = await Page.create({
    name: "shape",
    slug: classPage.slug + "shape",
    short_description: "The shape class contains methods and properties for drawing shapes.",
    long_description: "The shape class contains methods and properties for drawing shapes.",
    page_type: "class"
  });

  await shapePage.createMainClass({
    parent_class_id: classPage.id
  });

  await shapePage.createCodeExample({
    name: "Shape Example",
    public: `// Create a rectangle shape with a stroke width of 5
$.shape.strokeWidth = 5;
$.shape.rectangle(50, 50, 200, 100);`,
    private: `// Private example code can go here`
  });

  console.log(shapePage.slug + "/strokewidth")

  // shape.strokeWidth property
  await Page.create({
    name: "strokeWidth",
    slug: shapePage.slug + "/strokewidth",
    short_description: "Line thickness of shape.",
    long_description: "Controls the width of the stroke of the shape. This essentially controls the thickness of the lines that draw the shape.",
    page_type: "property"
  }).then(pg => pg.createMainProperty({
      class_id: shapePage.id,
      type: "number",
      default_value: "1"
    })
  )

  console.log(classPage.slug + "image")

  await Page.create({
    name: "image",
    slug: classPage.slug + "image",
    short_description: "The image class contains methods and properties for handling images.",
    long_description: "The image class contains methods and properties for handling images.",
    page_type: "class"
  }).then((pg) => pg.createMainClass({ parent_class_id: classPage.id }));


  console.log(shapePage.slug + "/rectangle")
  // shape.rect class
  await Page.create({
      name: "rect",
      slug: shapePage.slug + "/rectangle",
      short_description: "The rect class contains methods and properties for drawing rectangular shapes.",
      long_description: "The rect class contains methods and properties for drawing rectangular shapes.",
      page_type: "class"
  }).then(pg => pg.createMainClass({ parent_class_id: shapePage.id }));


  console.log("✅ Seed complete");
  process.exit();
}

seed();
