const path = require("path"); // INITIALISERA path FÖRST
const fs = require("fs");
const mongoose = require("mongoose");
// Ladda miljövariabler från .env-filen i projektets rotmapp
const envFilePath = path.resolve(__dirname, "../.env"); // NU KAN path ANVÄNDAS HÄR
require("dotenv").config({ path: envFilePath });

const Product = require("./models/Product"); // Product-modell

if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in your .env file.");
  process.exit(1);
}

const productsFilePath = path.join(__dirname, "data", "db.json");

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    await Product.deleteMany({});
    console.log("Existing products collection cleared.");

    const jsonData = fs.readFileSync(productsFilePath, "utf-8");
    const fullDataObject = JSON.parse(jsonData);

    if (!fullDataObject.menuItems || !Array.isArray(fullDataObject.menuItems)) {
      console.error(
        'Error: "menuItems" array not found or is not an array in db.json.'
      );
      mongoose.disconnect();
      process.exit(1);
    }

    const productsToSeed = fullDataObject.menuItems.map((item) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.Category,
      imageUrl: item.image,
    }));

    if (productsToSeed.length === 0) {
      console.log("No products to seed after mapping.");
      mongoose.disconnect();
      process.exit(0);
    }

    await Product.insertMany(productsToSeed);
    console.log(
      `${productsToSeed.length} products have been imported successfully!`
    );
  } catch (error) {
    console.error("Error during seeding process:", error);
    if (error.name === "ValidationError") {
      for (let field in error.errors) {
        console.error(
          `Validation error for ${field}: ${error.errors[field].message}`
        );
      }
    }
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

seedDB();
