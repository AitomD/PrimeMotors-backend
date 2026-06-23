import { Router } from "express";
import prisma from "../config/database";

const router = Router();

// Listar todos
router.get("/list", async (req, res) => {
  try {
    const testDrives = await prisma.testDrive.findMany({
      include: {
        car: {
          include: {
            images: { take: 1 },
            brand: true,
            espec: true,
          },
        },
        user: true,
      },
    });
    res.json(testDrives);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamentos." });
  }
});

// Buscar por usuário
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const testDrives = await prisma.testDrive.findMany({
      where: { userId },
      include: {
        car: {
          include: {
            images: { take: 1 },
            brand: true,
            espec: true,
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
    });
    res.json(testDrives);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar test drives do usuário." });
  }
});

// Criar
router.post("/", async (req, res) => {
  try {
    const { carId, userId, scheduledAt } = req.body;
    const dateFormatted = new Date(scheduledAt);
    const existing = await prisma.testDrive.findFirst({
      where: { carId, userId, scheduledAt: dateFormatted },
    });
    if (existing) {
      return res.status(400).json({ message: "Você já agendou um test drive para este carro neste mesmo horário." });
    }
    const testDrive = await prisma.testDrive.create({
      data: { carId, userId, scheduledAt: dateFormatted },
    });
    res.status(201).json(testDrive);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar agendamento." });
  }
});

// Atualizar data
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledAt } = req.body;
    const updated = await prisma.testDrive.update({
      where: { id },
      data: { scheduledAt: new Date(scheduledAt) },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar agendamento." });
  }
});

// Excluir
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.testDrive.delete({ where: { id } });
    res.json({ message: "Test drive excluído." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir agendamento." });
  }
});

export default router;