import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { retornarTimePorId, timeSchema } from '../utils/utils';
import { ZodError } from 'zod';

const obterTimes = async (_req: Request, res: Response) => {
    try {
        const equipes = await prisma.equipe.findMany();
        res.json(equipes);
    } catch {
        res.status(500).json({erro: 'erro interno no servidor'})
        }
    };


const obterTimePorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const equipe = await retornarTimePorId(Number(id));

        if (equipe === null) {
            res.status(404).json({erro: "Time nao encontrado"});
            return;
        }
        res.json(equipe);
    } catch (error) {
        res.status(500).json({erro: 'Erro interno do servidor'})
    }
    
};



const criarTime = async (req: Request, res: Response) => {
    try {
        const body = timeSchema.parse(req.body);
        const { name, pilotos } = body;

        const timeExiste = await prisma.equipe.findUnique({where: {name: name}});
        if (timeExiste) {
            res.status(409).json({erro: `Equipe ${name} ja existe`});
            return;
        }

        const time = await prisma.equipe.create({
            data: {
                name: name,
                pilotos: {
                    connectOrCreate: pilotos.map(piloto => ({
                        where: { name: piloto.name },   
                        create: { name: piloto.name }
                    }))
                }
            }});

        res.status(201).json({ mensagem: `Time ${time.name} criado com sucesso.` });

    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({erro: error.issues});
            return;
        }

        res.status(500).json({erro: `Erro no servidor`})
    };
};

const editarTime = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const timeNaoExiste = await retornarTimePorId(Number(id)) === null ;

        if (timeNaoExiste) {
            res.status(404).json({erro: `Time id ${id} nao foi encontrado`});
            return;
        }

        const body = timeSchema.parse(req.body);
        const {name, pilotos} = body;

        await prisma.equipe.update({   
        where: {
            id: Number(id)
        },
        data: {
            name: name,
            pilotos: {
                    connectOrCreate: pilotos.map(piloto => ({
                        where: { name: piloto.name },   
                        create: { name: piloto.name }
                    }))
                }
        }
    });

    res.status(200).json({mensagem: 'time atualizado com sucesso'});
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({erro: error.issues});
            return;
        }
        res.status(500).json({erro: 'Erro interno do servidor'});
    }
};

const deletarTime = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const timeNaoExiste = await retornarTimePorId(Number(id)) === null;

        if (timeNaoExiste) {
            res.status(404).json({erro: `Time com id ${id} nao encontrado`});
            return;
        }

        await prisma.equipe.delete({
            where: {
                id : Number(id)
                }
            }
        );
        res.status(200).json({mensagem: 'Time deletado com sucesso'});
    } catch (error) {
        res.status(500).json({erro: 'Erro interno no servidor'});
    }
}

export {
    obterTimes,
    criarTime,
    obterTimePorId,
    editarTime,
    deletarTime
}