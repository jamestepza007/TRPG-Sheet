import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { addPartyClient, removePartyClient } from '../sse.js';

const router = express.Router();
const prisma = new PrismaClient();

// SSE uses token via query param (EventSource can't set headers)
async function authFromQuery(req) {
  const token = req.query.token || req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch { return null; }
}

// GET /api/sse/party/:partyId?token=xxx
router.get('/party/:partyId', async (req, res) => {
  const user = await authFromQuery(req);
  if (!user) return res.status(401).send('Unauthorized');

  const { partyId } = req.params;

  // Verify access
  const [member, party] = await Promise.all([
    prisma.partyMember.findFirst({ where: { partyId, userId: user.id } }),
    prisma.party.findUnique({ where: { id: partyId }, include: { campaign: true } })
  ]);
  const isGM = party?.campaign?.gmId === user.id;
  if (!member && !isGM && user.role !== 'ADMIN') return res.status(403).send('Forbidden');

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Initial ping
  res.write(`data: ${JSON.stringify({ type: 'connected', partyId })}\n\n`);

  addPartyClient(partyId, res);

  // Heartbeat every 20s
  const hb = setInterval(() => {
    try { res.write(': ping\n\n'); }
    catch { cleanup(); }
  }, 20000);

  const cleanup = () => {
    clearInterval(hb);
    removePartyClient(partyId, res);
    try { res.end(); } catch {}
  };

  req.on('close', cleanup);
  req.on('aborted', cleanup);
  res.on('error', cleanup);
});

export default router;
