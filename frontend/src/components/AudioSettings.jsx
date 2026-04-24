import { useState, useEffect } from 'react';

const STORAGE_KEY = 'trpg_audio_settings';
const DEFAULTS = {
  criticalEffect: true,    // toggle
  criticalSoundVol: 1.0,   // volume slider
  diceSound: true,         // toggle
  bgmEnabled: false,
  bgmVolume: 0.4,
  bgmTrack: 0,
};

function loadSettings() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return { ...DEFAULTS }; }
}
function saveSettings(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }

let _settings = loadSettings();
const _listeners = new Set();

export function getAudioSettings() { return _settings; }
export function setAudioSetting(key, value) {
  _settings = { ..._settings, [key]: value };
  saveSettings(_settings);
  _listeners.forEach(fn => fn({ ..._settings }));
}
export function useAudioSettings() {
  const [s, setS] = useState(() => ({ ..._settings }));
  useEffect(() => { _listeners.add(setS); return () => _listeners.delete(setS); }, []);
  return s;
}

export const BGM_TRACKS = [
  { id: 0, label: 'Track 1 (coming soon)', url: null },
  { id: 1, label: 'Track 2 (coming soon)', url: null },
  { id: 2, label: 'Track 3 (coming soon)', url: null },
];

let bgmAudio = null;
export function updateBGM(settings) {
  if (!bgmAudio) { bgmAudio = new Audio(); bgmAudio.loop = true; }
  const track = BGM_TRACKS[settings.bgmTrack];
  if (!settings.bgmEnabled || !track?.url) { bgmAudio.pause(); return; }
  if (bgmAudio.src !== track.url) bgmAudio.src = track.url;
  bgmAudio.volume = settings.bgmVolume;
  bgmAudio.play().catch(() => {});
}

function VolumeRow({ label, sub, value, onChange }) {
  const pct = Math.round(value * 100);
  return (
    <div style={{ padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: '#e8e8e8', fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>{label}</div>
          {sub && <div style={{ fontSize: 9, color: '#555', marginTop: 1 }}>{sub}</div>}
        </div>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: pct === 0 ? '#555' : '#c9a84c', minWidth: 36, textAlign: 'right', flexShrink: 0 }}>
          {pct === 0 ? 'OFF' : `${pct}%`}
        </div>
      </div>
      <div style={{ position: 'relative', height: 16, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 3, background: '#2a2a2a', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 3, background: '#c9a84c', borderRadius: 2 }} />
        <input type="range" min={0} max={1} step={0.05} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ position: 'absolute', left: 0, right: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 16, margin: 0 }} />
        <div style={{ position: 'absolute', left: `calc(${pct}% - 7px)`, width: 14, height: 14, borderRadius: '50%', background: '#c9a84c', boxShadow: '0 0 4px rgba(201,168,76,0.5)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function Toggle({ label, sub, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div>
        <div style={{ fontSize: 11, color: '#e8e8e8', fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>{label}</div>
        {sub && <div style={{ fontSize: 9, color: '#555', marginTop: 1 }}>{sub}</div>}
      </div>
      <div onClick={() => onChange(!value)}
        style={{ width: 34, height: 18, borderRadius: 9, background: value ? '#c9a84c' : '#2a2a2a', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s', marginLeft: 10 }}>
        <div style={{ position: 'absolute', top: 2, left: value ? 17 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
      </div>
    </div>
  );
}

export default function AudioSettings() {
  const s = useAudioSettings();
  const [open, setOpen] = useState(false);
  useEffect(() => { updateBGM(s); }, [s]);
  const set = (key, val) => setAudioSetting(key, val);

  return (
    <>
      <button onClick={() => setOpen(o => !o)} title="Audio Settings"
        style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 500, width: 36, height: 36, borderRadius: '50%', background: open ? '#c9a84c' : 'rgba(14,10,4,0.9)', border: '1px solid #3a2a10', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'background 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
        🔊
      </button>

      {open && (
        <div style={{ position: 'fixed', bottom: 64, left: 20, zIndex: 500, width: 270, background: 'rgba(14,10,4,0.97)', border: '1px solid #3a2a10', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.6)', padding: '12px 14px' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: '#c9a84c', letterSpacing: '0.15em', marginBottom: 8, textTransform: 'uppercase' }}>⚙ Audio Settings</div>

          <Toggle label="Critical Effect" sub="Animation on max/min roll"
            value={s.criticalEffect} onChange={v => set('criticalEffect', v)} />
          <VolumeRow label="Critical Sound" sub="Legendary / Catastrophic sound volume"
            value={s.criticalSoundVol} onChange={v => set('criticalSoundVol', v)} />
          <Toggle label="Dice Roll Sound" sub="Click sound when rolling"
            value={s.diceSound} onChange={v => set('diceSound', v)} />

          <div style={{ marginTop: 2 }}>
            <Toggle label="Background Music" sub="BGM during play (off by default)"
              value={s.bgmEnabled} onChange={v => set('bgmEnabled', v)} />
            {s.bgmEnabled && (
              <div style={{ paddingTop: 6 }}>
                <VolumeRow label="BGM Volume" value={s.bgmVolume} onChange={v => set('bgmVolume', v)} />
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 9, color: '#555', marginBottom: 4 }}>Track:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {BGM_TRACKS.map(t => (
                      <button key={t.id} onClick={() => set('bgmTrack', t.id)}
                        style={{ textAlign: 'left', padding: '3px 8px', background: s.bgmTrack === t.id ? '#1a1208' : 'transparent', border: `1px solid ${s.bgmTrack === t.id ? '#c9a84c' : '#2a2a2a'}`, color: s.bgmTrack === t.id ? '#c9a84c' : '#555', fontFamily: 'Cinzel, serif', fontSize: 9, cursor: 'pointer', borderRadius: 3 }}>
                        {s.bgmTrack === t.id ? '▶ ' : '   '}{t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
