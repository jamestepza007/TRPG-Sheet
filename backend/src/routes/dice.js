import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.post('/roll', async (req, res) => {
  const { expression, system, campaignId, sendToDiscord, webhookUrl, result, details, characterName } = req.body;

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

export default router;
