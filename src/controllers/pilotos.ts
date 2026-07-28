import {Request, Response} from 'express';
import {prisma} from '../lib/prisma';
import { ZodError} from 'zod';
import { retornarTimePorId, pilotoSchema } from '../utils/utils';

const obterPilotos = async (_req: Request, res: Response) => {
    try {
        const pilotos = await prisma.piloto.findMany();
    
        if (pilotos.length === 0) {
            res.status(200).json({mensagem: 'Nao ha nenhum piloto cadastrado'});
            return;
        }
        
        res.status(200).json(pilotos);
    } catch (error) {
        res.status(500).json({erro: 'erro interno no servidor'});
    }
};

const retornarPilotoPorId = async (id: number) => {
    return await prisma.piloto.findUnique({
        where: {
            id: id
        }
    });
};

const obterPilotoPorId =  async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const piloto = await retornarPilotoPorId(Number(id));
        if (piloto === null) {
            res.status(404).json({erro: 'Piloto nao encontrado'});
            return;
        }

        res.status(200).json(piloto);
    } catch (error) {
        res.status(500).json({erro: 'Erro interno do servidor'})
    }
};

const criarPiloto = async (req: Request, res: Response) => {
    
    try {
        const body = pilotoSchema.parse(req.body);
        const {name, equipeId} = body;
        const verificarTime = await retornarTimePorId(equipeId);

        if (verificarTime === null) {
            res.status(404).json({erro: `Nao existe equipe com id ${equipeId}`});
            return;
        }

        const jaExiste = await prisma.piloto.findUnique({
            where : {
                name: name
            }
        })

        if (jaExiste) {
            res.status(409).json({erro: "Ja existe um piloto com esse nome"});
            return;
        }

        const piloto = await prisma.piloto.create({
            data: {
                name: name,
                equipeId: equipeId,
            }
        });
        
        res.status(201).json({mensagem:`Piloto ${piloto.name} criado com sucesso.` })
        }
    catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({erro: error.issues});
            return
        }
        
        res.status(500).json({erro: "erro interno do servidor"});
    }
};

const editarPiloto = async (req: Request, res: Response) => {
    const {id} = req.params;
    
    try {
        const pilotoBuscado = await retornarPilotoPorId(Number(id));
        const body = pilotoSchema.parse(req.body);
        const {name, equipeId} = body;

        if (pilotoBuscado === null) {
            res.status(404).json({erro: `Piloto id ${id} nao encontrado`});
            return;
        }
        
        const pilotoAtualizado = await prisma.piloto.update({
            where: {
                id: Number(id)
            }, data: {
                name: name,
                equipeId: equipeId,
            }
        });

        res.status(200).json({mensagem: `Piloto Id ${id} alterado com sucesso`});

    } catch (error){
        if (error instanceof ZodError) {
            res.status(400).json({erro: error.issues});
            return;
        }
        res.status(500).json({erro: 'Erro interno no servidor'});
    };
};

const deletarPiloto = async (req: Request, res: Response) => {
    const {id} = req.params;
    
    const pilotoNaoExiste = await retornarPilotoPorId(Number(id)) === null;
    if (pilotoNaoExiste) {
        res.status(404).json({erro: `Nao foi encontrado piloto id ${id}`});
        return;
    }

    try {
        await prisma.piloto.delete({
            where: {
                id: Number(id)
            }
        }); 
        res.status(200).json({mensagem: "Piloto deletado com sucesso"})
    } catch (error) {
        res.status(400).json({mensagem: `Nao foi possivel deletar o piloto id ${id}`})
    }
};

export {
    obterPilotos,
    obterPilotoPorId,
    criarPiloto,
    editarPiloto,
    deletarPiloto
};