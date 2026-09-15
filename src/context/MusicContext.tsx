import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Song, Playlist, EqualizerPreset, PlaybackMode, StorageStats, AppTheme, ThemeConfig } from '../types';
import { dbHelper } from '../services/db';
import { audioEngine } from '../services/audioEngine';

export const APP_THEMES: Record<AppTheme, ThemeConfig> = {
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst Violet',
    primary: '#a855f7',
    accent: '#c084fc',
    bgDark: '#0b0616',
    surfaceDark: '#130a24',
    surfaceBorder: 'rgba(168, 85, 247, 0.25)',
    badgeBg: 'rgba(168, 85, 247, 0.18)',
    badgeText: '#d8b4fe',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    gradient: 'from-purple-600 via-indigo-600 to-violet-500',
    visualizerColor: '#c084fc'
  },
  sapphire: {
    id: 'sapphire',
    name: 'Midnight Sapphire',
    primary: '#3b82f6',
    accent: '#60a5fa',
    bgDark: '#040a17',
    surfaceDark: '#09152b',
    surfaceBorder: 'rgba(59, 130, 246, 0.25)',
    badgeBg: 'rgba(59, 130, 246, 0.18)',
    badgeText: '#93c5fd',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    visualizerColor: '#38bdf8'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Melody',
    primary: '#10b981',
    accent: '#34d399',
    bgDark: '#03110d',
    surfaceDark: '#07211a',
    surfaceBorder: 'rgba(16, 185, 129, 0.25)',
    badgeBg: 'rgba(16, 185, 129, 0.18)',
    badgeText: '#6ee7b7',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    visualizerColor: '#10b981'
  },
  amber: {
    id: 'amber',
    name: 'Sunset Amber',
    primary: '#f59e0b',
    accent: '#fbbf24',
    bgDark: '#130b03',
    surfaceDark: '#221507',
    surfaceBorder: 'rgba(245, 158, 11, 0.25)',
    badgeBg: 'rgba(245, 158, 11, 0.18)',
    badgeText: '#fde68a',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    gradient: 'from-amber-600 via-orange-600 to-yellow-500',
    visualizerColor: '#f59e0b'
  },
  crimson: {
    id: 'crimson',
    name: 'Ruby Velvet',
    primary: '#e11d48',
    accent: '#f43f5e',
    bgDark: '#120409',
    surfaceDark: '#200712',
    surfaceBorder: 'rgba(225, 29, 72, 0.25)',
    badgeBg: 'rgba(225, 29, 72, 0.18)',
    badgeText: '#fda4af',
    glowColor: 'rgba(225, 29, 72, 0.4)',
    gradient: 'from-rose-600 via-pink-600 to-red-500',
    visualizerColor: '#f43f5e'
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Minimal',
    primary: '#71717a',
    accent: '#e4e4e7',
    bgDark: '#09090b',
    surfaceDark: '#18181b',
    surfaceBorder: 'rgba(255, 255, 255, 0.18)',
    badgeBg: 'rgba(255, 255, 255, 0.12)',
    badgeText: '#f4f4f5',
    glowColor: 'rgba(255, 255, 255, 0.2)',
    gradient: 'from-zinc-700 via-stone-700 to-zinc-600',
    visualizerColor: '#a1a1aa'
  }
};

export const EQUALIZER_PRESETS: EqualizerPreset[] = [
  {
    name: 'Telugu Romance',
    bands: [3, 2, 4, 3, 2], // Enhanced warm vocals & acoustic clarity
    bassBoost: 45,
    surround: 60
  },
  {
    name: 'Deep Bass Boost',
    bands: [8, 6, 1, -1, 2],
    bassBoost: 90,
    surround: 30
  },
  {
    name: 'Vocal Clarity',
    bands: [-2, 1, 6, 7, 3],
    bassBoost: 15,
    surround: 40
  },
  {
    name: 'Acoustic Unplugged',
    bands: [2, 3, 2, 4, 5],
    bassBoost: 25,
    surround: 50
  },
  {
    name: 'Electronic / Club',
    bands: [6, 4, -2, 3, 6],
    bassBoost: 75,
    surround: 80
  },
  {
    name: 'Flat / Studio',
    bands: [0, 0, 0, 0, 0],
    bassBoost: 0,
    surround: 0
  }
];

