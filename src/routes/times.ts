import {Router} from 'express';
import { criarTime, deletarTime, editarTime, obterTimePorId, obterTimes } from '../controllers/times';

const rotasTimes: Router = Router();

rotasTimes.get('/', obterTimes);

rotasTimes.get('/:id', obterTimePorId);

rotasTimes.post('/', criarTime);

rotasTimes.put('/:id', editarTime);

rotasTimes.delete('/:id', deletarTime);

export {
    rotasTimes
};