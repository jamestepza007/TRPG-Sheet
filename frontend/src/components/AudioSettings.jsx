import { useState, useEffect, useRef } from 'react';
import api from '../utils/api.js';

const STORAGE_KEY = 'trpg_audio_settings';

const FALLBACK_TRACKS = [
  { youtubeId: 'Lqkm_WdtPYg', label: 'BGM Track 1' },
  { youtubeId: 'LOvaOEpTSSU', label: 'BGM Track 2' },
  { youtubeId: 'GjsCaJhPyUo', label: 'BGM Track 3' },
  { youtubeId: 'OP4O-fHt8hE', label: 'BGM Track 4' },
];

const DEFAULTS = {
  criticalEffect: true,
  criticalSound: true,
  diceSound: true,
  bgmEnabled: false,
  bgmTrackId: null,
  bgmVolume: 50,
  bgmSyncEnabled: true,
  bgmDirectId: null,
};

function loadSettings() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return { ...DEFAULTS }; }
}
function saveSettings(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }

let _settings = loadSettings();
const _listeners = new Set();

export function getAudioSettings() { return _settings; }

// Called by SSE handler when GM pushes BGM change
export function handleBgmSync(data) {
  if (!_settings.bgmSyncEnabled) return;
  if (data.enabled && data.trackId) {
    setAudioSetting('bgmEnabled', true);
    setAudioSetting('bgmTrackId', data.trackId);
    setAudioSetting('bgmDirectId', data.trackId); // direct YouTube ID bypasses track list
  } else if (data.enabled === false) {
    setAudioSetting('bgmEnabled', false);
    setAudioSetting('bgmDirectId', null);
    setAudioSetting('bgmTrackId', null);
  }
}
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

// ── YouTube BGM Player (hidden) ──────────────────────────────────
function YoutubeBGM({ trackId, volume, playing }) {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!trackId) return;

    const initPlayer = () => {
      if (!iframeRef.current) return;
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: trackId,
        playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: trackId, mute: 0 },
        events: {
          onReady: (e) => {
            readyRef.current = true;
            e.target.unMute();
            e.target.setVolume(volume);
            if (playing) e.target.playVideo();
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) e.target.playVideo();
          }
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      try { playerRef.current?.destroy(); } catch {}
      readyRef.current = false;
    };
  }, [trackId]);

  useEffect(() => {
    if (!readyRef.current || !playerRef.current) return;
    playerRef.current.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (!readyRef.current || !playerRef.current) return;
    if (playing) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [playing]);

  return (
    <div style={{ position: 'fixed', left: -9999, top: -9999, width: 1, height: 1, overflow: 'hidden', pointerEvents: 'none' }}>
      <div ref={iframeRef} />
    </div>
  );
}

// ── Toggle ───────────────────────────────────────────────────────
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

