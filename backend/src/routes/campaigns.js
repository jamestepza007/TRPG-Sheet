import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// GET /api/campaigns
router.get('/', async (req, res) => {
  const where = { gmId: req.user.id }; // each user sees only their own campaigns
  const campaigns = await prisma.campaign.findMany({
    where,
    include: { party: { include: { members: { include: { user: { select: { id: true, username: true } }, character: true } } } } }
  });
  res.json(campaigns);
});

// GET /api/campaigns/:id
router.get('/:id', async (req, res) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.id },
    include: {
      party: { include: { members: { include: { user: { select: { id: true, username: true } }, character: true } } } },
      gm: { select: { id: true, username: true } }
    }
  });
  if (!campaign) return res.status(404).json({ error: 'Not found' });
  res.json(campaign);
});

// POST /api/campaigns - GM only
router.post('/', requireRole('GM', 'ADMIN'), async (req, res) => {
  const { name, description, system } = req.body;
  const campaign = await prisma.campaign.create({
    data: { name, description, system, gmId: req.user.id, party: { create: {} } },
    include: { party: true }
  });
  res.status(201).json(campaign);
});

// PUT /api/campaigns/:id - update name/description/coverImage
router.put('/:id', requireRole('GM', 'ADMIN'), async (req, res) => {
  const { name, description, coverImage, gmSheetData } = req.body;
  const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id } });
  if (!campaign || (campaign.gmId !== req.user.id && req.user.role !== 'ADMIN'))
    return res.status(403).json({ error: 'Forbidden' });
  const updated = await prisma.campaign.update({
    where: { id: req.params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(coverImage !== undefined && { coverImage }),
      ...(gmSheetData !== undefined && { gmSheetData }),
    }
  });
  res.json(updated);
});

// DELETE /api/campaigns/:id
router.delete('/:id', requireRole('GM', 'ADMIN'), async (req, res) => {
  const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id } });
  if (!campaign || (campaign.gmId !== req.user.id && req.user.role !== 'ADMIN'))
    return res.status(403).json({ error: 'Forbidden' });
  await prisma.campaign.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// GET /api/campaigns/join/:inviteCode
router.get('/join/:inviteCode', async (req, res) => {
  const campaign = await prisma.campaign.findUnique({
    where: { inviteCode: req.params.inviteCode },
    select: { id: true, name: true, system: true, coverImage: true, gm: { select: { username: true } } }
  });
  if (!campaign) return res.status(404).json({ error: 'Invalid invite code' });
  res.json(campaign);
});

export default router;
