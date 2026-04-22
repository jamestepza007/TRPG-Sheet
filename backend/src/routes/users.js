import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// GET /api/users - Admin: list all users
router.get('/', requireRole('ADMIN'), async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true, createdAt: true }
  });
  res.json(users);
});

// GET /api/users/me/profile - own profile with webhooks
router.get('/me/profile', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, username: true, email: true, role: true, discordWebhook: true, discordWebhooks: true }
  });
  res.json(user);
});

// PUT /api/users/me/webhooks - save multiple webhooks [{label,url}]
router.put('/me/webhooks', async (req, res) => {
  const { discordWebhooks } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { discordWebhooks },
      select: { id: true, discordWebhooks: true }
    });
    res.json(user);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// POST /api/users - Admin: create user
router.post('/', requireRole('ADMIN'), async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashed, role: role || 'PLAYER' },
      select: { id: true, username: true, email: true, role: true, createdAt: true }
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Username or email already exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/:id - Admin: update user
router.put('/:id', requireRole('ADMIN'), async (req, res) => {
  const { username, email, password, role } = req.body;
  const data = { username, email, role };
  if (password) data.password = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, username: true, email: true, role: true }
    });
    res.json(user);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// DELETE /api/users/:id - Admin: delete user
router.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