// ── Main ─────────────────────────────────────────────────────────
export default function AudioSettings() {
  const s = useAudioSettings();
  const [open, setOpen] = useState(false);
  const [tracks, setTracks] = useState(FALLBACK_TRACKS);
  const set = (key, val) => setAudioSetting(key, val);

  useEffect(() => {
    api.get('/bgm').then(res => {
      if (res.data?.length > 0) {
        setTracks(res.data);
        // Auto-select first track if none selected
        if (!_settings.bgmTrackId) {
          setAudioSetting('bgmTrackId', res.data[0].youtubeId);
        }
      }
    }).catch(() => {});
  }, []);

  // bgmDirectId = direct YouTube ID from GM sync or manual URL input
  // takes priority over track list selection
  const effectiveId = s.bgmDirectId || (tracks.find(t => t.youtubeId === s.bgmTrackId)?.youtubeId) || tracks[0]?.youtubeId;

  return (
    <>
      {/* Hidden YouTube BGM player */}
      {s.bgmEnabled && (
        <YoutubeBGM
          key={effectiveId}
          trackId={effectiveId}
          volume={s.bgmVolume}
          playing={s.bgmEnabled}
        />
      )}

      {/* Floating button */}
      <button onClick={() => setOpen(o => !o)} title="Audio Settings"
        style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 500, width: 36, height: 36, borderRadius: '50%', background: open ? '#c9a84c' : 'rgba(14,10,4,0.9)', border: '1px solid #3a2a10', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'background 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
        🔊
      </button>

      {/* Panel */}
      {open && (
        <div style={{ position: 'fixed', bottom: 64, left: 20, zIndex: 500, width: 250, background: 'rgba(14,10,4,0.97)', border: '1px solid #3a2a10', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.6)', padding: '12px 14px' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: '#c9a84c', letterSpacing: '0.15em', marginBottom: 8, textTransform: 'uppercase' }}>⚙ Audio Settings</div>

          <Toggle label="Critical Effect" sub="Animation on max/min roll"
            value={s.criticalEffect} onChange={v => set('criticalEffect', v)} />
          <Toggle label="Critical Sound" sub="Legendary / Catastrophic sound"
            value={s.criticalSound} onChange={v => set('criticalSound', v)} />
          <Toggle label="Dice Roll Sound" sub="Click sound when rolling"
            value={s.diceSound} onChange={v => set('diceSound', v)} />

          {/* BGM Section */}
          <div style={{ marginTop: 2 }}>
            <Toggle label="Allow GM BGM Sync" sub="Let GM control your background music"
              value={s.bgmSyncEnabled !== false} onChange={v => set('bgmSyncEnabled', v)} />
            <Toggle label="Background Music" sub="BGM during play"
              value={s.bgmEnabled} onChange={v => set('bgmEnabled', v)} />

            {s.bgmEnabled && (
              <div style={{ paddingTop: 8 }}>
                {/* Direct URL input */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9, color: '#888', fontFamily: 'Cinzel, serif', marginBottom: 4 }}>OR PLAY URL DIRECTLY</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <input id="bgm-direct-url" type="text" placeholder="YouTube URL or ID..."
                      style={{ flex: 1, background: '#0d0d0d', border: '1px solid #333', color: '#e8e8e8', fontSize: 9, padding: '3px 6px', fontFamily: 'monospace', borderRadius: 3 }} />
                    <button onClick={() => {
                      const val = document.getElementById('bgm-direct-url').value.trim();
                      const match = val.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                      const ytId = match ? match[1] : (val.length === 11 ? val : null);
                      if (ytId) { set('bgmDirectId', ytId); set('bgmEnabled', true); document.getElementById('bgm-direct-url').value = ''; }
                    }} style={{ background: '#c9a84c', border: 'none', color: '#000', fontSize: 9, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Cinzel, serif', borderRadius: 3 }}>▶</button>
                  </div>
                </div>

                {/* Volume */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 9, color: '#888', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>VOLUME</div>
                    <div style={{ fontSize: 10, color: '#c9a84c', fontFamily: 'Share Tech Mono, monospace', minWidth: 36, textAlign: 'right' }}>{s.bgmVolume}%</div>
                  </div>
                  <div style={{ position: 'relative', height: 18, display: 'flex', alignItems: 'center' }}>
                    {/* Track background */}
                    <div style={{ position: 'absolute', left: 0, right: 0, height: 3, background: '#1a1a1a', borderRadius: 3, border: '1px solid #2a2a2a' }} />
                    {/* Fill */}
                    <div style={{ position: 'absolute', left: 0, width: `${s.bgmVolume}%`, height: 3, background: 'linear-gradient(90deg, #7a6020, #c9a84c)', borderRadius: 3, transition: 'width 0.05s' }} />
                    {/* Thumb */}
                    <div style={{ position: 'absolute', left: `calc(${s.bgmVolume}% - 7px)`, width: 14, height: 14, borderRadius: '50%', background: '#c9a84c', border: '2px solid #8a6830', boxShadow: '0 0 6px rgba(201,168,76,0.4)', pointerEvents: 'none', transition: 'left 0.05s' }} />
                    {/* Invisible input on top */}
                    <input type="range" min={0} max={100} step={5} value={s.bgmVolume}
                      onChange={e => set('bgmVolume', parseInt(e.target.value))}
                      style={{ position: 'absolute', left: 0, right: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0, zIndex: 1 }} />
                  </div>
                </div>

                {/* Track list */}
                <div style={{ fontSize: 9, color: '#555', marginBottom: 4, fontFamily: 'Cinzel, serif' }}>Track:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {tracks.map((t) => (
                    <button key={t.youtubeId} onClick={() => { set('bgmDirectId', null); set('bgmTrackId', t.youtubeId); }}
                      style={{ textAlign: 'left', padding: '4px 8px', background: s.bgmTrackId === t.youtubeId ? '#1a1208' : 'transparent', border: `1px solid ${s.bgmTrackId === t.youtubeId ? '#c9a84c' : '#2a2a2a'}`, color: s.bgmTrackId === t.youtubeId ? '#c9a84c' : '#666', fontFamily: 'Cinzel, serif', fontSize: 9, cursor: 'pointer', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 8 }}>{s.bgmTrackId === t.youtubeId ? '▶' : '○'}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
