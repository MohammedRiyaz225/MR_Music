import { Song, Playlist, HistoryItem, EqualizerPreset } from '../types';
import { INITIAL_SONGS, INITIAL_PLAYLISTS } from '../data/mockSongs';

const DB_NAME = 'mr_music_local_db_v2';
const DB_VERSION = 1;

export class LocalDatabaseHelper {
  private static instance: LocalDatabaseHelper;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private constructor() {
    this.initDB();
  }

  public static getInstance(): LocalDatabaseHelper {
    if (!LocalDatabaseHelper.instance) {
      LocalDatabaseHelper.instance = new LocalDatabaseHelper();
    }
    return LocalDatabaseHelper.instance;
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Songs table
        if (!db.objectStoreNames.contains('songs')) {
          const songStore = db.createObjectStore('songs', { keyPath: 'id' });
          songStore.createIndex('isDownloaded', 'isDownloaded', { unique: false });
          songStore.createIndex('category', 'category', { unique: false });
        }

        // Playlists table
        if (!db.objectStoreNames.contains('playlists')) {
          db.createObjectStore('playlists', { keyPath: 'id' });
        }

        // Audio Blobs store (simulating /storage/emulated/0/Music/*.mp3)
        if (!db.objectStoreNames.contains('audio_files')) {
          db.createObjectStore('audio_files', { keyPath: 'songId' });
        }

        // Playback history
        if (!db.objectStoreNames.contains('history')) {
          const historyStore = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
          historyStore.createIndex('songId', 'songId', { unique: false });
        }

        // Key-Value settings
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // Fetch all songs from local SQLite mirror
  public async getLocalSongs(): Promise<Song[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const transaction = db.transaction('songs', 'readonly');
        const store = transaction.objectStore('songs');
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = () => {
          resolve([]);
        };
      });
    } catch {
      return [];
    }
  }

  public async seedInitialData(): Promise<Song[]> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction(['songs', 'playlists'], 'readwrite');
      const playlistStore = transaction.objectStore('playlists');

      INITIAL_PLAYLISTS.forEach((pl) => playlistStore.put(pl));

      return [];
    } catch {
      return [];
    }
  }

  // Save/Update Song in SQLite
  public async saveSong(song: Song): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('songs', 'readwrite');
      const store = transaction.objectStore('songs');
      const request = store.put(song);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Delete Song
  public async deleteSong(songId: string): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction(['songs', 'audio_files'], 'readwrite');
    transaction.objectStore('songs').delete(songId);
    transaction.objectStore('audio_files').delete(songId);
  }

  // Store Audio Blob into physical storage simulation
  public async saveAudioBlob(songId: string, blob: Blob): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('audio_files', 'readwrite');
      const store = transaction.objectStore('audio_files');
      const request = store.put({ songId, blob, savedAt: new Date().toISOString() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get Audio Blob for true offline playback
  public async getAudioBlob(songId: string): Promise<Blob | null> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const transaction = db.transaction('audio_files', 'readonly');
        const store = transaction.objectStore('audio_files');
        const request = store.get(songId);

        request.onsuccess = () => {
          if (request.result?.blob) {
            resolve(request.result.blob);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  // Delete local offline download
  public async removeLocalDownload(songId: string): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction(['songs', 'audio_files'], 'readwrite');
    
    // Remove audio file
    transaction.objectStore('audio_files').delete(songId);
    
    // Update song record
    const songStore = transaction.objectStore('songs');
    const getReq = songStore.get(songId);
    getReq.onsuccess = () => {
      if (getReq.result) {
        const updated: Song = {
          ...getReq.result,
          isDownloaded: false,
          localPath: undefined
        };
        songStore.put(updated);
      }
    };
  }

  // Playlists
  public async getPlaylists(): Promise<Playlist[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const transaction = db.transaction('playlists', 'readonly');
        const store = transaction.objectStore('playlists');
        const request = store.getAll();

        request.onsuccess = () => {
          if (request.result && request.result.length > 0) {
            resolve(request.result);
          } else {
            resolve(INITIAL_PLAYLISTS);
          }
        };
        request.onerror = () => resolve(INITIAL_PLAYLISTS);
      });
    } catch {
      return INITIAL_PLAYLISTS;
    }
  }

  public async savePlaylist(playlist: Playlist): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('playlists', 'readwrite');
      const store = transaction.objectStore('playlists');
      const request = store.put(playlist);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async deletePlaylist(playlistId: string): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction('playlists', 'readwrite');
    transaction.objectStore('playlists').delete(playlistId);
  }

  // History log
  public async logHistory(songId: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction('history', 'readwrite');
      transaction.objectStore('history').put({
        songId,
        playedAt: new Date().toISOString()
      });
    } catch {
      // ignore
    }
  }

  // Settings
  public async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const transaction = db.transaction('settings', 'readonly');
        const store = transaction.objectStore('settings');
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result && req.result.value !== undefined) {
            resolve(req.result.value);
          } else {
            resolve(defaultValue);
          }
        };
        req.onerror = () => resolve(defaultValue);
      });
    } catch {
      return defaultValue;
    }
  }

  public async setSetting<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction('settings', 'readwrite');
      transaction.objectStore('settings').put({ key, value });
    } catch {
      // ignore
    }
  }

  // Clear all cached downloads to free up device space
  public async clearDownloadedCache(): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction(['songs', 'audio_files'], 'readwrite');
    
    // Clear audio file blobs
    transaction.objectStore('audio_files').clear();

    // Reset download flags in SQLite
    const songStore = transaction.objectStore('songs');
    const allReq = songStore.getAll();
    allReq.onsuccess = () => {
      const songs: Song[] = allReq.result || [];
      songs.forEach((s) => {
        songStore.put({
          ...s,
          isDownloaded: false,
          localPath: undefined
        });
      });
    };
  }

  // Clear all songs and audio files from local database
  public async clearAllSongs(): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction(['songs', 'audio_files'], 'readwrite');
    transaction.objectStore('songs').clear();
    transaction.objectStore('audio_files').clear();
  }
}

export const dbHelper = LocalDatabaseHelper.getInstance();
