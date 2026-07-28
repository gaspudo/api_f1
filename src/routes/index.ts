import { Router } from "express";
import { rotasTimes } from "./times";
import { rotasPilotos } from "./pilotos";

const rotaRaiz: Router = Router();

rotaRaiz.use('/times', rotasTimes);
rotaRaiz.use('/pilotos', rotasPilotos);

export {
    rotaRaiz
}