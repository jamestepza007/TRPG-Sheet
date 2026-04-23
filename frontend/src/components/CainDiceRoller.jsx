import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../utils/api.js';
import { useAuthStore } from '../hooks/useAuth.js';
import toast from 'react-hot-toast';

const C = {
  bg: '#f2ede3', dark: '#1a1a1a', mid: '#444', muted: '#888',
  border: '#999', borderDark: '#444', red: '#8b0000',
  font: "'Courier New', monospace", fontSans: "'Arial Narrow', Arial, sans-serif",
};

function playTickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * Math.exp(-i/(ctx.sampleRate*0.008));
    const src = ctx.createBufferSource(), g = ctx.createGain();
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200;
    src.buffer = buf; src.connect(f); f.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04);
    src.start(ctx.currentTime);
  } catch {}
}

function rollD6Pool(count) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
}

export default function CainDiceRoller({ sheet, system, characterName }) {
  const { user } = useAuthStore();
  const [baseDice, setBaseDice] = useState(1);
  const [bonusDice, setBonusDice] = useState(0);
  const [mode, setMode] = useState('normal'); // normal | risky | hard
  const [result, setResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [sendToDiscord, setSendToDiscord] = useState(false);
  const [globalWebhooks, setGlobalWebhooks] = useState([]);
  const [selectedWebhook, setSelectedWebhook] = useState('');

  useEffect(() => {
    api.get('/users/me/profile').then(r => {
      const whs = r.data.discordWebhooks || [];
      setGlobalWebhooks(whs);
      if (whs.length > 0) setSelectedWebhook(whs[0].url);
    }).catch(() => {});
  }, []);

  const skills = [
    'FORCE','CONDITIONING','COORDINATION','COVERT',
    'INTERFACING','INVESTIGATION','SURVEILLANCE',
    'NEGOTIATION','AUTHORITY','CONNECTION',
  ];

  const getSkillDice = () => {
    if (!selectedSkill || !sheet) return 0;
    return sheet[selectedSkill] || 0;
  };

  const totalDice = Math.min(baseDice + getSkillDice() + bonusDice, baseDice + 3); // max +3 bonus

  const roll = useCallback(async () => {
    if (totalDice < 1) return toast.error('Need at least 1 die');
    setRolling(true);
    playTickSound();

    const pool = rollD6Pool(totalDice);
    let riskDie = null;

    // Risky: admin rolls 1 extra die — simulate with worst die
    if (mode === 'risky') riskDie = Math.floor(Math.random() * 6) + 1;

    // Count successes
    const threshold = mode === 'hard' ? 6 : 4;
    const successes = pool.filter(d => d >= threshold).length;

    const res = {
      pool, riskDie, successes, threshold, mode,
      totalDice, skillDice: getSkillDice(), bonusDice,
    };

    setResult(res);
    setRolling(false);

    // Discord
    if (sendToDiscord && selectedWebhook) {
      const poolDisplay = pool.map(d => d >= threshold ? `**${d}**` : d).join(', ');
      const successLabel = successes >= 1
        ? `✅ ${successes} SUCCESS${successes > 1 ? 'ES' : ''}`
        : '❌ NO SUCCESSES — Divine Agony';
      const embed = {
        embeds: [{
          color: successes >= 1 ? 0x2a5a2a : 0x8b0000,
          title: `🎲 ${characterName || user?.username} rolled ${totalDice}D6${mode !== 'normal' ? ` (${mode.toUpperCase()})` : ''}`,
          description: `[${poolDisplay}]${riskDie ? `\nRisk die: ${riskDie === 1 ? '**1 ⚠️**' : riskDie}` : ''}\n\n${successLabel}`,
          footer: { text: 'CAIN — 4+ = SUCCESS' },
          timestamp: new Date().toISOString(),
        }]
      };
      fetch(selectedWebhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(embed) }).catch(() => {});
    }
  }, [totalDice, mode, selectedSkill, bonusDice, sendToDiscord, selectedWebhook, sheet, user, characterName]);

  const getDieColor = (val) => {
    if (result?.mode === 'hard') return val === 6 ? C.dark : '#ccc';
    return val >= 4 ? C.dark : '#ccc';
  };

  return (
    <div style={{ fontFamily: C.font, color: C.dark }}>
      <div style={{ fontFamily: C.fontSans, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 12, borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>
        ◈ DICE ROLLER — ACTION ASSESSMENT
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Left: configuration */}
        <div>
          {/* Base dice */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: C.mid, marginBottom: 6 }}>BASE DICE:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setBaseDice(Math.max(1, baseDice - 1))}
                style={{ width: 28, height: 28, border: `1px solid ${C.borderDark}`, background: 'transparent', fontFamily: C.font, fontSize: 16, cursor: 'pointer' }}>−</button>
              <div style={{ fontFamily: C.fontSans, fontSize: 28, fontWeight: 900, minWidth: 32, textAlign: 'center' }}>{baseDice}</div>
              <button onClick={() => setBaseDice(baseDice + 1)}
                style={{ width: 28, height: 28, border: `1px solid ${C.borderDark}`, background: 'transparent', fontFamily: C.font, fontSize: 16, cursor: 'pointer' }}>+</button>
            </div>
          </div>

          {/* Skill */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: C.mid, marginBottom: 6 }}>SKILL (+dice):</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <button onClick={() => setSelectedSkill('')}
                style={{ padding: '3px 8px', border: `1px solid ${C.borderDark}`, background: selectedSkill === '' ? C.dark : 'transparent', color: selectedSkill === '' ? C.bg : C.mid, fontFamily: C.font, fontSize: 9, cursor: 'pointer', letterSpacing: '0.05em' }}>
                NONE
              </button>
              {skills.map(s => (
                <button key={s} onClick={() => setSelectedSkill(s)}
                  style={{ padding: '3px 8px', border: `1px solid ${C.borderDark}`, background: selectedSkill === s ? C.dark : 'transparent', color: selectedSkill === s ? C.bg : C.mid, fontFamily: C.font, fontSize: 9, cursor: 'pointer', letterSpacing: '0.05em' }}>
                  {s.slice(0,4)} +{sheet?.[s] || 0}
                </button>
              ))}
            </div>
          </div>

          {/* Bonus dice */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: C.mid, marginBottom: 6 }}>BONUS DICE (max +3):</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[-1, 0, 1, 2, 3].map(n => (
                <button key={n} onClick={() => setBonusDice(n)}
                  style={{ flex: 1, padding: '4px 0', border: `1px solid ${C.borderDark}`, background: bonusDice === n ? C.dark : 'transparent', color: bonusDice === n ? C.bg : C.dark, fontFamily: C.font, fontSize: 10, cursor: 'pointer' }}>
                  {n >= 0 ? '+' : ''}{n}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: C.mid, marginBottom: 6 }}>MODE:</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['normal', 'risky', 'hard'].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  style={{ flex: 1, padding: '6px 4px', border: `1px solid ${C.borderDark}`, background: mode === m ? C.dark : 'transparent', color: mode === m ? C.bg : C.dark, fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' }}>
                  {m}
                </button>
              ))}
            </div>
            {mode === 'risky' && <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginTop: 4 }}>Admin rolls risk die. On 1: bad thing happens.</div>}
            {mode === 'hard' && <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginTop: 4 }}>Successes only on 6.</div>}
          </div>
        </div>

        {/* Roll row: dice count + button inline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          <div style={{ textAlign: 'center', minWidth: 60 }}>
            <div style={{ fontFamily: C.fontSans, fontSize: 8, color: C.muted, letterSpacing: '0.1em' }}>ROLLING</div>
            <div style={{ fontFamily: C.fontSans, fontSize: 40, fontWeight: 900, color: C.dark, lineHeight: 1 }}>{totalDice}</div>
            <div style={{ fontFamily: C.fontSans, fontSize: 9, color: C.mid, letterSpacing: '0.15em' }}>D6</div>
          </div>

          <button onClick={roll} disabled={rolling}
            style={{ flex: 1, background: C.dark, color: C.bg, border: 'none', fontFamily: C.fontSans, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', padding: '12px', cursor: 'pointer', opacity: rolling ? 0.6 : 1 }}>
            ROLL
          </button>

          {/* Discord */}
          <div style={{ border: `1px solid ${C.border}`, padding: 8, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: sendToDiscord ? 6 : 0 }}>
              <div onClick={() => setSendToDiscord(p => !p)}
                style={{ width: 30, height: 16, border: `1px solid ${C.borderDark}`, background: sendToDiscord ? C.dark : 'transparent', cursor: 'pointer', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 2, left: sendToDiscord ? 15 : 2, width: 10, height: 10, background: sendToDiscord ? C.bg : C.mid, transition: 'left 0.2s' }} />
              </div>
              <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: C.mid }}>SEND TO DISCORD</div>
            </div>
            {sendToDiscord && (
              globalWebhooks.length === 0
                ? <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted }}>No webhooks. Ask Admin.</div>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                    {globalWebhooks.map((w, i) => (
                      <button key={i} onClick={() => setSelectedWebhook(w.url)}
                        style={{ padding: '4px 8px', border: `1px solid ${C.borderDark}`, background: selectedWebhook === w.url ? C.dark : 'transparent', color: selectedWebhook === w.url ? C.bg : C.dark, fontFamily: C.font, fontSize: 9, cursor: 'pointer', textAlign: 'left', letterSpacing: '0.05em' }}>
                        {selectedWebhook === w.url ? '▶ ' : '  '}{w.label}
                      </button>
                    ))}
                  </div>
            )}
          </div>
        </div>

        {/* Result */}
        <div>
          {result && (
            <div style={{ border: `2px solid ${result.successes >= 1 ? C.dark : C.red}`, padding: 12 }}>
              {/* Success count */}
              <div style={{ textAlign: 'center', marginBottom: 10, borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 36, fontWeight: 900, color: result.successes >= 1 ? C.dark : C.red, lineHeight: 1 }}>
                  {result.successes}
                </div>
                <div style={{ fontFamily: C.fontSans, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: result.successes >= 1 ? C.dark : C.red }}>
                  {result.successes === 0 ? 'NO SUCCESSES' : result.successes === 1 ? 'SUCCESS' : 'SUCCESSES'}
                </div>
                {result.successes === 0 && (
                  <div style={{ fontFamily: C.font, fontSize: 8, color: C.red, marginTop: 4 }}>▶ DIVINE AGONY — gain affliction/hook/injury or store pathos</div>
                )}
              </div>

              {/* Dice display */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: C.mid, marginBottom: 4 }}>
                  POOL ({result.threshold}+ = success):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {result.pool.map((d, i) => (
                    <div key={i} style={{
                      width: 28, height: 28, border: `2px solid ${getDieColor(d)}`,
                      background: getDieColor(d), display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: C.fontSans, fontSize: 14, fontWeight: 900,
                      color: d >= result.threshold ? C.bg : C.muted,
                    }}>{d}</div>
                  ))}
                </div>
              </div>

              {/* Risk die */}
              {result.riskDie && (
                <div style={{ marginBottom: 8, padding: '4px 6px', border: `1px solid ${C.red}`, background: result.riskDie === 1 ? C.red + '22' : 'transparent' }}>
                  <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, color: C.mid }}>RISK DIE (Admin):</div>
                  <div style={{ fontFamily: C.fontSans, fontSize: 20, fontWeight: 900, color: result.riskDie === 1 ? C.red : C.dark }}>
                    {result.riskDie} {result.riskDie === 1 ? '⚠ BAD THING HAPPENS' : ''}
                  </div>
                </div>
              )}

              {/* Mode reminder */}
              {result.mode !== 'normal' && (
                <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, fontStyle: 'italic' }}>
                  {result.mode === 'hard' ? 'Hard: only 6s count' : 'Risky: Admin rolled risk die'}
                </div>
              )}
            </div>
          )}

          {!result && (
            <div style={{ border: `1px dashed ${C.border}`, padding: 20, textAlign: 'center' }}>
              <div style={{ fontFamily: C.font, fontSize: 9, color: C.muted }}>Configure dice and roll to see results here.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
