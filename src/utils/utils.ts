import {prisma} from '../lib/prisma'
import {z} from 'zod';

const retornarTimePorId = async (id: number) => {
    return await prisma.equipe.findUnique({
        where: {
            id: id
        }
    });
};

const pilotoSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório'),
    equipeId: z.number().int().positive('O id da equipe é obrigatorio')
});

const pilotoSchemaEquipe = z.object({
    name: z.string().min(1, 'O nome é obrigatório'),
});

const timeSchema = z.object({
    name: z.string().min(1, "O nome é obrigatorio"),
    pilotos: z.array(pilotoSchemaEquipe).optional().default([])
});

export {
    retornarTimePorId,
    pilotoSchema,
    timeSchema
}