import React, { useState } from 'react';
import {
  HardDrive,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Palette,
  Check,
  Volume2,
  Wifi,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { AppTheme } from '../types';

export const StorageSettingsView: React.FC = () => {
  const { 
    storageStats, 
    clearCache, 
    clearAllSongs,
    songs,
    theme,
    themeConfig,
    setTheme
  } = useMusic();
  const [wifiOnly, setWifiOnly] = useState<boolean>(true);
  const [audioQuality, setAudioQuality] = useState<'320' | '128'>('320');
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [clearSuccess, setClearSuccess] = useState<boolean>(false);
  const [clearAllSuccess, setClearAllSuccess] = useState<boolean>(false);

  const themeOptions: { id: AppTheme; name: string; desc: string; color: string }[] = [
    { id: 'amethyst', name: 'Amethyst', desc: 'Deep Royal Purple', color: '#a855f7' },
    { id: 'sapphire', name: 'Sapphire', desc: 'Ocean Midnight Blue', color: '#3b82f6' },
    { id: 'emerald', name: 'Emerald', desc: 'Lush Forest Jade', color: '#10b981' },
    { id: 'amber', name: 'Amber', desc: 'Sunset Warm Gold', color: '#f59e0b' },
    { id: 'crimson', name: 'Ruby', desc: 'Romantic Velvet Rose', color: '#f43f5e' },
    { id: 'obsidian', name: 'Obsidian', desc: 'Minimalist Titanium Dark', color: '#94a3b8' }
  ];

  const handleClearCache = async () => {
    if (!window.confirm('Clear all downloaded audio files from device cache? (Metadata will remain in SQLite)')) return;
    setIsClearing(true);
    await clearCache();
    setIsClearing(false);
    setClearSuccess(true);
    setTimeout(() => setClearSuccess(false), 3000);
  };

  const handleClearAllSongs = async () => {
    if (!window.confirm('Remove all songs from your library? Playlists will be preserved as empty.')) return;
    setIsClearing(true);
    await clearAllSongs();
    setIsClearing(false);
    setClearAllSuccess(true);
    setTimeout(() => setClearAllSuccess(false), 3000);
  };

  // Percent calculation
  const total = storageStats.totalCapacityGb;
  const otherPercent = (storageStats.usedByOtherGb / total) * 100;
  const appPercent = (storageStats.usedByAppMb / (total * 1024)) * 100;
  const freePercent = (storageStats.freeSpaceGb / total) * 100;

  return (
    <div id="storage-settings-view" className="space-y-3 pb-24 pt-1">
      {/* Header */}
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">Settings & Storage</h2>
        <p className="text-[10px] text-slate-400">Appearance, themes, offline cache & sync</p>
      </div>

      {/* Theme Color Selector Card */}
      <div 
        className="border rounded-2xl p-3.5 space-y-2.5 shadow-md"
        style={{ 
          backgroundColor: `${themeConfig.surfaceDark}e6`,
          borderColor: themeConfig.surfaceBorder 
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
            <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Theme & Color Palette</h3>
          </div>
          <span 
            className="text-[9px] px-1.5 py-0.2 rounded font-semibold border"
            style={{ 
              backgroundColor: themeConfig.badgeBg, 
              color: themeConfig.badgeText, 
              borderColor: themeConfig.surfaceBorder 
            }}
          >
            {themeConfig.name}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`p-2 rounded-xl border text-left transition-all relative cursor-pointer ${
                theme === opt.id
                  ? 'ring-1 border-white/40 bg-white/10 shadow'
                  : 'bg-black/30 hover:bg-white/5 border-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: opt.color }} />
                {theme === opt.id && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <p className="text-[11px] font-bold text-white truncate">{opt.name}</p>
              <p className="text-[9px] text-slate-400 truncate">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Storage Disk Meter Card */}
      <div 
        className="border rounded-2xl p-3.5 space-y-2.5 shadow-md"
        style={{ 
          backgroundColor: `${themeConfig.surfaceDark}e6`,
          borderColor: themeConfig.surfaceBorder 
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Internal Storage</p>
              <p className="text-[10px] text-slate-400">/storage/emulated/0/Music</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-400">
            {storageStats.freeSpaceGb} GB Free
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden flex border border-white/10 p-0.5">
            <div
              style={{ width: `${otherPercent}%` }}
              className="h-full bg-slate-600 rounded-l-full"
              title="System & Other Apps"
            />
            <div
              style={{ width: `${Math.max(2, appPercent)}%`, backgroundColor: themeConfig.primary }}
              className="h-full shadow-sm"
              title="MR Music App"
            />
            <div
              style={{ width: `${freePercent}%` }}
              className="h-full bg-emerald-500/30 rounded-r-full"
              title="Free Space"
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeConfig.primary }} />
              <span>MR Music: <strong>{storageStats.usedByAppMb} MB</strong> ({storageStats.downloadedSongsCount} tracks)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-600" />
              <span>System: <strong>{storageStats.usedByOtherGb} GB</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Preferences */}
      <div 
        className="border rounded-2xl p-3.5 space-y-2.5 shadow-md"
        style={{ 
          backgroundColor: `${themeConfig.surfaceDark}e6`,
          borderColor: themeConfig.surfaceBorder 
        }}
      >
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Offline Preferences</h3>

        {/* Wi-Fi Only Switch */}
        <div className="flex items-center justify-between py-0.5">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-white">Download Over Wi-Fi Only</p>
            <p className="text-[10px] text-slate-400">Prevents cellular data usage during sync</p>
          </div>

          <button
            onClick={() => setWifiOnly(!wifiOnly)}
            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
              wifiOnly ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
            style={wifiOnly ? { backgroundColor: themeConfig.primary } : {}}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                wifiOnly ? 'left-5' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Quality Selector */}
        <div className="flex items-center justify-between py-0.5 border-t border-white/5 pt-2">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-white">Audio Download Quality</p>
            <p className="text-[10px] text-slate-400">320kbps HD Audio vs 128kbps Standard</p>
          </div>

          <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setAudioQuality('320')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                audioQuality === '320' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
              style={audioQuality === '320' ? { backgroundColor: themeConfig.primary } : {}}
            >
              320k
            </button>
            <button
              onClick={() => setAudioQuality('128')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                audioQuality === '128' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
              style={audioQuality === '128' ? { backgroundColor: themeConfig.primary } : {}}
            >
              128k
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance & Cache Clear */}
      <div 
        className="border rounded-2xl p-3.5 space-y-2 shadow-md"
        style={{ 
          backgroundColor: `${themeConfig.surfaceDark}e6`,
          borderColor: themeConfig.surfaceBorder 
        }}
      >
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cache & Maintenance</h3>

        {/* Wipe downloaded audio blobs */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white">Wipe Downloaded Cache</p>
            <p className="text-[10px] text-slate-400">Frees up {storageStats.usedByAppMb} MB on disk</p>
          </div>

          <button
            onClick={handleClearCache}
            disabled={isClearing || storageStats.downloadedSongsCount === 0}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-lg text-[11px] font-semibold border border-rose-500/30 transition-all disabled:opacity-40 cursor-pointer"
          >
            {isClearing ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
            <span>Clear Cache</span>
          </button>
        </div>

        {/* Clear All Songs */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <p className="text-xs font-semibold text-white">Remove All Songs from Library</p>
            <p className="text-[10px] text-slate-400">Current library: {songs.length} tracks (Playlists kept)</p>
          </div>

          <button
            onClick={handleClearAllSongs}
            disabled={isClearing || songs.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 bg-red-600/25 hover:bg-red-600/40 text-red-300 rounded-lg text-[11px] font-semibold border border-red-500/40 transition-all disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Library</span>
          </button>
        </div>

        {clearSuccess && (
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 pt-0.5">
            <CheckCircle2 className="w-3 h-3" />
            <span>Cache successfully cleared!</span>
          </div>
        )}

        {clearAllSuccess && (
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 pt-0.5">
            <CheckCircle2 className="w-3 h-3" />
            <span>All songs removed from library! Playlists preserved.</span>
          </div>
        )}
      </div>

      {/* App Info & Offline Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
        <div 
          className="p-3 border rounded-xl space-y-1 shadow-sm"
          style={{ 
            backgroundColor: `${themeConfig.surfaceDark}80`,
            borderColor: themeConfig.surfaceBorder 
          }}
        >
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <p className="text-xs font-bold text-white">100% Offline Ready</p>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            All downloaded songs & metadata are stored locally in your browser storage. You can play your library anytime without internet.
          </p>
        </div>

        <div 
          className="p-3 border rounded-xl space-y-1 shadow-sm"
          style={{ 
            backgroundColor: `${themeConfig.surfaceDark}80`,
            borderColor: themeConfig.surfaceBorder 
          }}
        >
          <div className="flex items-center gap-1.5" style={{ color: themeConfig.accent }}>
            <Sparkles className="w-4 h-4" />
            <p className="text-xs font-bold text-white">MR Music Audio Suite</p>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Featuring 5-Band DSP Audio Equalizer, dynamic romance presets, and instant MP3 importer.
          </p>
        </div>
      </div>
    </div>
  );
};
