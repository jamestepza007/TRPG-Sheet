import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { pushPartyUpdate } from '../sse.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async (req, res) => {
  const characters = await prisma.character.findMany({ where: { userId: req.user.id } });
  res.json(characters);
});

router.get('/:id', async (req, res) => {
  const char = await prisma.character.findUnique({ where: { id: req.params.id } });
  if (!char) return res.status(404).json({ error: 'Not found' });
  if (char.userId !== req.user.id && req.user.role === 'PLAYER')
    return res.status(403).json({ error: 'Forbidden' });
  res.json(char);
});

router.post('/', async (req, res) => {
  const { name, system, sheetData } = req.body;
  const char = await prisma.character.create({
    data: { name, system, sheetData, userId: req.user.id }
  });
  res.status(201).json(char);
});

router.put('/:id', async (req, res) => {
  const { name, sheetData } = req.body;
  const char = await prisma.character.findUnique({ where: { id: req.params.id } });
  if (!char) return res.status(404).json({ error: 'Not found' });
  const isOwner = char.userId === req.user.id;
  const isAdmin = req.user.role === 'ADMIN';
  // GM can edit if character is in a party in one of their campaigns
  let isGM = false;
  if (req.user.role === 'GM' && !isOwner) {
    const pm = await prisma.partyMember.findUnique({
      where: { characterId: char.id },
      include: { party: { include: { campaign: true } } }
    });
    isGM = pm?.party?.campaign?.gmId === req.user.id;
  }
  if (!isOwner && !isAdmin && !isGM) return res.status(403).json({ error: 'Forbidden' });

  const updated = await prisma.character.update({
    where: { id: req.params.id },
    data: { ...(name !== undefined && { name }), ...(sheetData !== undefined && { sheetData }) }
  });

  // ── Push SSE update to party watchers ──
  // Find if this character is in a party
  const partyMember = await prisma.partyMember.findUnique({
    where: { characterId: req.params.id },
    include: { party: true }
  });
  if (partyMember) {
    pushPartyUpdate(partyMember.partyId, {
      type: 'character_updated',
      characterId: req.params.id,
      userId: req.user.id,
      sheetData,
      name,
      updatedAt: new Date().toISOString(),
    });
  }

  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const char = await prisma.character.findUnique({ where: { id: req.params.id } });
  if (!char || char.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  await prisma.character.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
