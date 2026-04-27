import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  const { password, ...user } = req.user;
  res.json(user);
});

// GET /api/auth/invite-validate/:code — public
router.get('/invite-validate/:code', async (req, res) => {
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

// POST /api/auth/register — requires valid invite code
router.post('/register', async (req, res) => {
  const { username, password, inviteCode } = req.body;
  if (!username || !password || !inviteCode) {
    return res.status(400).json({ error: 'username, password and inviteCode are required' });
  }
  try {
    // Validate invite code
    const invite = await prisma.inviteCode.findUnique({
      where: { code: inviteCode.toUpperCase() }
    });
    if (!invite) return res.status(400).json({ error: 'Invalid invite code' });
    if (invite.usedCount >= invite.maxUses) return res.status(400).json({ error: 'Invite code is full' });
    if (invite.expiresAt && new Date() > invite.expiresAt) return res.status(400).json({ error: 'Invite code expired' });

    // Create user
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        role: 'PLAYER',
        email: username.toLowerCase().replace(/\s/g, '_') + '@local',
      },
      select: { id: true, username: true, role: true }
    });

    // Increment invite usage
    await prisma.inviteCode.update({
      where: { id: invite.id },
      data: { usedCount: invite.usedCount + 1 }
    });

    // Return token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Username already taken' });
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
