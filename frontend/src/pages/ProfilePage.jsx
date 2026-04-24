import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/users/me/profile').then(res => {
      setWebhooks(res.data.discordWebhooks || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const addWebhook = () => setWebhooks(p => [...p, { label: '', url: '' }]);

  const updateWebhook = (i, field, value) => {
    setWebhooks(p => p.map((w, idx) => idx === i ? { ...w, [field]: value } : w));
  };

  const removeWebhook = (i) => setWebhooks(p => p.filter((_, idx) => idx !== i));

  const save = async () => {
    // Validate
    for (const w of webhooks) {
      if (!w.label.trim()) return toast.error('Each webhook needs a label');
      if (!w.url.trim().startsWith('https://discord.com/api/webhooks/')) return toast.error(`"${w.label}" has invalid Discord webhook URL`);
    }
    setSaving(true);
    try {
      await api.put('/users/me/webhooks', { discordWebhooks: webhooks });
      toast.success('Webhooks saved!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const acc = '#c9a84c';

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 26, color: acc }}>⚙ Profile</h1>
        <p style={{ color: '#555', marginTop: 4 }}>Manage your Discord webhook channels</p>
      </div>

      <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, padding: 24 }}>
        <div className="section-title" style={{ color: acc }}>🔔 Discord Webhooks</div>
        <p style={{ color: '#555', fontSize: 13, marginBottom: 20 }}>
          Add webhooks for each Discord channel you want to receive dice rolls.
          Get the URL from Discord channel settings → Integrations → Webhooks.
        </p>

        {loading ? (
          <div style={{ color: '#444', fontFamily: 'Cinzel, serif', textAlign: 'center', padding: 24 }}>Loading…</div>
        ) : (
          <>
            {webhooks.length === 0 && (
              <div style={{ color: '#444', fontSize: 14, textAlign: 'center', padding: '20px 0', fontFamily: 'Cinzel, serif' }}>
                No webhooks yet. Add one below!
              </div>
            )}

            {webhooks.map((w, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 36px', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                <input
                  value={w.label}
                  onChange={e => updateWebhook(i, 'label', e.target.value)}
                  placeholder="Channel name"
                  style={{ fontSize: 14 }}
                />
                <input
                  value={w.url}
                  onChange={e => updateWebhook(i, 'url', e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  style={{ fontSize: 13, fontFamily: 'Share Tech Mono, monospace' }}
                />
                <button onClick={() => removeWebhook(i)}
                  style={{ background: '#1a1a1a', border: '1px solid #3a0000', color: '#f87171', borderRadius: 6, width: 36, height: 36, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={addWebhook}
                style={{ background: '#1a1a1a', border: `1px solid ${acc}44`, color: acc, borderRadius: 6, padding: '8px 18px', fontFamily: 'Cinzel, serif', fontSize: 13, cursor: 'pointer', letterSpacing: '0.08em' }}>
                + Add Webhook
              </button>
              <button onClick={save} disabled={saving}
                style={{ background: acc, color: '#000', border: 'none', borderRadius: 6, padding: '8px 24px', fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.08em', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : '✓ Save'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
