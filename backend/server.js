// server.js
// import dotenv from "dotenv"
// import App from "./src/app.js"

// dotenv.config()

// const app = new App()
// app.start()


// .env được load trước khi code dùng process.env
import dotenv from "dotenv"
dotenv.config()

import App from "./src/app.js"

const app = new App()
app.start()