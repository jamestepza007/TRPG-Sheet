import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../utils/api.js';
import { useAuthStore } from '../hooks/useAuth.js';
import toast from 'react-hot-toast';

// ── Dice parser ─────────────────────────────────────────────────
function parseDiceExpression(expr) {
  const clean = expr.replace(/\s+/g, '').toLowerCase();
  const tokens = clean.split(/(?=[+-])/).filter(Boolean);
  let diceGroups = [], flatMod = 0;
  for (const token of tokens) {
    const dm = token.match(/^([+-]?)(\d+)d(\d+)$/);
    const nm = token.match(/^([+-]?\d+)$/);
    if (dm) diceGroups.push({ count: parseInt(dm[2]), sides: parseInt(dm[3]), sign: dm[1] === '-' ? -1 : 1 });
    else if (nm) flatMod += parseInt(nm[1]);
    else throw new Error(`Invalid: ${token}`);
  }
  if (!diceGroups.length) throw new Error('No dice found');
  return { diceGroups, flatMod };
}

function rollParsed({ diceGroups, flatMod }) {
  let total = flatMod;
  const breakdown = [];
  for (const g of diceGroups) {
    const rolls = Array.from({ length: g.count }, () => Math.floor(Math.random() * g.sides) + 1);
    const sub = rolls.reduce((a, b) => a + b, 0) * g.sign;
    total += sub;
    breakdown.push({ ...g, rolls, subtotal: sub });
  }
  return { total, breakdown, flatMod };
}

function isSingleGroup(expr) {
  return /^([+-]?)(\d+)d(\d+)([+-]\d+)?$/.test(expr.replace(/\s+/g, '').toLowerCase());
}

function getMinMax(diceGroups, flatMod) {
  let min = flatMod, max = flatMod;
  for (const g of diceGroups) {
    if (g.sign > 0) { min += g.count; max += g.count * g.sides; }
    else { min -= g.count * g.sides; max -= g.count; }
  }
  return { min, max };
}

// ── Message pools ────────────────────────────────────────────────
const LEGENDARY = [
  "The heavens smile upon you",
  "Fortune blesses your hand this day",
  "The gods themselves applaud your feat",
  "Fate has chosen you as its champion",
  "Stars align in your favor, hero",
  "Even your enemies must acknowledge greatness",
  "Legend remembers moments like this",
  "The dice sing with golden light",
  "Destiny was always yours to claim",
  "In a thousand tales, bards will speak of this",
  "The universe bends to your will",
  "A triumph worthy of the ages",
  "Your name shall echo in the halls of glory",
  "Even the fates pause to witness your victory",
  "Fortune herself weeps tears of joy for you",
];
const CATASTROPHIC = [
  "The void laughs at your suffering",
  "Even the dice weep for you",
  "Some fates are worse than death",
  "The stars have turned their backs on you",
  "Perhaps you should have stayed in bed",
  "Darkness swallows your hope whole",
  "The gods look away in embarrassment",
  "Misfortune has chosen you as its student",
  "A tragedy so profound, bards refuse to sing it",
  "Even your allies wince in secondhand shame",
  "Fortune has abandoned you in your hour of need",
  "The dice remember every insult you ever gave",
  "Somewhere, a villain smiles without knowing why",
  "History will record this as a cautionary tale",
  "Despair is the only honest response here",
];

// ── Audio engine using Web Audio API ────────────────────────────
function playLegendarySound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // Choir-like swell
    [261.63, 329.63, 392.00, 523.25, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.1 + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.6 + i * 0.08);
      gain.gain.linearRampToValueAtTime(0, now + 2.5);
      osc.start(now + i * 0.06);
      osc.stop(now + 2.5);
    });

    // Impact hit
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
    const src = ctx.createBufferSource();
    const gainN = ctx.createGain();
    src.buffer = buf; src.connect(gainN); gainN.connect(ctx.destination);
    gainN.gain.setValueAtTime(0.5, now);
    gainN.gain.linearRampToValueAtTime(0, now + 0.12);
    src.start(now);

    // Sparkle dings
    [1047, 1319, 1568, 2093].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0, now + 0.3 + i * 0.12);
      g.gain.linearRampToValueAtTime(0.15, now + 0.35 + i * 0.12);
      g.gain.linearRampToValueAtTime(0, now + 0.8 + i * 0.12);
      o.start(now + 0.3 + i * 0.12);
      o.stop(now + 1.5);
    });
  } catch {}
}

function playCatastrophicSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // Deep ominous drone descending
    [110, 82.41, 65.41, 55].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 1.5, now + i * 0.15);
      osc.frequency.linearRampToValueAtTime(freq, now + i * 0.15 + 0.4);
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.15 + 0.15);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.15 + 0.5);
      gain.gain.linearRampToValueAtTime(0, now + 2.8);
      osc.start(now + i * 0.15);
      osc.stop(now + 3);
    });

    // Heavy thud
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
    const src = ctx.createBufferSource();
    const gN = ctx.createGain();
    src.buffer = buf; src.connect(gN); gN.connect(ctx.destination);
    gN.gain.setValueAtTime(0.7, now);
    gN.gain.linearRampToValueAtTime(0, now + 0.35);
    src.start(now);

    // Dissonant screech
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2); gain2.connect(ctx.destination);
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(440, now + 0.1);
    osc2.frequency.linearRampToValueAtTime(220, now + 0.6);
    gain2.gain.setValueAtTime(0.08, now + 0.1);
    gain2.gain.linearRampToValueAtTime(0, now + 0.7);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.8);
  } catch {}
}

// ── Critical Overlay ────────────────────────────────────────────
const LEGENDARY_CSS = `
  @keyframes fadeInOv{from{opacity:0}to{opacity:1}}
  @keyframes critScale{0%{transform:scale(0) rotate(-20deg);opacity:0}50%{transform:scale(1.25) rotate(4deg);opacity:1}75%{transform:scale(0.92) rotate(-2deg)}100%{transform:scale(1) rotate(0)}}
  @keyframes numGlow{0%,100%{text-shadow:0 0 30px #ffd700,0 0 80px #ffd700,0 0 140px #c9a84c}50%{text-shadow:0 0 60px #fff,0 0 120px #ffd700,0 0 200px #ffaa00,0 0 280px #ff8800}}
  @keyframes msgFade{0%{opacity:0;letter-spacing:0.3em}100%{opacity:1;letter-spacing:0.04em}}
  @keyframes iconSpin{0%{transform:rotate(0) scale(0);opacity:0}60%{transform:rotate(720deg) scale(1.3);opacity:1}100%{transform:rotate(720deg) scale(1)}}
  @keyframes burst{0%{transform:translate(-50%,-50%) scale(0);opacity:1}100%{transform:translate(-50%,-50%) scale(4);opacity:0}}
  @keyframes float{0%{transform:translateY(0) rotate(var(--r)) scale(1);opacity:1}100%{transform:translateY(calc(var(--dy))) rotate(calc(var(--r) + 360deg)) scale(0);opacity:0}}
  @keyframes bgPulse{0%,100%{background:rgba(0,0,0,0.92)}50%{background:rgba(20,12,0,0.96)}}
  .crit-num{animation:critScale .7s cubic-bezier(.175,.885,.32,1.275) forwards,numGlow 2s ease-in-out .7s infinite}
  .crit-msg{animation:msgFade 0.8s ease 1.2s both}
  .crit-icon{animation:iconSpin 0.9s cubic-bezier(.175,.885,.32,1.275) forwards}
  .burst-ring{position:absolute;top:50%;left:50%;width:200px;height:200px;border-radius:50%;border:3px solid #ffd700;animation:burst 0.8s ease-out forwards}
`;

