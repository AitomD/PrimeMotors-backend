import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createUserService = async (data:any) => {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(data.password,saltRounds) 

    const existingUser = await prisma.user.findUnique({where:{email: data.email}});
    if(existingUser) {
        throw new Error ('E-mail já cadastrado!');
    }

    return await prisma.user.create({
        data:{
            name: data.name,
            email: data.email,
            cpf: data.cpf,
            password: hashedPassword,
            address: data.address,
            active: data.active
        }
    })
}
 





















