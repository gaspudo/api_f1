import dotenv from "dotenv";

dotenv.config({path:'.env'});

const PORT = process.env.PORT;
const DATABASE_URL = process.env.API_URL;

export {
    PORT,
    DATABASE_URL
}