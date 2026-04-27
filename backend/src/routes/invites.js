import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// ── Admin: list all invite codes ──────────────────────────────────
router.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const codes = await prisma.inviteCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(codes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Admin: create invite code ─────────────────────────────────────
router.post('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  const { maxUses = 1, note, expiresAt } = req.body;
  try {
    const code = crypto.randomBytes(6).toString('hex').toUpperCase(); // e.g. A3F9C2
    const invite = await prisma.inviteCode.create({
      data: {
        code,
        maxUses: parseInt(maxUses),
        note: note || null,
        createdBy: req.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });
    res.status(201).json(invite);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Admin: delete invite code ─────────────────────────────────────
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res) => {
  await prisma.inviteCode.delete({ where: { id: req.params.id } }).catch(() => {});
  res.json({ success: true });
});

// ── Public: validate invite code (before register) ───────────────
router.get('/validate/:code', async (req, res) => {
  try {
    const invite = await prisma.inviteCode.findUnique({
      where: { code: req.params.code.toUpperCase() }
    });
    if (!invite) return res.status(404).json({ error: 'Invalid invite code' });
    if (invite.usedCount >= invite.maxUses) return res.status(410).json({ error: 'Invite code is full' });
    if (invite.expiresAt && new Date() > invite.expiresAt) return res.status(410).json({ error: 'Invite code expired' });
    res.json({ valid: true, remaining: invite.maxUses - invite.usedCount, note: invite.note });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