const CATA_CSS = `
  @keyframes fadeInOv{from{opacity:0}to{opacity:1}}
  @keyframes failCrash{0%{transform:translateY(-120px) scale(1.5) rotate(5deg);opacity:0}60%{transform:translateY(12px) scale(0.95) rotate(-1deg);opacity:1}80%{transform:translateY(-4px) scale(1.02)}100%{transform:translateY(0) scale(1) rotate(0)}}
  @keyframes failGlow{0%,100%{text-shadow:0 0 20px #8b0000,0 0 50px #8b0000}50%{text-shadow:0 0 40px #ff0000,0 0 80px #8b0000,0 0 120px #400000}}
  @keyframes failMsg{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes shake{0%,100%{transform:translate(0,0)}10%{transform:translate(-8px,4px)}20%{transform:translate(8px,-4px)}30%{transform:translate(-6px,6px)}40%{transform:translate(6px,-2px)}50%{transform:translate(-4px,4px)}60%{transform:translate(4px,-6px)}70%{transform:translate(-6px,2px)}80%{transform:translate(6px,4px)}90%{transform:translate(-2px,-4px)}}
  @keyframes bgFlash{0%{background:rgba(0,0,0,0.92)}10%{background:rgba(60,0,0,0.96)}20%{background:rgba(0,0,0,0.95)}100%{background:rgba(0,0,0,0.95)}}
  @keyframes crack{0%{opacity:0;transform:scale(0.5)}100%{opacity:0.15;transform:scale(1)}}
  @keyframes darkFloat{0%{transform:translateY(0) scale(1);opacity:0.8}100%{transform:translateY(calc(var(--dy))) scale(0);opacity:0}}
  .fail-num{animation:failCrash .6s cubic-bezier(.175,.885,.32,1.275) forwards,failGlow 2.2s ease-in-out .6s infinite}
  .fail-msg{animation:failMsg 0.7s ease 1s both}
  .fail-shake{animation:shake 0.5s ease 0.1s}
`;

function Particle({ isCrit }) {
  const style = {
    position: 'absolute',
    borderRadius: isCrit ? '50%' : '2px',
    '--r': `${Math.random() * 360}deg`,
    '--dy': `${isCrit ? -(80 + Math.random() * 200) : (80 + Math.random() * 200)}px`,
    width: 4 + Math.random() * 10,
    height: 4 + Math.random() * 10,
    background: isCrit
      ? ['#ffd700','#ffcc00','#fff','#c9a84c','#ffe066','#ffaa00'][Math.floor(Math.random() * 6)]
      : ['#4a0000','#8b0000','#2a2a2a','#1a0000','#600000'][Math.floor(Math.random() * 5)],
    left: `${20 + Math.random() * 60}%`,
    top: `${20 + Math.random() * 60}%`,
    animation: `float ${0.8 + Math.random() * 1.4}s ease-out ${Math.random() * 0.5}s forwards`,
  };
  return <div style={style} />;
}

