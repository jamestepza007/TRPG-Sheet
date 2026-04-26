import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/roll', authenticate, async (req, res) => {
  const { expression, system, campaignId, sendToDiscord, webhookUrl, result, details, characterName, min, max } = req.body;

  if (!expression || result === undefined) {
    return res.status(400).json({ error: 'expression and result are required' });
  }

  try {
    const log = await prisma.diceLog.create({
      data: {
        userId: req.user.id,
        campaignId: campaignId || null,
        system: system || 'DUNGEON_WORLD',
        expression,
        result: parseInt(result),
        details: details || {},
        characterName: characterName || null,
        min: min !== undefined ? parseInt(min) : null,
        max: max !== undefined ? parseInt(max) : null,
        sentToDiscord: false,
      }
    });

    if (sendToDiscord && webhookUrl) {
      const displayName = characterName || req.user.username;
      const breakdown = Array.isArray(details)
        ? details.map(g => `[${g.rolls?.join(', ')}]`).join(' + ')
        : String(result);

      const dwResult = system === 'DUNGEON_WORLD'
        ? (result >= 10 ? '✅ 10+ Strong Hit' : result >= 7 ? '⚠️ 7-9 Partial Hit' : '❌ 6- Miss')
        : null;

      const embed = {
        embeds: [{
          color: 0x8B4513,
          title: `⚔️ ${displayName} rolled \`${expression}\``,
          description: `**${result}**\n${breakdown}${dwResult ? `\n${dwResult}` : ''}`,
          footer: { text: (system || 'DUNGEON_WORLD').replace(/_/g, ' ') },
          timestamp: new Date().toISOString(),
        }]
      };

      try {
        const discordRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(embed),
        });
        if (discordRes.ok) {
          await prisma.diceLog.update({ where: { id: log.id }, data: { sentToDiscord: true } });
        }
      } catch {}
    }

    res.json({ success: true, logId: log.id, result });
  } catch (err) {
    console.error('Dice roll error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const logs = await prisma.diceLog.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/dice/recent?since=timestamp
// Public-ish endpoint for Owlbear Extension to poll
// Returns rolls newer than ?since (unix ms)
// /recent is public — no auth needed for Owlbear extension
router.get('/recent', async (req, res) => {
  try {
    const since = parseInt(req.query.since) || (Date.now() - 10000);
    const sinceDate = new Date(since);
    const campaignFilter = req.query.campaignId ? { campaignId: req.query.campaignId } : {};
    const rolls = await prisma.diceLog.findMany({
      where: { createdAt: { gt: sinceDate }, ...campaignFilter },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });
    // Fetch usernames separately
    const userIds = [...new Set(rolls.map(r => r.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true }
    });
    const userMap = Object.fromEntries(users.map(u => [u.id, u.username]));
    res.json(rolls.map(r => ({
      id: r.id,
      result: r.result,
      expression: r.expression,
      system: r.system,
      characterName: r.characterName,
      username: userMap[r.userId] || null,
      min: r.min,
      max: r.max,
      details: r.details,
      timestamp: r.createdAt.getTime(),
    })));
  } catch (err) {
    console.error('dice/recent error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

