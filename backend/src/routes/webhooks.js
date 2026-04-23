import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// GET /api/webhooks - All users: get global webhooks
router.get('/', async (req, res) => {
  try {
    const webhooks = await prisma.globalWebhook.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, label: true, url: true }
    });
    res.json(webhooks);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// POST /api/webhooks - Admin only: add global webhook
router.post('/', requireRole('ADMIN'), async (req, res) => {
  const { label, url } = req.body;
  if (!label || !url) return res.status(400).json({ error: 'label and url required' });
  try {
    const wh = await prisma.globalWebhook.create({
      data: { label, url, createdBy: req.user.id }
    });
    res.status(201).json(wh);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// DELETE /api/webhooks/:id - Admin only
router.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  await prisma.globalWebhook.delete({ where: { id: req.params.id } }).catch(() => {});
  res.json({ success: true });
});

export default router;