function CriticalOverlay({ type, result, expr, onDismiss }) {
  const isCrit = type === 'max';
  const [msg] = useState(() => {
    const pool = isCrit ? LEGENDARY : CATASTROPHIC;
    return pool[Math.floor(Math.random() * pool.length)];
  });

  useEffect(() => {
    const t = setTimeout(() => {
      if (isCrit) playLegendarySound();
      else playCatastrophicSound();
    }, 100);
    return () => clearTimeout(t);
  }, []);

  if (isCrit) return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', animation:'bgPulse 3s ease-in-out infinite, fadeInOv 0.3s ease', cursor:'pointer' }}
      onClick={onDismiss}>
      <style>{LEGENDARY_CSS}</style>

      {/* Burst rings */}
      {[0, 0.15, 0.3].map((d, i) => (
        <div key={i} className="burst-ring" style={{ animationDelay: `${d}s`, borderColor: i === 0 ? '#ffd700' : i === 1 ? '#c9a84c' : '#fff6', width: 200 + i * 80, height: 200 + i * 80 }} />
      ))}

      {/* Particles */}
      {Array.from({ length: 40 }, (_, i) => <Particle key={i} isCrit={true} />)}

      {/* Content */}
      <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 48px', maxWidth:600 }}>
        <div className="crit-icon" style={{ fontSize:64, marginBottom:16, display:'block' }}>✨⚔✨</div>

        <div style={{ fontFamily:'Cinzel, serif', fontSize:15, color:'#ffd700', letterSpacing:'0.4em', marginBottom:24, textTransform:'uppercase', opacity:0.9 }}>
          Legendary Roll
        </div>

        <div className="crit-num" style={{ fontFamily:'Cinzel, serif', fontSize:160, color:'#ffd700', lineHeight:1, fontWeight:700 }}>
          {result}
        </div>

        <div style={{ fontFamily:'Share Tech Mono, monospace', color:'#5a4a20', fontSize:14, marginTop:14, letterSpacing:'0.1em' }}>
          {expr}
        </div>

        <div className="crit-msg" style={{ color:'#c9a84c', fontSize:20, marginTop:28, fontFamily:'Crimson Text, serif', fontStyle:'italic', letterSpacing:'0.04em', lineHeight:1.6 }}>
          "{msg}"
        </div>

        <div style={{ color:'#2a2a2a', fontSize:11, marginTop:48, fontFamily:'Cinzel, serif', letterSpacing:'0.2em', textTransform:'uppercase' }}>
          tap anywhere to dismiss
        </div>
      </div>
    </div>
  );

  // CATASTROPHIC
  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', animation:'bgFlash 0.5s ease forwards, fadeInOv 0.2s ease', cursor:'pointer' }}
      onClick={onDismiss}>
      <style>{CATA_CSS}</style>

      {/* Dark particles falling */}
      {Array.from({ length: 30 }, (_, i) => <Particle key={i} isCrit={false} />)}

      {/* Crack overlay */}
      <div style={{ position:'absolute', inset:0, zIndex:1, animation:'crack 0.4s ease 0.1s both', pointerEvents:'none', background:'radial-gradient(ellipse at center, transparent 30%, #1a0000 100%)' }} />

      {/* Content */}
      <div className="fail-shake" style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 48px', maxWidth:600 }}>
        <div style={{ fontSize:64, marginBottom:16, filter:'grayscale(1) brightness(0.3)', animation:'failCrash 0.6s ease forwards' }}>💀☠💀</div>

        <div style={{ fontFamily:'Cinzel, serif', fontSize:15, color:'#5a0000', letterSpacing:'0.4em', marginBottom:24, textTransform:'uppercase' }}>
          Catastrophic Failure
        </div>

        <div className="fail-num" style={{ fontFamily:'Cinzel, serif', fontSize:160, color:'#8b0000', lineHeight:1, fontWeight:700 }}>
          {result}
        </div>

        <div style={{ fontFamily:'Share Tech Mono, monospace', color:'#2a2a2a', fontSize:14, marginTop:14, letterSpacing:'0.1em' }}>
          {expr}
        </div>

        <div className="fail-msg" style={{ color:'#5a0000', fontSize:20, marginTop:28, fontFamily:'Crimson Text, serif', fontStyle:'italic', letterSpacing:'0.04em', lineHeight:1.6 }}>
          "{msg}"
        </div>

        <div style={{ color:'#1a1a1a', fontSize:11, marginTop:48, fontFamily:'Cinzel, serif', letterSpacing:'0.2em', textTransform:'uppercase' }}>
          tap anywhere to dismiss
        </div>
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────
export default function DiceRoller({ system, campaignId, getModifier, stats, externalExpr, rollTrigger, characterName }) {
  const { user } = useAuthStore();
  const [expr, setExpr] = useState(externalExpr || '2d6');
  const [result, setResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [sendToDiscord, setSendToDiscord] = useState(false);
  const [webhooks, setWebhooks] = useState([]);
  const [selectedWebhookUrl, setSelectedWebhookUrl] = useState('');
  const [critical, setCritical] = useState(null);
  const prevTrigger = useRef(0);
  const exprRef = useRef(expr);

  useEffect(() => { exprRef.current = expr; }, [expr]);
  useEffect(() => { if (externalExpr !== undefined) setExpr(externalExpr); }, [externalExpr]);

  useEffect(() => {
    api.get('/users/me/profile').then(res => {
      const whs = res.data.discordWebhooks || [];
      setWebhooks(whs);
      if (whs.length > 0) setSelectedWebhookUrl(whs[0].url);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!rollTrigger || rollTrigger === prevTrigger.current) return;
    prevTrigger.current = rollTrigger;
    const t = setTimeout(() => doRoll(exprRef.current), 30);
    return () => clearTimeout(t);
  }, [rollTrigger]);

  const doRoll = useCallback(async (expression) => {
    const trimmed = (expression || exprRef.current).trim();
    if (!trimmed) return;
    setRolling(true);
    try {
      const parsed = parseDiceExpression(trimmed);
      const res = rollParsed(parsed);
      const single = isSingleGroup(trimmed);
      const { min, max } = getMinMax(parsed.diceGroups, parsed.flatMod);

      try {
        await api.post('/dice/roll', {
          expression: trimmed, system, campaignId,
          sendToDiscord: sendToDiscord && !!selectedWebhookUrl,
          webhookUrl: sendToDiscord ? selectedWebhookUrl : null,
          result: res.total,
          details: res.breakdown,
          characterName: characterName || null,
        });
      } catch {}

      setResult({ ...res, expr: trimmed, min, max });

      if (single) {
        if (res.total === max) setTimeout(() => setCritical({ type: 'max', result: res.total, expr: trimmed }), 200);
        else if (res.total === min) setTimeout(() => setCritical({ type: 'min', result: res.total, expr: trimmed }), 200);
      }
    } catch (err) {
      toast.error(err.message || 'Invalid expression');
    } finally {
      setRolling(false);
    }
  }, [sendToDiscord, selectedWebhookUrl, system, campaignId, characterName]);

  const acc = '#c9a84c';

  return (
    <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, padding: 18 }}>
      <div className="section-title" style={{ color: acc }}>🎲 Dice Roller</div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11 }}>Dice Expression</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={expr} onChange={e => setExpr(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') doRoll(expr); }}
            placeholder="e.g. 2d6+3 or 1d100+1d10+1"
            style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 15, flex: 1 }} />
          <button onClick={() => doRoll(expr)} disabled={rolling}
            style={{ background: acc, color: '#000', border: 'none', borderRadius: 6, padding: '0 18px', fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.08em', minWidth: 72, opacity: rolling ? 0.7 : 1 }}>
            {rolling ? '…' : 'ROLL'}
          </button>
        </div>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', color: '#333', fontSize: 10, marginTop: 5 }}>
          2d6 · 1d20+5 · 3d4-1 · 1d100+1d10+1
        </div>
      </div>

      {/* Discord */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, padding: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: sendToDiscord ? 10 : 0 }}>
          <div style={{ width: 38, height: 22, borderRadius: 11, cursor: 'pointer', position: 'relative', background: sendToDiscord ? acc : '#2a2a2a', transition: 'background 0.2s', flexShrink: 0 }}
            onClick={() => setSendToDiscord(p => !p)}>
            <div style={{ position: 'absolute', top: 3, left: sendToDiscord ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
          </div>
          <span style={{ fontSize: 13, color: sendToDiscord ? '#e8e8e8' : '#555', fontFamily: 'Cinzel, serif', letterSpacing: '0.05em', userSelect: 'none' }}>
            Send to Discord
          </span>
        </div>
        {sendToDiscord && (
          webhooks.length === 0
            ? <div style={{ fontSize: 12, color: '#555', fontFamily: 'Cinzel, serif' }}>No webhooks. Add them in Profile.</div>
            : <div>
                <label style={{ fontSize: 11 }}>Channel</label>
                <select value={selectedWebhookUrl} onChange={e => setSelectedWebhookUrl(e.target.value)} style={{ fontSize: 13 }}>
                  {webhooks.map((w, i) => <option key={i} value={w.url}>{w.label || `Webhook ${i + 1}`}</option>)}
                </select>
              </div>
        )}
      </div>

      {/* Result — big number */}
      {result && (
        <div style={{ background: '#0d0d0d', border: `1px solid ${acc}33`, borderRadius: 8, padding: '20px 16px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 88, color: acc, lineHeight: 1, fontWeight: 700, textShadow: `0 0 30px ${acc}55` }}>
            {result.total}
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#555', marginTop: 8 }}>
            {result.breakdown.map((g, i) => (
              <span key={i}>{i > 0 ? ' + ' : ''}{g.sign < 0 ? '−[' : '['}{g.rolls.join(', ')}]</span>
            ))}
            {result.flatMod !== 0 && <span> {result.flatMod > 0 ? '+' : ''}{result.flatMod}</span>}
          </div>
          {system === 'DUNGEON_WORLD' && (() => {
            const t = result.total;
            const tag = t >= 10 ? { label: '10+ Strong Hit', color: '#4ade80' }
              : t >= 7 ? { label: '7-9 Partial Hit', color: '#facc15' }
              : { label: '6- Miss', color: '#f87171' };
            return (
              <div style={{ display: 'inline-block', marginTop: 12, padding: '5px 20px', borderRadius: 20, fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: '0.1em', background: tag.color + '22', color: tag.color, border: `1px solid ${tag.color}44` }}>
                {tag.label}
              </div>
            );
          })()}
        </div>
      )}

      {critical && (
        <CriticalOverlay type={critical.type} result={critical.result} expr={critical.expr} onDismiss={() => setCritical(null)} />
      )}
    </div>
  );
}
