import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/bgm — all users can fetch tracks
router.get('/', authenticate, async (req, res) => {
  try {
    const tracks = await prisma.bgmTrack.findMany({ orderBy: { order: 'asc' } });
    res.json(tracks);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// POST /api/bgm — admin only
router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { label, youtubeId } = req.body;
  if (!label || !youtubeId) return res.status(400).json({ error: 'label and youtubeId required' });
  try {
    const count = await prisma.bgmTrack.count();
    const track = await prisma.bgmTrack.create({ data: { label, youtubeId, order: count } });
    res.status(201).json(track);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// PUT /api/bgm/:id — admin only
router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { label, youtubeId } = req.body;
  try {
    const track = await prisma.bgmTrack.update({
      where: { id: req.params.id },
      data: { ...(label && { label }), ...(youtubeId && { youtubeId }) }
    });
    res.json(track);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// DELETE /api/bgm/:id — admin only
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  await prisma.bgmTrack.delete({ where: { id: req.params.id } }).catch(() => {});
  res.json({ success: true });
});

export default router;
