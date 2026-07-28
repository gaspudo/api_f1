import express, {Express} from "express";
import { PORT } from "./secrets";
import { rotaRaiz } from "./routes";


const app: Express = express();



app.use(express.json());

app.use("/", rotaRaiz);

app.listen(PORT, () => {
    console.log(`api rodando na porta ${PORT}`);
});
