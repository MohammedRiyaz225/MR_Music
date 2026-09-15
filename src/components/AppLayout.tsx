import React, { useState } from 'react';
import {
  Music2,
  ListMusic,
  Heart,
  HardDrive,
  Palette,
  Sliders,
  Plus,
  Search,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Maximize2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { TabType, AppTheme } from '../types';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    playbackMode,
    volume,
    setIsPlayerModalOpen,
    setIsEqualizerModalOpen,
    setIsUploadModalOpen,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setPlaybackMode,
    toggleFavorite,
    setVolume,
    theme,
    themeConfig,
    setTheme,
    songs,
    playlists
  } = useMusic();

  const [isThemePickerOpen, setIsThemePickerOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [prevVolume, setPrevVolume] = useState<number>(volume);

  const themeList: { id: AppTheme; name: string; color: string; desc: string }[] = [
    { id: 'amethyst', name: 'Amethyst', color: '#a855f7', desc: 'Cosmic Violet' },
    { id: 'sapphire', name: 'Sapphire', color: '#3b82f6', desc: 'Midnight Blue' },
    { id: 'emerald', name: 'Emerald', color: '#10b981', desc: 'Lush Jade' },
    { id: 'amber', name: 'Amber', color: '#f59e0b', desc: 'Warm Sunset' },
    { id: 'crimson', name: 'Ruby', color: '#f43f5e', desc: 'Velvet Rose' },
    { id: 'obsidian', name: 'Obsidian', color: '#a1a1aa', desc: 'Titanium Dark' }
  ];

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume > 0 ? prevVolume : 0.8);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const toggleRepeat = () => {
    if (playbackMode === 'repeat-off') setPlaybackMode('repeat-all');
    else if (playbackMode === 'repeat-all') setPlaybackMode('repeat-one');
    else if (playbackMode === 'repeat-one') setPlaybackMode('shuffle');
    else setPlaybackMode('repeat-off');
  };

  const downloadedCount = songs.filter((s) => s.isDownloaded).length;

  return (
    <div
      className="min-h-screen w-full flex flex-col text-slate-100 select-none relative overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: themeConfig.bgDark }}
    >
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 transition-all duration-700"
          style={{ backgroundColor: themeConfig.primary }}
        />
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 transition-all duration-700"
          style={{ backgroundColor: themeConfig.accent }}
        />
      </div>

      {/* Main Layout Body: Sidebar + Main Content Outlet */}
      <div className="flex-1 flex flex-row w-full z-10 relative overflow-hidden pb-24 md:pb-24">
        {/* Desktop / Tablet Left Sidebar Navigation */}
        <aside
          className="hidden md:flex flex-col justify-between w-64 shrink-0 border-r p-4 backdrop-blur-2xl transition-colors duration-300 z-20"
          style={{
            backgroundColor: `${themeConfig.surfaceDark}e6`,
            borderColor: themeConfig.surfaceBorder
          }}
        >
          {/* Brand Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-lg border shrink-0 group"
                  style={{ borderColor: themeConfig.surfaceBorder }}
                >
                  <img
                    src="/app-icon.png"
                    alt="MR Music App Logo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div
                    className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl pointer-events-none"
                  />
                </div>
                <div>
                  <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                    <span>MR Music</span>
                  </h1>
                  <p className="text-[11px] font-medium" style={{ color: themeConfig.accent }}>
                    Romantic & Melodies
                  </p>
                </div>
              </div>
            </div>

            {/* Main Navigation Links */}
            <nav className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                Menu
              </p>

              <button
                onClick={() => setActiveTab('library')}
                id="sidebar-nav-library"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'library'
                    ? 'text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                style={
                  activeTab === 'library'
                    ? { backgroundColor: themeConfig.primary, boxShadow: `0 0 16px ${themeConfig.glowColor}` }
                    : {}
                }
              >
                <Music2 className="w-4 h-4" />
                <span>Songs & Library</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 font-mono">
                  {songs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('playlists')}
                id="sidebar-nav-playlists"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'playlists'
                    ? 'text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                style={
                  activeTab === 'playlists'
                    ? { backgroundColor: themeConfig.primary, boxShadow: `0 0 16px ${themeConfig.glowColor}` }
                    : {}
                }
              >
                <ListMusic className="w-4 h-4" />
                <span>Playlists</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 font-mono">
                  {playlists.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('storage')}
                id="sidebar-nav-storage"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'storage'
                    ? 'text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                style={
                  activeTab === 'storage'
                    ? { backgroundColor: themeConfig.primary, boxShadow: `0 0 16px ${themeConfig.glowColor}` }
                    : {}
                }
              >
                <HardDrive className="w-4 h-4" />
                <span>Storage & Offline</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 font-mono">
                  {downloadedCount}
                </span>
              </button>
            </nav>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                Audio Actions
              </p>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                id="sidebar-btn-upload"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" style={{ color: themeConfig.accent }} />
                <span>Add Audio / MP3</span>
              </button>

              <button
                onClick={() => setIsEqualizerModalOpen(true)}
                id="sidebar-btn-eq"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4" style={{ color: themeConfig.accent }} />
                <span>5-Band Equalizer</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer: Theme Color Selector & Storage Status */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            {/* Theme Picker */}
            <div className="relative">
              <button
                onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                id="sidebar-theme-btn"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" style={{ color: themeConfig.accent }} />
                  <span className="text-slate-200">Theme Color</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: themeConfig.primary }} />
                  <span className="text-[11px] text-slate-400 font-semibold">{themeConfig.name.split(' ')[0]}</span>
                </div>
              </button>

              {isThemePickerOpen && (
                <div
                  className="absolute bottom-full left-0 right-0 mb-2 p-2.5 rounded-2xl bg-[#110e1e] border border-white/15 shadow-2xl space-y-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <p className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                    Select Theme
                  </p>
                  <div className="space-y-1">
                    {themeList.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setIsThemePickerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          theme === t.id ? 'bg-white/15 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                          <span>{t.name}</span>
                        </div>
                        {theme === t.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Offline Storage Status */}
            <div
              className="p-2.5 rounded-xl border flex items-center justify-between text-[11px]"
              style={{
                backgroundColor: `${themeConfig.surfaceDark}b3`,
                borderColor: themeConfig.surfaceBorder
              }}
            >
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 font-medium">Offline Storage</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">
                {downloadedCount} Tracks
              </span>
            </div>
          </div>
        </aside>

        {/* Main Center Outlet Container */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* Top Header Bar for Desktop & Mobile */}
          <header
            className="sticky top-0 z-20 backdrop-blur-xl border-b px-4 py-2.5 sm:px-6 flex items-center justify-between transition-colors duration-300"
            style={{
              backgroundColor: `${themeConfig.surfaceDark}e6`,
              borderColor: themeConfig.surfaceBorder
            }}
          >
            {/* Left: Mobile Brand & Active View Title */}
            <div className="flex items-center gap-2.5">
              <div
                className="md:hidden w-8 h-8 rounded-xl overflow-hidden shadow border shrink-0"
                style={{ borderColor: themeConfig.surfaceBorder }}
              >
                <img src="/app-icon.png" alt="App Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight capitalize">
                  {activeTab === 'library'
                    ? 'Telugu Melodies & Songs'
                    : activeTab === 'playlists'
                    ? 'Playlists & Collections'
                    : 'Storage & Audio Settings'}
                </h2>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Personal offline & streaming Telugu audio player
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-2">
              {/* Theme Dropdown on Mobile */}
              <div className="relative md:hidden">
                <button
                  onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all cursor-pointer"
                  title="Theme Palette"
                >
                  <Palette className="w-4 h-4" style={{ color: themeConfig.accent }} />
                </button>

                {isThemePickerOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 p-2 rounded-2xl bg-[#110e1e] border border-white/15 shadow-2xl space-y-1 z-50 min-w-[140px]"
                  >
                    {themeList.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setIsThemePickerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-xl text-xs cursor-pointer ${
                          theme === t.id ? 'bg-white/15 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                          <span>{t.name}</span>
                        </div>
                        {theme === t.id && <Check className="w-3 h-3 text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5-Band Equalizer Quick Launch */}
              <button
                onClick={() => setIsEqualizerModalOpen(true)}
                id="header-btn-eq"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all text-xs font-semibold cursor-pointer"
                title="Open 5-Band DSP Equalizer"
              >
                <Sliders className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
                <span className="hidden sm:inline">DSP EQ</span>
              </button>

              {/* Add MP3 / Spotify Hits */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                id="header-btn-add"
                className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-tr ${themeConfig.gradient} text-white rounded-xl text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Songs</span>
              </button>
            </div>
          </header>

          {/* Main Outlet Scrollable Content */}
          <main className="flex-1 px-3 sm:px-6 py-4 max-w-6xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Desktop / Large Screen Persistent Bottom Music Player Bar */}
      {currentSong && (
        <div
          id="desktop-player-bar"
          className="hidden md:flex fixed bottom-0 left-0 right-0 h-22 backdrop-blur-2xl border-t px-6 items-center justify-between z-30 shadow-2xl transition-colors duration-300"
          style={{
            backgroundColor: `${themeConfig.surfaceDark}fa`,
            borderColor: themeConfig.surfaceBorder
          }}
        >
          {/* Left: Track Information */}
          <div className="flex items-center gap-3.5 w-1/4 min-w-[200px] max-w-[280px]">
            <div
              onClick={() => setIsPlayerModalOpen(true)}
              className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md shrink-0 border cursor-pointer group"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <img
                src={currentSong.albumArt}
                alt={currentSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p
                onClick={() => setIsPlayerModalOpen(true)}
                className="text-xs font-bold text-white truncate cursor-pointer hover:underline"
                style={{ color: isPlaying ? themeConfig.accent : '#ffffff' }}
              >
                {currentSong.title}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{currentSong.artist}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {currentSong.isDownloaded ? (
                  <span
                    className="text-[9px] px-1.5 py-0.1 rounded font-medium border"
                    style={{
                      backgroundColor: themeConfig.badgeBg,
                      color: themeConfig.badgeText,
                      borderColor: themeConfig.surfaceBorder
                    }}
                  >
                    Offline
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.1 rounded bg-blue-500/15 text-blue-300 font-medium border border-blue-500/20">
                    Stream
                  </span>
                )}
                {currentSong.movie && (
                  <span className="text-[9px] text-slate-500 truncate">• {currentSong.movie}</span>
                )}
              </div>
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(currentSong.id)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Favorite"
            >
              <Heart
                className={`w-4 h-4 ${
                  currentSong.isFavorite ? 'fill-current' : 'text-slate-400 hover:text-white'
                }`}
                style={{ color: currentSong.isFavorite ? themeConfig.accent : undefined }}
              />
            </button>
          </div>

          {/* Center: Playback Controls & Progress Scrubber */}
          <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
            {/* Buttons Row */}
            <div className="flex items-center gap-4">
              {/* Repeat / Shuffle Mode */}
              <button
                onClick={toggleRepeat}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  playbackMode !== 'repeat-off' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                style={playbackMode !== 'repeat-off' ? { color: themeConfig.accent } : {}}
                title={`Playback Mode: ${playbackMode}`}
              >
                {playbackMode === 'shuffle' ? (
                  <Shuffle className="w-4 h-4" />
                ) : playbackMode === 'repeat-one' ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </button>

              {/* Previous */}
              <button
                onClick={playPrevious}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Play / Pause Giant Button */}
              <button
                onClick={togglePlayPause}
                className={`w-9 h-9 rounded-full bg-gradient-to-tr ${themeConfig.gradient} text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer`}
                style={{ boxShadow: `0 0 16px ${themeConfig.glowColor}` }}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={playNext}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber & Duration */}
            <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-slate-400">
              <span className="w-9 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercent || 0}
                onChange={handleSeek}
                className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: themeConfig.primary }}
              />
              <span className="w-9 text-left">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume & Audio Equalizer & Full Player expander */}
          <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
            {/* 5-Band Equalizer */}
            <button
              onClick={() => setIsEqualizerModalOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Open 5-Band DSP Equalizer"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-white cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: themeConfig.primary }}
              />
            </div>

            {/* Full Screen Expand Button */}
            <button
              onClick={() => setIsPlayerModalOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Immersive Vinyl & Lyrics Player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 backdrop-blur-xl border-t px-4 py-2 flex items-center justify-around text-xs shadow-2xl transition-colors duration-300"
        style={{
          backgroundColor: `${themeConfig.surfaceDark}f2`,
          borderColor: themeConfig.surfaceBorder
        }}
      >
        <button
          onClick={() => setActiveTab('library')}
          id="mobile-nav-library"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'library' ? 'font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          style={activeTab === 'library' ? { color: themeConfig.accent } : {}}
        >
          <Music2 className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Songs</span>
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          id="mobile-nav-playlists"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'playlists' ? 'font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          style={activeTab === 'playlists' ? { color: themeConfig.accent } : {}}
        >
          <ListMusic className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Playlists</span>
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          id="mobile-nav-storage"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'storage' ? 'font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          style={activeTab === 'storage' ? { color: themeConfig.accent } : {}}
        >
          <HardDrive className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Storage</span>
        </button>
      </nav>
    </div>
  );
};
