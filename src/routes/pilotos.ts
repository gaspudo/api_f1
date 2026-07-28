import {Router} from 'express';
import {obterPilotos, obterPilotoPorId, criarPiloto, editarPiloto, deletarPiloto} from '../controllers/pilotos';

const rotasPilotos: Router = Router();

rotasPilotos.get('/', obterPilotos);

rotasPilotos.get('/:id', obterPilotoPorId);

rotasPilotos.post('/', criarPiloto);

rotasPilotos.put('/:id', editarPiloto);

rotasPilotos.delete('/:id', deletarPiloto);

export {
    rotasPilotos
};