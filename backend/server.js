// server.js
import dotenv from "dotenv"
import App from "./src/app.js"

dotenv.config()

const app = new App()
app.start()