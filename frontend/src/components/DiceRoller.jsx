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
  return /^([+-]?)(\d+)d(\d+)([+-]\d+)?$/.test(expr.replace(/\s+/g,'').toLowerCase());
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
  "The heavens split open for you alone",
  "Fortune blesses your hand this day",
  "The gods themselves rise to applaud",
  "Fate has chosen you as its champion",
  "Stars realign in your favor, hero",
  "Even your enemies must bow in awe",
  "Legend remembers this moment forever",
  "The dice sing with blinding gold",
  "Destiny was always yours to claim",
  "A thousand bards will sing of this",
  "The universe bends to your will",
  "History pauses to witness your triumph",
  "Your name echoes through the halls of glory",
  "The fates themselves weep tears of joy",
  "Fortune kneels before you this night",
];
const CATASTROPHIC = [
  "The void laughs at your suffering",
  "Not even the dice can save you now",
  "Some fates are crueler than death",
  "The stars have forsaken you entirely",
  "You should have stayed in bed today",
  "Darkness swallows the last of your hope",
  "The gods avert their eyes in shame",
  "Misfortune has claimed you as its own",
  "Bards refuse to immortalize this moment",
  "Your allies wince in secondhand agony",
  "Fortune has abandoned you completely",
  "The dice remember every insult you gave",
  "A villain smiles somewhere, without knowing why",
  "History records this as a warning to others",
  "Even despair is too kind a word for this",
];

// ── Audio ────────────────────────────────────────────────────────
function playLegendarySound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    // Ascending heavenly choir
    [196, 261.63, 329.63, 392, 523.25, 659.25, 783.99].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = i % 2 === 0 ? 'sine' : 'triangle';
      o.frequency.setValueAtTime(f * 0.5, now + i * 0.07);
      o.frequency.linearRampToValueAtTime(f, now + i * 0.07 + 0.15);
      g.gain.setValueAtTime(0, now + i * 0.07);
      g.gain.linearRampToValueAtTime(0.14, now + i * 0.07 + 0.12);
      g.gain.linearRampToValueAtTime(0.07, now + i * 0.07 + 0.5);
      g.gain.linearRampToValueAtTime(0, now + 3);
      o.start(now + i * 0.07); o.stop(now + 3.5);
    });
    // Impact boom
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * Math.exp(-i/(ctx.sampleRate*0.025));
    const src = ctx.createBufferSource(), gn = ctx.createGain();
    src.buffer = buf; src.connect(gn); gn.connect(ctx.destination);
    gn.gain.setValueAtTime(0.8, now); gn.gain.linearRampToValueAtTime(0, now+0.18);
    src.start(now);
    // Sparkle cascade
    [1047, 1175, 1319, 1568, 1760, 2093, 2349].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine'; o.frequency.value = f;
      const t = now + 0.25 + i * 0.1;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18, t+0.04);
      g.gain.linearRampToValueAtTime(0, t+0.35);
      o.start(t); o.stop(t+0.4);
    });
  } catch {}
}

function playCatastrophicSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    // Descending doom drone
    [110, 82.41, 73.42, 65.41, 55, 41.2].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = i % 2 === 0 ? 'sawtooth' : 'square';
      o.frequency.setValueAtTime(f * 2.5, now + i * 0.18);
      o.frequency.linearRampToValueAtTime(f * 0.8, now + i * 0.18 + 0.5);
      g.gain.setValueAtTime(0, now + i * 0.18);
      g.gain.linearRampToValueAtTime(0.1, now + i * 0.18 + 0.15);
      g.gain.linearRampToValueAtTime(0.06, now + i * 0.18 + 0.6);
      g.gain.linearRampToValueAtTime(0, now + 3.5);
      o.start(now + i * 0.18); o.stop(now + 4);
    });
    // Heavy crash
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * Math.exp(-i/(ctx.sampleRate*0.09));
    const src = ctx.createBufferSource(), gn = ctx.createGain();
    src.buffer = buf; src.connect(gn); gn.connect(ctx.destination);
    gn.gain.setValueAtTime(1.0, now); gn.gain.linearRampToValueAtTime(0, now+0.45);
    src.start(now);
    // Dissonant wail dying out
    [[370, 349], [494, 466], [622, 587]].forEach(([f1, f2], i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sawtooth';
      const t = now + 0.15 + i * 0.12;
      o.frequency.setValueAtTime(f1, t);
      o.frequency.linearRampToValueAtTime(f2 * 0.5, t + 0.9);
      g.gain.setValueAtTime(0.08, t); g.gain.linearRampToValueAtTime(0, t + 1.0);
      o.start(t); o.stop(t + 1.1);
    });
  } catch {}
}

