// importCSV.js
import fs from "fs"
import csv from "csv-parser"
import mongoose from "mongoose"
import Product from "./src/models/Product.js"
import dotenv from "dotenv"

dotenv.config()

const toNumber = (val) => val ? Number(val) : undefined

const runImport = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected")

    const results = []

    fs.createReadStream("products.csv")
      .pipe(
        csv({
          mapHeaders: ({ header }) =>
            header.trim().toLowerCase().replace(/\s+/g, "_")
        })
      )
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const formatted = results.map(item => ({
            product_name: item.product_name,
            brand: item.brand,
            price: toNumber(item.price),
            ram: toNumber(item.ram),
            storage: toNumber(item.storage),
            screen_size: toNumber(item.screen_size),
            resolution: item.resolution,
            chipset: item.chipset,
            os: item.os,
            rear_camera: item.rear_camera,
            front_camera: item.front_camera,
            battery: toNumber(item.battery),
            dimensions: item.dimensions,
            weight: toNumber(item.weight),
            rating_value: toNumber(item.rating_value),
            rating_count: toNumber(item.rating_count),
            image_url: item.image_url
          }))

          await Product.insertMany(formatted)
          console.log("Import thành công")
          process.exit()
        } catch (error) {
          console.error("Insert error:", error)
          process.exit(1)
        }
      })

  } catch (error) {
    console.error("MongoDB error:", error)
    process.exit(1)
  }
}

runImport()