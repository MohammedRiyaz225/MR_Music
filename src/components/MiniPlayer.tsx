import React from 'react';
import { Play, Pause, SkipForward, Heart, HardDrive, Sliders } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const MiniPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    toggleFavorite,
    setIsPlayerModalOpen,
    setIsEqualizerModalOpen,
    themeConfig
  } = useMusic();

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      id="mini-player-bar"
      className="md:hidden fixed bottom-[54px] left-0 right-0 max-w-lg mx-auto z-30 px-3 pb-1"
    >
      <div 
        className="backdrop-blur-xl border rounded-2xl shadow-xl shadow-black/70 overflow-hidden transition-all duration-300"
        style={{ 
          backgroundColor: `${themeConfig.surfaceDark}f5`,
          borderColor: themeConfig.surfaceBorder 
        }}
      >
        {/* Progress Line */}
        <div className="w-full h-0.5 bg-black/40 relative">
          <div
            className={`h-full bg-gradient-to-r ${themeConfig.gradient} transition-all duration-200`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="p-2 flex items-center justify-between gap-2.5">
          {/* Cover & Track Info (Click to open full player) */}
          <div
            onClick={() => setIsPlayerModalOpen(true)}
            id="mini-player-track-info"
            className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer group"
          >
            <div 
              className="relative w-9 h-9 rounded-lg overflow-hidden shadow-md shrink-0 border transition-colors"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <img
                src={currentSong.albumArt}
                alt={currentSong.title}
                className={`w-full h-full object-cover ${isPlaying ? 'scale-105 transition-transform' : ''}`}
                referrerPolicy="no-referrer"
              />
              {currentSong.isDownloaded && (
                <div
                  className="absolute bottom-0.5 right-0.5 p-0.5 rounded-full text-white shadow"
                  style={{ backgroundColor: themeConfig.primary }}
                  title="Playing from Local Storage"
                >
                  <HardDrive className="w-2 h-2" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-white transition-colors">
                  {currentSong.title}
                </p>
                {currentSong.isDownloaded ? (
                  <span 
                    className="text-[9px] px-1 py-0.1 rounded font-medium shrink-0 border"
                    style={{ 
                      backgroundColor: themeConfig.badgeBg, 
                      color: themeConfig.badgeText, 
                      borderColor: themeConfig.surfaceBorder 
                    }}
                  >
                    Offline
                  </span>
                ) : (
                  <span className="text-[9px] px-1 py-0.1 rounded bg-blue-500/15 text-blue-300 font-medium shrink-0 border border-blue-500/20">
                    Stream
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Quick Equalizer button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEqualizerModalOpen(true);
            }}
            id="btn-mini-eq"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Open Equalizer"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(currentSong.id);
            }}
            id="btn-mini-fav"
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Favorite"
          >
            <Heart 
              className={`w-3.5 h-3.5 ${currentSong.isFavorite ? 'fill-current' : 'text-slate-400 hover:text-slate-200'}`} 
              style={{ color: currentSong.isFavorite ? themeConfig.accent : undefined }}
            />
          </button>

          {/* Play / Pause with Theme Gradient */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            id="btn-mini-playpause"
            className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${themeConfig.gradient} text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          {/* Next Song */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playNext();
            }}
            id="btn-mini-next"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