// ── Critical Overlay ─────────────────────────────────────────────
const CRIT_STYLES = `
  @keyframes fadeInOv{from{opacity:0}to{opacity:1}}

  /* LEGENDARY */
  @keyframes numLand{0%{transform:scale(0) rotate(-25deg) translateY(-60px);opacity:0}55%{transform:scale(1.3) rotate(5deg) translateY(0);opacity:1}72%{transform:scale(0.88) rotate(-2deg)}85%{transform:scale(1.08) rotate(1deg)}100%{transform:scale(1) rotate(0)}}
  @keyframes numPulse{0%,100%{text-shadow:0 0 40px #ffd700,0 0 100px #ffd700,0 0 180px #c9a84c}50%{text-shadow:0 0 80px #fff,0 0 160px #ffd700,0 0 260px #ffaa00,0 0 350px #ff8800}}
  @keyframes bgSwell{0%{background:rgba(0,0,0,0.95)}30%{background:rgba(25,14,0,0.98)}70%{background:rgba(15,8,0,0.97)}100%{background:rgba(0,0,0,0.95)}}
  @keyframes ring{0%{transform:translate(-50%,-50%) scale(0);opacity:0.9}100%{transform:translate(-50%,-50%) scale(3.5);opacity:0}}
  @keyframes floatUp{0%{opacity:1;transform:translateY(0) rotate(var(--r)) scale(1)}100%{opacity:0;transform:translateY(var(--dy)) rotate(calc(var(--r) + 540deg)) scale(0.2)}}
  @keyframes iconBounce{0%{transform:scale(0) rotate(-180deg);opacity:0}60%{transform:scale(1.4) rotate(20deg);opacity:1}80%{transform:scale(0.85) rotate(-5deg)}100%{transform:scale(1) rotate(0)}}
  @keyframes msgSlide{0%{opacity:0;letter-spacing:0.5em;transform:translateY(16px)}100%{opacity:1;letter-spacing:0.04em;transform:translateY(0)}}
  @keyframes shimmerBg{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

  /* CATASTROPHIC */
  @keyframes numCrash{0%{transform:translateY(-150px) scale(2) rotate(8deg);opacity:0}45%{transform:translateY(18px) scale(0.9) rotate(-3deg);opacity:1}65%{transform:translateY(-8px) scale(1.04)}80%{transform:translateY(4px) scale(0.97)}100%{transform:translateY(0) scale(1) rotate(0)}}
  @keyframes failPulse{0%,100%{text-shadow:0 0 20px #8b0000,0 0 50px #8b0000}33%{text-shadow:0 0 5px #300,0 0 15px #300}66%{text-shadow:0 0 60px #ff0000,0 0 120px #8b0000}}
  @keyframes screenShake{0%,100%{transform:translate(0,0) rotate(0)}10%{transform:translate(-12px,6px) rotate(-0.5deg)}20%{transform:translate(10px,-8px) rotate(0.5deg)}30%{transform:translate(-8px,10px) rotate(-0.3deg)}40%{transform:translate(10px,-6px) rotate(0.3deg)}50%{transform:translate(-6px,8px) rotate(-0.5deg)}60%{transform:translate(8px,-4px) rotate(0.2deg)}70%{transform:translate(-8px,6px) rotate(-0.4deg)}80%{transform:translate(6px,8px) rotate(0.3deg)}90%{transform:translate(-4px,-6px) rotate(-0.2deg)}}
  @keyframes flashRed{0%{background:rgba(0,0,0,0.95)}8%{background:rgba(80,0,0,0.98)}18%{background:rgba(0,0,0,0.97)}28%{background:rgba(50,0,0,0.98)}100%{background:rgba(0,0,0,0.97)}}
  @keyframes floatDown{0%{opacity:0.8;transform:translateY(0) rotate(var(--r))}100%{opacity:0;transform:translateY(var(--dy)) rotate(calc(var(--r) + 200deg)) scale(0.3)}}
  @keyframes failMsg{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes cracks{0%{opacity:0;transform:scale(0.3)}100%{opacity:0.12;transform:scale(1)}}

  .leg-num{animation:numLand .75s cubic-bezier(.175,.885,.32,1.275) forwards,numPulse 2.5s ease-in-out .75s infinite}
  .leg-icon{animation:iconBounce .8s cubic-bezier(.175,.885,.32,1.275) .1s both}
  .leg-msg{animation:msgSlide 0.9s ease 1.2s both}
  .leg-bg{animation:bgSwell 4s ease-in-out infinite}
  .fail-num{animation:numCrash .65s cubic-bezier(.175,.885,.32,1.275) forwards,failPulse 2.8s ease-in-out .65s infinite}
  .fail-shake{animation:screenShake .55s ease .05s}
  .fail-msg{animation:failMsg .7s ease 1s both}
  .fp-up{animation:floatUp var(--dur) ease-out var(--delay) forwards}
  .fp-dn{animation:floatDown var(--dur) ease-in var(--delay) forwards}
  .ring{position:absolute;top:50%;left:50%;border-radius:50%;border:3px solid;animation:ring .9s ease-out forwards}
  .crack{position:absolute;inset:0;animation:cracks .5s ease .1s both}
`;

