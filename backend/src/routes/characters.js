import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// GET /api/characters - Get my characters
router.get('/', async (req, res) => {
  const characters = await prisma.character.findMany({ where: { userId: req.user.id } });
  res.json(characters);
});

// GET /api/characters/:id
router.get('/:id', async (req, res) => {
  const char = await prisma.character.findUnique({ where: { id: req.params.id } });
  if (!char) return res.status(404).json({ error: 'Not found' });
  if (char.userId !== req.user.id && req.user.role === 'PLAYER') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(char);
});

// POST /api/characters
router.post('/', async (req, res) => {
  const { name, system, sheetData } = req.body;
  const char = await prisma.character.create({
    data: { name, system, sheetData, userId: req.user.id }
  });
  res.status(201).json(char);
});

// PUT /api/characters/:id
router.put('/:id', async (req, res) => {
  const { name, sheetData } = req.body;
  const char = await prisma.character.findUnique({ where: { id: req.params.id } });
  if (!char || char.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const updated = await prisma.character.update({
    where: { id: req.params.id },
    data: { name, sheetData }
  });
  res.json(updated);
});

// DELETE /api/characters/:id
router.delete('/:id', async (req, res) => {
  const char = await prisma.character.findUnique({ where: { id: req.params.id } });
  if (!char || char.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  await prisma.character.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
