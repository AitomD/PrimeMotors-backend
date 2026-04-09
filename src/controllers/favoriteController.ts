// src/controllers/FavoriteController.ts
import { Request, Response } from 'express';
import prisma  from '../config/database';

export const toggleFavorite = async (req: Request, res: Response) => {
  const { carId, userId } = req.body;

  try {
    // 1. Verifica se já existe o favorito
    const existingFavorite = await prisma.favorite.findFirst({
      where: { 
        carId: String(carId), 
        userId: String(userId) 
      }
    });

    // 2. Se existir, remove (Unfavorite)
    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      return res.status(200).json({ favorited: false });
    }

    // 3. Se não existir, cria (Favorite)
    await prisma.favorite.create({
      data: { 
        carId: String(carId), 
        userId: String(userId) 
      }
    });

    return res.status(201).json({ favorited: true });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao processar favorito" });
  }
};