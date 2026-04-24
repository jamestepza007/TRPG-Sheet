import express from 'express';
import { pushPartyUpdate } from '../sse.js';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// POST /api/parties/join - Player joins a party via invite code
router.post('/join', async (req, res) => {
  const { inviteCode, characterId } = req.body;
  try {
    const campaign = await prisma.campaign.findUnique({ where: { inviteCode }, include: { party: true } });
    if (!campaign) return res.status(404).json({ error: 'Invalid invite code' });

    const char = await prisma.character.findUnique({ where: { id: characterId } });
    if (!char || char.userId !== req.user.id) return res.status(403).json({ error: 'Character not yours' });
    if (char.system !== campaign.system) return res.status(400).json({ error: 'Character system mismatch' });

    const member = await prisma.partyMember.create({
      data: { partyId: campaign.party.id, userId: req.user.id, characterId }
    });
    res.status(201).json(member);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Already in this party' });
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/parties/:partyId/leave - Player leaves a party
router.delete('/:partyId/leave', async (req, res) => {
  await prisma.partyMember.deleteMany({
    where: { partyId: req.params.partyId, userId: req.user.id }
  });
  res.json({ success: true });
});

// GET /api/parties/mine - Get all parties I'm in
router.get('/mine', async (req, res) => {
  const members = await prisma.partyMember.findMany({
    where: { userId: req.user.id },
    include: {
      party: {
        include: {
          campaign: { include: { gm: { select: { username: true } } } },
          members: { include: { user: { select: { id: true, username: true } }, character: true } }
        }
      },
      character: true
    }
  });
  res.json(members);
});

// DELETE /api/parties/:partyId/members/:userId - GM kicks a player
router.delete('/:partyId/members/:userId', async (req, res) => {
  const party = await prisma.party.findUnique({
    where: { id: req.params.partyId },
    include: { campaign: true }
  });
  if (!party || party.campaign.gmId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  await prisma.partyMember.deleteMany({
    where: { partyId: req.params.partyId, userId: req.params.userId }
  });
  res.json({ success: true });
});


// PUT /api/parties/:id/inventory
router.put('/:id/inventory', async (req, res) => {
  const { inventory } = req.body;
  try {
    const party = await prisma.party.update({
      where: { id: req.params.id },
      data: { inventory: inventory || '' }
    });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// POST /api/parties/:id/bgm-sync — GM pushes BGM to all players
router.post('/:id/bgm-sync', async (req, res) => {
  const { trackId, trackLabel, enabled } = req.body;
  try {
    pushPartyUpdate(req.params.id, {
      type: 'bgm_sync',
      trackId,
      trackLabel,
      enabled,
      gmId: req.user.id,
    });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

export default router;
