import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./App.js";

dotenv.config({
    path: "./env",
});
let PORT = process.env.PORT || 8000;
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server is running on PORT http://localhost:", PORT);
        });
    })
    .catch((err) => {
        console.log("Database connsction error", err);
    });
