// SSE (Server-Sent Events) manager
// Clients subscribe by partyId, server pushes updates when party data changes

const partyClients = new Map(); // partyId -> Set of res objects

export function addPartyClient(partyId, res) {
  if (!partyClients.has(partyId)) partyClients.set(partyId, new Set());
  partyClients.get(partyId).add(res);
}

export function removePartyClient(partyId, res) {
  partyClients.get(partyId)?.delete(res);
  if (partyClients.get(partyId)?.size === 0) partyClients.delete(partyId);
}

export function pushPartyUpdate(partyId, data) {
  const clients = partyClients.get(partyId);
  if (!clients || clients.size === 0) return;
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(res => {
    try { res.write(payload); } catch {}
  });
}

export function getPartyClientCount(partyId) {
  return partyClients.get(partyId)?.size || 0;
}