function LegendaryParticle({ i }) {
  const colors = ['#ffd700','#ffcc00','#fff','#c9a84c','#ffe066','#ffaa00','#fffacd'];
  return <div className="fp-up" style={{
    position: 'absolute', borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    width: 4+Math.random()*12, height: 4+Math.random()*12,
    background: colors[i % colors.length],
    left: `${10+Math.random()*80}%`, top: `${15+Math.random()*70}%`,
    '--r': `${Math.random()*360}deg`,
    '--dy': `${-(100+Math.random()*220)}px`,
    '--dur': `${0.9+Math.random()*1.4}s`,
    '--delay': `${Math.random()*0.5}s`,
    zIndex: 1,
  }} />;
}

function CatastrophicParticle({ i }) {
  const colors = ['#3a0000','#6b0000','#1a0000','#500000','#2a2a2a','#8b0000'];
  return <div className="fp-dn" style={{
    position: 'absolute', borderRadius: '2px',
    width: 3+Math.random()*8, height: 3+Math.random()*8,
    background: colors[i % colors.length],
    left: `${5+Math.random()*90}%`, top: `${5+Math.random()*50}%`,
    '--r': `${Math.random()*360}deg`,
    '--dy': `${100+Math.random()*200}px`,
    '--dur': `${0.7+Math.random()*1.2}s`,
    '--delay': `${Math.random()*0.4}s`,
    zIndex: 1,
  }} />;
}

