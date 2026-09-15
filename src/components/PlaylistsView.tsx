import React, { useState } from 'react';
import { Plus, Play, HardDrive, Sparkles, ChevronRight, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Playlist } from '../types';

export const PlaylistsView: React.FC = () => {
  const { playlists, songs, playSong, createPlaylist, downloadSong, themeConfig } = useMusic();

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newPlName, setNewPlName] = useState<string>('');
  const [newPlDesc, setNewPlDesc] = useState<string>('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlName.trim()) return;
    await createPlaylist(newPlName, newPlDesc || 'Custom Telugu Mix');
    setNewPlName('');
    setNewPlDesc('');
    setIsCreating(false);
  };

  const syncPlaylistOffline = (playlist: Playlist) => {
    const playlistSongs = songs.filter((s) => playlist.songIds.includes(s.id));
    playlistSongs.forEach((song) => {
      if (!song.isDownloaded) {
        downloadSong(song);
      }
    });
  };

  if (selectedPlaylist) {
    const playlistSongs = songs.filter((s) => selectedPlaylist.songIds.includes(s.id));

    return (
      <div id="playlist-detail-view" className="space-y-3 pb-24 pt-1">
        {/* Back navigation */}
        <button
          onClick={() => setSelectedPlaylist(null)}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white py-0.5 cursor-pointer"
        >
          <span>← Back to all playlists</span>
        </button>

        {/* Playlist Header Card */}
        <div 
          className="border rounded-2xl p-3.5 flex items-start gap-3 shadow-lg"
          style={{ 
            backgroundColor: `${themeConfig.surfaceDark}e6`,
            borderColor: themeConfig.surfaceBorder 
          }}
        >
          <div 
            className="w-18 h-18 rounded-xl overflow-hidden shadow-md shrink-0 border"
            style={{ borderColor: themeConfig.surfaceBorder }}
          >
            <img
              src={selectedPlaylist.coverArt}
              alt={selectedPlaylist.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[9px] uppercase font-bold tracking-wider" style={{ color: themeConfig.accent }}>
                Curated Mix
              </span>
            </div>
            <h2 className="text-sm font-bold text-white truncate">{selectedPlaylist.name}</h2>
            <p className="text-[10px] text-slate-400 line-clamp-2">{selectedPlaylist.description}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  if (playlistSongs.length > 0) playSong(playlistSongs[0]);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 bg-gradient-to-tr ${themeConfig.gradient} text-white rounded-lg text-[11px] font-semibold shadow transition-all cursor-pointer`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Play All</span>
              </button>
              <button
                onClick={() => syncPlaylistOffline(selectedPlaylist)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/15 text-slate-200 rounded-lg text-[11px] font-medium border border-white/10 transition-all cursor-pointer"
                title="Download all songs in this playlist for offline use"
              >
                <HardDrive className="w-3 h-3 text-slate-300" />
                <span>Save Offline</span>
              </button>
            </div>
          </div>
        </div>

        {/* Songs in this playlist */}
        <div className="space-y-1.5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Tracks ({playlistSongs.length})
          </h3>

          {playlistSongs.length === 0 ? (
            <div 
              className="p-5 text-center rounded-xl border space-y-1.5"
              style={{ 
                backgroundColor: `${themeConfig.surfaceDark}80`,
                borderColor: themeConfig.surfaceBorder 
              }}
            >
              <Music className="w-6 h-6 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-300">No tracks in this playlist yet</p>
            </div>
          ) : (
            playlistSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => playSong(song)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between gap-2.5 cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div 
                    className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border"
                    style={{ borderColor: themeConfig.surfaceBorder }}
                  >
                    <img src={song.albumArt} alt={song.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-white">{song.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 shrink-0">
                  {song.isDownloaded && (
                    <span 
                      className="text-[9px] px-1.5 py-0.2 rounded border"
                      style={{ 
                        backgroundColor: themeConfig.badgeBg, 
                        color: themeConfig.badgeText, 
                        borderColor: themeConfig.surfaceBorder 
                      }}
                    >
                      Offline
                    </span>
                  )}
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-white fill-current" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="playlists-view" className="space-y-3 pb-24 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Playlists & Collections</h2>
          <p className="text-[10px] text-slate-400">Curated Telugu mixes</p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          id="btn-create-playlist"
          className={`flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-tr ${themeConfig.gradient} text-white rounded-xl text-[11px] font-semibold shadow transition-all cursor-pointer`}
        >
          <Plus className="w-3 h-3" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Create form */}
      {isCreating && (
        <form 
          onSubmit={handleCreate} 
          className="border rounded-2xl p-3.5 space-y-2.5 shadow-xl"
          style={{ 
            backgroundColor: `${themeConfig.surfaceDark}fa`,
            borderColor: themeConfig.surfaceBorder 
          }}
        >
          <h3 className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" style={{ color: themeConfig.accent }} />
            <span>Create Custom Playlist</span>
          </h3>
          <input
            type="text"
            required
            value={newPlName}
            onChange={(e) => setNewPlName(e.target.value)}
            placeholder="Playlist Name (e.g. Melodies & Chill)"
            className="w-full px-2.5 py-1.5 bg-black/50 rounded-xl border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <input
            type="text"
            value={newPlDesc}
            onChange={(e) => setNewPlDesc(e.target.value)}
            placeholder="Description note..."
            className="w-full px-2.5 py-1.5 bg-black/50 rounded-xl border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-3 py-1 bg-gradient-to-tr ${themeConfig.gradient} text-white text-[11px] font-bold rounded-lg shadow cursor-pointer`}
            >
              Save Playlist
            </button>
          </div>
        </form>
      )}

      {/* Playlists Cards */}
      <div className="space-y-2">
        {playlists.map((playlist) => {
          const songCount = playlist.songIds.length;

          return (
            <div
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
              className="p-2.5 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer group transition-all shadow-sm hover:bg-white/5"
              style={{ 
                backgroundColor: `${themeConfig.surfaceDark}80`,
                borderColor: themeConfig.surfaceBorder 
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div 
                  className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border bg-black"
                  style={{ borderColor: themeConfig.surfaceBorder }}
                >
                  <img
                    src={playlist.coverArt}
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-bold text-white truncate group-hover:text-slate-200 transition-colors">
                    {playlist.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{playlist.description}</p>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                    <span>{songCount} {songCount === 1 ? 'Song' : 'Songs'}</span>
                    {playlist.isOfflineSynced && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5" style={{ color: themeConfig.accent }}>
                          <HardDrive className="w-2.5 h-2.5" />
                          <span>Offline Ready</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 text-slate-400 group-hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
