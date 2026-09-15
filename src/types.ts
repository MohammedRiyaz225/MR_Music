export interface Song {
  id: string;
  title: string;
  artist: string;
  movie?: string;
  albumArt: string;
  audioUrl: string;
  duration: number; // in seconds
  fileSizeMb: number;
  isDownloaded: boolean;
  localPath?: string; // e.g. /storage/emulated/0/Music/song_1.mp3
  isFavorite?: boolean;
  category: 'Telugu Romance' | 'Melody' | 'Trending' | 'Custom Upload';
  lyrics?: string[];
  melodyNotes?: number[]; // Audio synth notes (MIDI numbers or frequencies)
  year?: number;
  playCount?: number;
  addedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverArt: string;
  songIds: string[];
  isOfflineSynced: boolean;
  createdAt: string;
}

export interface EqualizerPreset {
  name: string;
  bands: [number, number, number, number, number]; // Gains in dB for 60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz (-12dB to +12dB)
  bassBoost: number; // 0 to 100
  surround: number; // 0 to 100
}

export interface StorageStats {
  totalCapacityGb: number;
  usedByOtherGb: number;
  usedByAppMb: number;
  downloadedSongsCount: number;
  freeSpaceGb: number;
}

export type TabType = 'library' | 'playlists' | 'favorites' | 'storage';

export type AppTheme = 'amethyst' | 'sapphire' | 'emerald' | 'amber' | 'crimson' | 'obsidian';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  primary: string;
  accent: string;
  bgDark: string;
  surfaceDark: string;
  surfaceBorder: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  gradient: string;
  visualizerColor: string;
}

export type PlaybackMode = 'repeat-off' | 'repeat-all' | 'repeat-one' | 'shuffle';

export interface HistoryItem {
  songId: string;
  playedAt: string;
}