function CriticalOverlay({ type, result, expr, onDismiss }) {
  const isCrit = type === 'max';
  const [msg] = useState(() => {
    const pool = isCrit ? LEGENDARY : CATASTROPHIC;
    return pool[Math.floor(Math.random() * pool.length)];
  });

  useEffect(() => {
    const t = setTimeout(() => isCrit ? playLegendarySound() : playCatastrophicSound(), 80);
    return () => clearTimeout(t);
  }, []);

  if (isCrit) return (
    <div className="leg-bg" style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', animation:'fadeInOv 0.3s ease' }}
      onClick={onDismiss}>
      <style>{CRIT_STYLES}</style>

      {/* Burst rings */}
      {[0,0.18,0.36,0.55].map((d,i) => (
        <div key={i} className="ring" style={{
          width: 160+i*100, height: 160+i*100,
          borderColor: ['#ffd700','#c9a84c','#fff5','#ffd70044'][i],
          animationDelay: `${d}s`,
        }} />
      ))}

      {/* Particles */}
      {Array.from({length:50},(_,i) => <LegendaryParticle key={i} i={i} />)}

      {/* Shimmer background gradient */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#1a0a00,#000,#0a0500,#000)', backgroundSize:'400% 400%', animation:'shimmerBg 3s ease infinite', zIndex:0, opacity:0.6 }} />

      {/* Content */}
      <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 56px', maxWidth:640 }}>
        <div className="leg-icon" style={{ fontSize:72, marginBottom:20, display:'block', lineHeight:1 }}>✨⚔✨</div>
        <div style={{ fontFamily:'Cinzel, serif', fontSize:14, color:'#ffd700', letterSpacing:'0.5em', marginBottom:28, textTransform:'uppercase', opacity:0.85 }}>
          Legendary Roll
        </div>
        <div className="leg-num" style={{ fontFamily:'Cinzel, serif', fontSize:180, color:'#ffd700', lineHeight:1, fontWeight:700 }}>
          {result}
        </div>
        <div style={{ fontFamily:'Share Tech Mono, monospace', color:'#3a2a00', fontSize:15, marginTop:16, letterSpacing:'0.12em' }}>
          {expr}
        </div>
        <div className="leg-msg" style={{ color:'#c9a84c', fontSize:22, marginTop:32, fontFamily:'Crimson Text, serif', fontStyle:'italic', lineHeight:1.7 }}>
          "{msg}"
        </div>
        <div style={{ color:'#1a1a1a', fontSize:11, marginTop:52, fontFamily:'Cinzel, serif', letterSpacing:'0.25em', textTransform:'uppercase' }}>
          tap anywhere to dismiss
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', animation:'flashRed 0.6s ease forwards, fadeInOv 0.2s ease' }}
      onClick={onDismiss}>
      <style>{CRIT_STYLES}</style>

      {/* Crack overlay */}
      <div className="crack" style={{ background:'radial-gradient(ellipse at center, transparent 20%, #1a0000 100%)', zIndex:1, pointerEvents:'none' }} />

      {/* Particles */}
      {Array.from({length:35},(_,i) => <CatastrophicParticle key={i} i={i} />)}

      {/* Content */}
      <div className="fail-shake" style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 56px', maxWidth:640 }}>
        <div style={{ fontSize:72, marginBottom:20, lineHeight:1, filter:'grayscale(1) brightness(0.25)', animation:'numLand 0.6s ease forwards' }}>
          💀☠💀
        </div>
        <div style={{ fontFamily:'Cinzel, serif', fontSize:14, color:'#4a0000', letterSpacing:'0.5em', marginBottom:28, textTransform:'uppercase' }}>
          Catastrophic Failure
        </div>
        <div className="fail-num" style={{ fontFamily:'Cinzel, serif', fontSize:180, color:'#8b0000', lineHeight:1, fontWeight:700 }}>
          {result}
        </div>
        <div style={{ fontFamily:'Share Tech Mono, monospace', color:'#2a2a2a', fontSize:15, marginTop:16, letterSpacing:'0.12em' }}>
          {expr}
        </div>
        <div className="fail-msg" style={{ color:'#5a0000', fontSize:22, marginTop:32, fontFamily:'Crimson Text, serif', fontStyle:'italic', lineHeight:1.7 }}>
          "{msg}"
        </div>
        <div style={{ color:'#111', fontSize:11, marginTop:52, fontFamily:'Cinzel, serif', letterSpacing:'0.25em', textTransform:'uppercase' }}>
          tap anywhere to dismiss
        </div>
      </div>
    </div>
  );
}

// ── Main DiceRoller ──────────────────────────────────────────────
export default function DiceRoller({ system, campaignId, getModifier, stats, externalExpr, rollTrigger, characterName }) {
  const { user } = useAuthStore();
  const [expr, setExpr] = useState(externalExpr || '2d6');
  const [result, setResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [sendToDiscord, setSendToDiscord] = useState(false);
  const [globalWebhooks, setGlobalWebhooks] = useState([]);
  const [selectedWebhookUrl, setSelectedWebhookUrl] = useState('');
  const [critical, setCritical] = useState(null);
  const prevTrigger = useRef(0);
  const exprRef = useRef(expr);

  useEffect(() => { exprRef.current = expr; }, [expr]);
  useEffect(() => { if (externalExpr !== undefined) setExpr(externalExpr); }, [externalExpr]);

  // Load global webhooks (available to all users)
  useEffect(() => {
    api.get('/webhooks').then(res => {
      setGlobalWebhooks(res.data || []);
      if (res.data?.length > 0) setSelectedWebhookUrl(res.data[0].url);
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

      // ── Show result IMMEDIATELY — no waiting for network ──
      setResult({ ...res, expr: trimmed, min, max });
      setRolling(false);

      // ── Fire-and-forget: log + Discord in background ──
      api.post('/dice/roll', {
        expression: trimmed, system, campaignId,
        sendToDiscord: sendToDiscord && !!selectedWebhookUrl,
        webhookUrl: sendToDiscord ? selectedWebhookUrl : null,
        result: res.total, details: res.breakdown,
        characterName: characterName || null,
      }).catch(() => {}); // silent fail — never blocks UI

      if (single) {
        if (res.total === max) setTimeout(() => setCritical({ type:'max', result:res.total, expr:trimmed }), 200);
        else if (res.total === min) setTimeout(() => setCritical({ type:'min', result:res.total, expr:trimmed }), 200);
      }
    } catch (err) {
      toast.error(err.message || 'Invalid expression');
      setRolling(false);
    }
  }, [sendToDiscord, selectedWebhookUrl, system, campaignId, characterName]);

  const acc = '#c9a84c';

  return (
    <div style={{ background:'#161616', border:'1px solid #2a2a2a', borderRadius:8, padding:18 }}>
      <div className="section-title" style={{ color:acc }}>🎲 Dice Roller</div>

      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:11 }}>Dice Expression</label>
        <div style={{ display:'flex', gap:8 }}>
          <input value={expr} onChange={e => setExpr(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter') doRoll(expr); }}
            placeholder="e.g. 2d6+3 or 1d100+1d10+1"
            style={{ fontFamily:'Share Tech Mono, monospace', fontSize:15, flex:1 }} />
          <button onClick={() => doRoll(expr)} disabled={rolling}
            style={{ background:acc, color:'#000', border:'none', borderRadius:6, padding:'0 18px', fontFamily:'Cinzel, serif', fontSize:13, fontWeight:700, cursor:'pointer', letterSpacing:'0.08em', minWidth:72, opacity:rolling?0.7:1 }}>
            {rolling ? '…' : 'ROLL'}
          </button>
        </div>
        <div style={{ fontFamily:'Share Tech Mono, monospace', color:'#333', fontSize:10, marginTop:5 }}>
          2d6 · 1d20+5 · 3d4-1 · 1d100+1d10+1
        </div>
      </div>

      {/* Discord */}
      <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:6, padding:12, marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:sendToDiscord?10:0 }}>
          <div style={{ width:38, height:22, borderRadius:11, cursor:'pointer', position:'relative', background:sendToDiscord?acc:'#2a2a2a', transition:'background 0.2s', flexShrink:0 }}
            onClick={() => setSendToDiscord(p=>!p)}>
            <div style={{ position:'absolute', top:3, left:sendToDiscord?19:3, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }} />
          </div>
          <span style={{ fontSize:13, color:sendToDiscord?'#e8e8e8':'#555', fontFamily:'Cinzel, serif', letterSpacing:'0.05em', userSelect:'none' }}>
            Send to Discord
          </span>
        </div>
        {sendToDiscord && (
          globalWebhooks.length === 0
            ? <div style={{ fontSize:12, color:'#555' }}>No webhooks configured. Ask your Admin to add them.</div>
            : <div>
                <label style={{ fontSize:11 }}>Channel</label>
                <select value={selectedWebhookUrl} onChange={e => setSelectedWebhookUrl(e.target.value)} style={{ fontSize:13 }}>
                  {globalWebhooks.map((w,i) => <option key={i} value={w.url}>{w.label}</option>)}
                </select>
              </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div style={{ background:'#0d0d0d', border:`1px solid ${acc}33`, borderRadius:8, padding:'20px 16px', textAlign:'center' }}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:88, color:acc, lineHeight:1, fontWeight:700, textShadow:`0 0 30px ${acc}55` }}>
            {result.total}
          </div>
          <div style={{ fontFamily:'Share Tech Mono, monospace', fontSize:12, color:'#555', marginTop:8 }}>
            {result.breakdown.map((g,i) => (
              <span key={i}>{i>0?' + ':''}{g.sign<0?'−[':'['}{g.rolls.join(', ')}]</span>
            ))}
            {result.flatMod!==0 && <span> {result.flatMod>0?'+':''}{result.flatMod}</span>}
          </div>
          {system==='DUNGEON_WORLD' && (() => {
            const t = result.total;
            const tag = t>=10?{label:'10+ Strong Hit',color:'#4ade80'}:t>=7?{label:'7-9 Partial Hit',color:'#facc15'}:{label:'6- Miss',color:'#f87171'};
            return <div style={{ display:'inline-block', marginTop:12, padding:'5px 20px', borderRadius:20, fontFamily:'Cinzel, serif', fontSize:13, letterSpacing:'0.1em', background:tag.color+'22', color:tag.color, border:`1px solid ${tag.color}44` }}>{tag.label}</div>;
          })()}
        </div>
      )}

      {critical && <CriticalOverlay type={critical.type} result={critical.result} expr={critical.expr} onDismiss={() => setCritical(null)} />}
    </div>
  );
}