interface MusicContextType {
  songs: Song[];
  playlists: Playlist[];
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackMode: PlaybackMode;
  isAirplaneMode: boolean; // Simulates 100% offline
  downloadingSongIds: Record<string, number>; // songId -> progress 0-100
  activeEqualizer: EqualizerPreset;
  playbackSpeed: number;
  volume: number;
  storageStats: StorageStats;
  isPlayerModalOpen: boolean;
  isEqualizerModalOpen: boolean;
  isUploadModalOpen: boolean;
  theme: AppTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: AppTheme) => void;
  
  // Actions
  playSong: (song: Song) => Promise<void>;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (seconds: number) => void;
  setPlaybackMode: (mode: PlaybackMode) => void;
  toggleFavorite: (songId: string) => void;
  toggleAirplaneMode: () => void;
  downloadSong: (song: Song) => Promise<void>;
  deleteDownload: (songId: string) => Promise<void>;
  clearCache: () => Promise<void>;
  clearAllSongs: () => Promise<void>;
  addCustomSong: (song: Omit<Song, 'id' | 'addedAt'>, audioBlob?: Blob) => Promise<void>;
  createPlaylist: (name: string, description: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  setEqualizerPreset: (preset: EqualizerPreset) => void;
  updateCustomEqualizerBands: (bands: [number, number, number, number, number], bassBoost: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setVolume: (vol: number) => void;
  setIsPlayerModalOpen: (open: boolean) => void;
  setIsEqualizerModalOpen: (open: boolean) => void;
  setIsUploadModalOpen: (open: boolean) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('repeat-all');
  const [isAirplaneMode, setIsAirplaneMode] = useState<boolean>(false);
  const [downloadingSongIds, setDownloadingSongIds] = useState<Record<string, number>>({});
  const [activeEqualizer, setActiveEqualizer] = useState<EqualizerPreset>(EQUALIZER_PRESETS[0]);
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(1.0);
  const [volume, setVolumeState] = useState<number>(0.85);

  // Modals
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState<boolean>(false);
  const [isEqualizerModalOpen, setIsEqualizerModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Theme state (default: amethyst - modern cosmic violet / deep indigo)
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('mr_music_theme');
    return (saved && APP_THEMES[saved as AppTheme]) ? (saved as AppTheme) : 'amethyst';
  });

  const setTheme = useCallback((newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('mr_music_theme', newTheme);
  }, []);

  const themeConfig = APP_THEMES[theme] || APP_THEMES.amethyst;

  const currentSongRef = useRef<Song | null>(null);
  currentSongRef.current = currentSong;
  const songsRef = useRef<Song[]>([]);
  songsRef.current = songs;
  const playbackModeRef = useRef<PlaybackMode>(playbackMode);
  playbackModeRef.current = playbackMode;

  // Load initial data from SQLite mirror
  useEffect(() => {
    async function loadData() {
      const loadedSongs = await dbHelper.getLocalSongs();
      const loadedPlaylists = await dbHelper.getPlaylists();
      setSongs(loadedSongs);
      setPlaylists(loadedPlaylists);
      if (loadedSongs.length > 0) {
        setCurrentSong(loadedSongs[0]);
        setDuration(loadedSongs[0].duration);
      }
    }
    loadData();
  }, []);

  // Sync audio element events
  useEffect(() => {
    const audio = audioEngine.getAudioElement();

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      handleSongEnded();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Compute Storage statistics
  const downloadedSongs = songs.filter((s) => s.isDownloaded);
  const usedByAppMb = downloadedSongs.reduce((acc, s) => acc + s.fileSizeMb, 0);
  const storageStats: StorageStats = {
    totalCapacityGb: 128,
    usedByOtherGb: 44.5,
    usedByAppMb: Math.round(usedByAppMb * 10) / 10,
    downloadedSongsCount: downloadedSongs.length,
    freeSpaceGb: Math.round((128 - 44.5 - usedByAppMb / 1024) * 10) / 10
  };

  // Play a song
  const playSong = useCallback(async (song: Song) => {
    setCurrentSong(song);
    setDuration(song.duration);
    setCurrentTime(0);

    // Check if song has local offline blob stored in SQLite / IndexedDB
    let playbackSrc = song.audioUrl;
    if (song.isDownloaded) {
      const blob = await dbHelper.getAudioBlob(song.id);
      if (blob) {
        playbackSrc = URL.createObjectURL(blob);
      }
    }

    try {
      await audioEngine.playSong(playbackSrc, song.isDownloaded, song);
      audioEngine.applyEqualizer(activeEqualizer);
      dbHelper.logHistory(song.id);
    } catch {
      // audioEngine handles synth fallback
    }
  }, [activeEqualizer]);

  const togglePlayPause = useCallback(() => {
    const audio = audioEngine.getAudioElement();
    if (audio.paused) {
      if (currentSong) {
        audioEngine.resume();
        setIsPlaying(true);
      } else if (songs.length > 0) {
        playSong(songs[0]);
      }
    } else {
      audioEngine.pause();
      setIsPlaying(false);
    }
  }, [currentSong, songs, playSong]);

  const playNext = useCallback(() => {
    const songList = songsRef.current;
    if (!songList.length) return;

    if (playbackModeRef.current === 'shuffle') {
      const randomIdx = Math.floor(Math.random() * songList.length);
      playSong(songList[randomIdx]);
      return;
    }

    const curr = currentSongRef.current;
    const currIdx = curr ? songList.findIndex((s) => s.id === curr.id) : 0;
    const nextIdx = (currIdx + 1) % songList.length;
    playSong(songList[nextIdx]);
  }, [playSong]);

  const playPrevious = useCallback(() => {
    const songList = songsRef.current;
    if (!songList.length) return;

    const curr = currentSongRef.current;
    const currIdx = curr ? songList.findIndex((s) => s.id === curr.id) : 0;
    const prevIdx = (currIdx - 1 + songList.length) % songList.length;
    playSong(songList[prevIdx]);
  }, [playSong]);

  const handleSongEnded = useCallback(() => {
    if (playbackModeRef.current === 'repeat-one') {
      const audio = audioEngine.getAudioElement();
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      playNext();
    }
  }, [playNext]);

  const seek = useCallback((seconds: number) => {
    audioEngine.seek(seconds);
    setCurrentTime(seconds);
  }, []);

  const toggleFavorite = useCallback(async (songId: string) => {
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id === songId) {
          const updated = { ...s, isFavorite: !s.isFavorite };
          dbHelper.saveSong(updated);
          return updated;
        }
        return s;
      })
    );
    if (currentSongRef.current?.id === songId) {
      setCurrentSong((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  }, []);

  const toggleAirplaneMode = useCallback(() => {
    setIsAirplaneMode((prev) => {
      const nextMode = !prev;
      // If entering airplane mode and current song is NOT downloaded, auto switch to first downloaded song
      if (nextMode) {
        const curr = currentSongRef.current;
        if (curr && !curr.isDownloaded) {
          const firstDownloaded = songsRef.current.find((s) => s.isDownloaded);
          if (firstDownloaded) {
            playSong(firstDownloaded);
          }
        }
      }
      return nextMode;
    });
  }, [playSong]);

  // Simulate chunked real download to phone storage & IndexedDB SQLite mirror
  const downloadSong = useCallback(async (song: Song) => {
    if (song.isDownloaded || downloadingSongIds[song.id] !== undefined) return;

    setDownloadingSongIds((prev) => ({ ...prev, [song.id]: 0 }));

    // Simulate progress increments
    for (let progress = 10; progress <= 100; progress += 15) {
      await new Promise((r) => setTimeout(r, 220));
      setDownloadingSongIds((prev) => ({ ...prev, [song.id]: progress }));
    }

    try {
      // Create local simulated audio blob
      const dummyBuffer = new ArrayBuffer(1024 * 50);
      const audioBlob = new Blob([dummyBuffer], { type: 'audio/mp3' });
      await dbHelper.saveAudioBlob(song.id, audioBlob);

      const localPath = `/storage/emulated/0/Music/${song.title.replace(/\s+/g, '_')}.mp3`;
      const updatedSong: Song = {
        ...song,
        isDownloaded: true,
        localPath
      };

      await dbHelper.saveSong(updatedSong);

      setSongs((prev) => prev.map((s) => (s.id === song.id ? updatedSong : s)));
      if (currentSongRef.current?.id === song.id) {
        setCurrentSong(updatedSong);
      }
    } catch {
      // ignore
    } finally {
      setDownloadingSongIds((prev) => {
        const next = { ...prev };
        delete next[song.id];
        return next;
      });
    }
  }, [downloadingSongIds]);

  const deleteDownload = useCallback(async (songId: string) => {
    await dbHelper.removeLocalDownload(songId);
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, isDownloaded: false, localPath: undefined } : s))
    );
    if (currentSongRef.current?.id === songId) {
      setCurrentSong((prev) => (prev ? { ...prev, isDownloaded: false, localPath: undefined } : null));
    }
  }, []);

  const clearCache = useCallback(async () => {
    await dbHelper.clearDownloadedCache();
    const refreshed = await dbHelper.getLocalSongs();
    setSongs(refreshed);
    if (currentSongRef.current) {
      const updatedCurr = refreshed.find((s) => s.id === currentSongRef.current?.id);
      if (updatedCurr) setCurrentSong(updatedCurr);
    }
  }, []);

  const clearAllSongs = useCallback(async () => {
    await dbHelper.clearAllSongs();
    setSongs([]);
    setCurrentSong(null);
    setIsPlaying(false);
    audioEngine.pause();
  }, []);

  const addCustomSong = useCallback(
    async (songData: Omit<Song, 'id' | 'addedAt'>, audioBlob?: Blob) => {
      const id = `custom_${Date.now()}`;
      const newSong: Song = {
        ...songData,
        id,
        addedAt: new Date().toISOString(),
        isDownloaded: true,
        localPath: `/storage/emulated/0/Music/${songData.title.replace(/\s+/g, '_')}.mp3`
      };

      if (audioBlob) {
        await dbHelper.saveAudioBlob(id, audioBlob);
      } else {
        const dummyBuffer = new ArrayBuffer(1024 * 40);
        const dummyBlob = new Blob([dummyBuffer], { type: 'audio/mp3' });
        await dbHelper.saveAudioBlob(id, dummyBlob);
      }

      await dbHelper.saveSong(newSong);
      setSongs((prev) => [newSong, ...prev]);
      playSong(newSong);
    },
    [playSong]
  );

  const createPlaylist = useCallback(async (name: string, description: string) => {
    const newPl: Playlist = {
      id: `pl_${Date.now()}`,
      name,
      description,
      coverArt: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
      songIds: [],
      isOfflineSynced: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    await dbHelper.savePlaylist(newPl);
    setPlaylists((prev) => [newPl, ...prev]);
  }, []);

  const addSongToPlaylist = useCallback(async (playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId && !pl.songIds.includes(songId)) {
          const updated = { ...pl, songIds: [...pl.songIds, songId] };
          dbHelper.savePlaylist(updated);
          return updated;
        }
        return pl;
      })
    );
  }, []);

  const removeSongFromPlaylist = useCallback(async (playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          const updated = { ...pl, songIds: pl.songIds.filter((id) => id !== songId) };
          dbHelper.savePlaylist(updated);
          return updated;
        }
        return pl;
      })
    );
  }, []);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    await dbHelper.deletePlaylist(playlistId);
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
  }, []);

  const setEqualizerPreset = useCallback((preset: EqualizerPreset) => {
    setActiveEqualizer(preset);
    audioEngine.applyEqualizer(preset);
  }, []);

  const updateCustomEqualizerBands = useCallback(
    (bands: [number, number, number, number, number], bassBoost: number) => {
      const custom: EqualizerPreset = {
        name: 'Custom User EQ',
        bands,
        bassBoost,
        surround: 50
      };
      setActiveEqualizer(custom);
      audioEngine.applyEqualizer(custom);
    },
    []
  );

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeedState(speed);
    audioEngine.setSpeed(speed);
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    audioEngine.setVolume(vol);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        songs,
        playlists,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        playbackMode,
        isAirplaneMode,
        downloadingSongIds,
        activeEqualizer,
        playbackSpeed,
        volume,
        storageStats,
        isPlayerModalOpen,
        isEqualizerModalOpen,
        isUploadModalOpen,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        seek,
        setPlaybackMode,
        toggleFavorite,
        toggleAirplaneMode,
        downloadSong,
        deleteDownload,
        clearCache,
        clearAllSongs,
        addCustomSong,
        createPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        deletePlaylist,
        setEqualizerPreset,
        updateCustomEqualizerBands,
        setPlaybackSpeed,
        setVolume,
        setIsPlayerModalOpen,
        setIsEqualizerModalOpen,
        setIsUploadModalOpen,
        theme,
        themeConfig,
        setTheme
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};
