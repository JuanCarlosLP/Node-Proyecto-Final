import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.NODE_PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
})