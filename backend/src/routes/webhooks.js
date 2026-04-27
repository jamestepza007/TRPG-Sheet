import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// GET /api/webhooks - Users get only webhooks they have access to
router.get('/', async (req, res) => {
  try {
    const all = await prisma.globalWebhook.findMany({ orderBy: { createdAt: 'asc' } });
    const isAdmin = req.user.role === 'ADMIN';
    // Admin sees all; others see only where allowedUsers is null OR includes their id
    const visible = isAdmin ? all : all.filter(w => {
      if (!w.allowedUsers) return true; // null = open to all
      const list = Array.isArray(w.allowedUsers) ? w.allowedUsers : [];
      return list.includes(req.user.id);
    });
    res.json(visible.map(w => ({
      id: w.id, label: w.label, url: w.url,
      allowedUsers: isAdmin ? (w.allowedUsers || null) : undefined
    })));
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

// PUT /api/webhooks/:id/permissions - Admin: set allowed users
router.put('/:id/permissions', requireRole('ADMIN'), async (req, res) => {
  const { allowedUsers } = req.body; // null = all, [] = none, [userId, ...] = specific
  try {
    const wh = await prisma.globalWebhook.update({
      where: { id: req.params.id },
      data: { allowedUsers: allowedUsers === null ? null : (Array.isArray(allowedUsers) ? allowedUsers : null) }
    });
    res.json(wh);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// DELETE /api/webhooks/:id - Admin only
router.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  await prisma.globalWebhook.delete({ where: { id: req.params.id } }).catch(() => {});
  res.json({ success: true });
});

export default router;
