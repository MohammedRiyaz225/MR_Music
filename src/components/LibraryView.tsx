import React, { useState } from 'react';
import {
  Search,
  Plus,
  Play,
  Pause,
  Download,
  CheckCircle2,
  HardDrive,
  Heart,
  Music,
  Sparkles,
  RefreshCw,
  Shuffle
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Song } from '../types';

export const LibraryView: React.FC = () => {
  const {
    songs,
    currentSong,
    isPlaying,
    isAirplaneMode,
    downloadingSongIds,
    playSong,
    togglePlayPause,
    downloadSong,
    toggleFavorite,
    deleteDownload,
    setIsUploadModalOpen,
    themeConfig
  } = useMusic();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'romance' | 'downloaded' | 'favorites'>('all');

  // Filter songs based on search & tab
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.movie && song.movie.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'downloaded') return song.isDownloaded;
    if (activeFilter === 'romance') return song.category === 'Telugu Romance';
    if (activeFilter === 'favorites') return song.isFavorite;

    return true;
  });

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const playShuffleMix = () => {
    const pool = activeFilter === 'all' ? songs : filteredSongs;
    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      playSong(pool[randomIndex]);
    }
  };

  return (
    <div id="library-view" className="space-y-3 pb-24 pt-1">
      {/* Featured Header Card */}
      <div 
        className="relative overflow-hidden rounded-2xl p-3.5 border shadow-lg transition-all"
        style={{ 
          backgroundColor: `${themeConfig.surfaceDark}e6`,
          borderColor: themeConfig.surfaceBorder 
        }}
      >
        <div 
          className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20"
          style={{ backgroundColor: themeConfig.primary }}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shrink-0 border relative group"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <img 
                src="/app-icon.png" 
                alt="MR Music App Cover" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl pointer-events-none" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color: themeConfig.accent }}>
                <Sparkles className="w-3 h-3 shrink-0" />
                <span className="truncate">MR Music Telugu Romance</span>
              </div>
              <h2 className="text-sm font-bold text-white tracking-tight truncate">
                Telugu Music & Melodies
              </h2>
              <p className="text-[10px] text-slate-300/80 italic line-clamp-1">
                Offline High-Fidelity DSP & Custom Player
              </p>
            </div>
          </div>

          <button
            onClick={playShuffleMix}
            disabled={songs.length === 0}
            className={`flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-tr ${themeConfig.gradient} text-white rounded-xl text-[11px] font-semibold shadow-md active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-40`}
          >
            <Shuffle className="w-3 h-3" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Search Header */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs, artists, movies..."
          id="input-library-search"
          className="w-full pl-9 pr-3.5 py-1.5 bg-black/40 border rounded-xl text-xs text-white placeholder-slate-400/60 focus:outline-none transition-all shadow-inner"
          style={{ borderColor: themeConfig.surfaceBorder }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'text-white shadow-sm font-bold'
              : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
          style={activeFilter === 'all' ? { backgroundColor: themeConfig.primary } : {}}
        >
          All ({songs.length})
        </button>

        <button
          onClick={() => setActiveFilter('romance')}
          className={`px-2.5 py-1 rounded-lg font-medium shrink-0 flex items-center gap-1 transition-all cursor-pointer ${
            activeFilter === 'romance'
              ? 'text-white shadow-sm font-bold'
              : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
          style={activeFilter === 'romance' ? { backgroundColor: themeConfig.primary } : {}}
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>Romance</span>
        </button>

        <button
          onClick={() => setActiveFilter('favorites')}
          className={`px-2.5 py-1 rounded-lg font-medium shrink-0 flex items-center gap-1 transition-all cursor-pointer ${
            activeFilter === 'favorites'
              ? 'text-white shadow-sm font-bold'
              : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
          style={activeFilter === 'favorites' ? { backgroundColor: themeConfig.primary } : {}}
        >
          <Heart className="w-2.5 h-2.5 fill-current" />
          <span>Favorites ({songs.filter((s) => s.isFavorite).length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('downloaded')}
          className={`px-2.5 py-1 rounded-lg font-medium shrink-0 flex items-center gap-1 transition-all cursor-pointer ${
            activeFilter === 'downloaded'
              ? 'text-white shadow-sm font-bold'
              : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
          style={activeFilter === 'downloaded' ? { backgroundColor: themeConfig.primary } : {}}
        >
          <HardDrive className="w-2.5 h-2.5" />
          <span>Offline ({songs.filter((s) => s.isDownloaded).length})</span>
        </button>
      </div>

      {/* Offline Mode Alert when active */}
      {isAirplaneMode && (
        <div 
          className="p-2 rounded-xl flex items-center justify-between text-[11px] border"
          style={{ 
            backgroundColor: themeConfig.badgeBg, 
            color: themeConfig.badgeText, 
            borderColor: themeConfig.surfaceBorder 
          }}
        >
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 shrink-0" />
            <span>Airplane Mode active: Playing offline cache</span>
          </div>
          <span className="font-bold text-[9px] px-1.5 py-0.2 rounded bg-black/40 border border-white/10">
            100% Offline
          </span>
        </div>
      )}

      {/* Song List Header & Add Button */}
      <div className="flex items-center justify-between pt-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <span>{filteredSongs.length} {filteredSongs.length === 1 ? 'Track' : 'Tracks'}</span>
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            id="btn-add-song-library"
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-[11px] font-medium border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Exact MP3</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            id="btn-spotify-import-library"
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Spotify Hits</span>
          </button>
        </div>
      </div>

      {/* Song Cards */}
      <div className="space-y-1.5">
        {filteredSongs.length === 0 ? (
          <div 
            className="text-center py-8 rounded-2xl border p-5 space-y-2"
            style={{ 
              backgroundColor: `${themeConfig.surfaceDark}b3`,
              borderColor: themeConfig.surfaceBorder 
            }}
          >
            <Music className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-200">No tracks match your query</p>
            <p className="text-[10px] text-slate-400">Try searching or uploading a new audio file</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className={`px-3 py-1.5 bg-gradient-to-tr ${themeConfig.gradient} text-white text-[11px] font-bold rounded-lg shadow cursor-pointer`}
            >
              Upload Audio File
            </button>
          </div>
        ) : (
          filteredSongs.map((song) => {
            const isThisPlaying = isPlaying && currentSong?.id === song.id;
            const isThisCurrent = currentSong?.id === song.id;
            const downloadProgress = downloadingSongIds[song.id];

            return (
              <div
                key={song.id}
                id={`song-row-${song.id}`}
                className={`relative group p-2 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                  isThisCurrent
                    ? 'shadow-md ring-1'
                    : 'hover:bg-white/5 border-white/5'
                }`}
                style={
                  isThisCurrent
                    ? {
                        backgroundColor: `${themeConfig.surfaceDark}fa`,
                        borderColor: themeConfig.primary,
                        boxShadow: `0 0 12px ${themeConfig.glowColor}`
                      }
                    : {
                        backgroundColor: `${themeConfig.surfaceDark}80`
                      }
                }
              >
                {/* Clickable Play Region */}
                <div
                  onClick={() => {
                    if (isThisCurrent) {
                      togglePlayPause();
                    } else {
                      playSong(song);
                    }
                  }}
                  className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                >
                  {/* Thumbnail & Play Overlay */}
                  <div 
                    className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm shrink-0 border bg-black"
                    style={{ borderColor: themeConfig.surfaceBorder }}
                  >
                    <img
                      src={song.albumArt}
                      alt={song.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div
                      className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                        isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 text-white fill-current" />
                      ) : (
                        <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Title, Artist, Movie */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isThisCurrent ? 'text-white font-bold' : 'text-slate-200'
                        }`}
                        style={isThisCurrent ? { color: themeConfig.accent } : {}}
                      >
                        {song.title}
                      </p>
                      {song.movie && (
                        <span 
                          className="text-[9px] px-1.5 py-0.1 rounded font-medium shrink-0 border border-white/10"
                          style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: themeConfig.badgeText }}
                        >
                          {song.movie}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{song.artist}</p>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 mt-0.5">
                      <span>{formatDuration(song.duration)}</span>
                      <span>•</span>
                      <span>{song.fileSizeMb} MB</span>
                      {song.category === 'Telugu Romance' && (
                        <span className="font-medium flex items-center gap-0.5" style={{ color: themeConfig.accent }}>
                          <span>•</span>
                          <span>Romance</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions: Favorite & Download status */}
                <div className="flex items-center gap-0.5 shrink-0">
                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(song.id)}
                    className="p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Favorite"
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 ${song.isFavorite ? 'fill-current' : 'text-slate-500 hover:text-slate-300'}`} 
                      style={{ color: song.isFavorite ? themeConfig.accent : undefined }}
                    />
                  </button>

                  {/* Download Status Button */}
                  {downloadProgress !== undefined ? (
                    <div 
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono border"
                      style={{ backgroundColor: themeConfig.badgeBg, color: themeConfig.badgeText, borderColor: themeConfig.surfaceBorder }}
                    >
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      <span>{downloadProgress}%</span>
                    </div>
                  ) : song.isDownloaded ? (
                    <button
                      onClick={() => deleteDownload(song.id)}
                      className="p-1.5 rounded-lg transition-colors cursor-pointer"
                      style={{ color: themeConfig.accent }}
                      title="Downloaded (Click to delete from offline cache)"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => downloadSong(song)}
                      className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Download to Local Storage"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
