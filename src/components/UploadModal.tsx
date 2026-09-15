import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Music, 
  Check, 
  HardDrive, 
  Sparkles, 
  Search, 
  Link as LinkIcon, 
  DownloadCloud, 
  CheckCircle2, 
  Radio,
  FileAudio,
  FolderOpen,
  Info
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SPOTIFY_POPULAR_TELUGU_HITS, resolveSpotifyUrlOrSearch, SpotifyTrackMeta } from '../data/spotifyHits';

export const UploadModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, addCustomSong, songs, themeConfig } = useMusic();

  const [activeTab, setActiveTab] = useState<'file' | 'spotify' | 'manual'>('file');

  // Multi-File Upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState<boolean>(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  // Spotify Importer states
  const [spotifyInput, setSpotifyInput] = useState<string>('');
  const [isResolvingSpotify, setIsResolvingSpotify] = useState<boolean>(false);
  const [resolvedSpotifyTrack, setResolvedSpotifyTrack] = useState<SpotifyTrackMeta | null>(null);
  const [spotifyImportSuccess, setSpotifyImportSuccess] = useState<string | null>(null);
  const [batchImporting, setBatchImporting] = useState<boolean>(false);

  // Manual Form states
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [movie, setMovie] = useState<string>('');
  const [category, setCategory] = useState<'Telugu Romance' | 'Melody' | 'Trending' | 'Custom Upload'>('Telugu Romance');
  const [albumArt, setAlbumArt] = useState<string>('https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80');
  const [fileSizeMb, setFileSizeMb] = useState<number>(5.4);
  const [duration, setDuration] = useState<number>(230);
  const [singleAudioBlob, setSingleAudioBlob] = useState<Blob | null>(null);
  const [isProcessingManual, setIsProcessingManual] = useState<boolean>(false);

  if (!isUploadModalOpen) return null;

  const defaultCovers = [
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80'
  ];

  // Handle file selection (single or multiple .mp3 / .wav / .m4a / .flac)
  const handleFilesSelected = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    const newFiles = Array.from(filesList).filter(f => f.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|flac|ogg)$/i.test(f.name));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveSelectedFiles = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessingFiles(true);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setUploadProgressMsg(`Importing (${i + 1}/${selectedFiles.length}): ${file.name}...`);

      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      let songTitle = cleanName;
      let songArtist = 'Telugu Artist';
      let songMovie: string | undefined = undefined;

      if (cleanName.includes('-')) {
        const parts = cleanName.split('-');
        songArtist = parts[0].trim();
        songTitle = parts[1].trim();
      } else if (cleanName.includes('_')) {
        songTitle = cleanName.replace(/_/g, ' ');
      }

      // Check if file metadata duration can be measured
      let songDuration = 220;
      try {
        const tempAudio = new Audio(URL.createObjectURL(file));
        await new Promise((resolve) => {
          tempAudio.onloadedmetadata = () => {
            if (tempAudio.duration && !isNaN(tempAudio.duration)) {
              songDuration = Math.round(tempAudio.duration);
            }
            resolve(true);
          };
          tempAudio.onerror = () => resolve(false);
          setTimeout(() => resolve(false), 800);
        });
      } catch {
        // use fallback duration
      }

      const sizeMb = Math.round((file.size / (1024 * 1024)) * 10) / 10 || 5.0;
      const randomCover = defaultCovers[i % defaultCovers.length];

      await addCustomSong(
        {
          title: songTitle,
          artist: songArtist,
          movie: songMovie,
          albumArt: randomCover,
          audioUrl: URL.createObjectURL(file),
          duration: songDuration,
          fileSizeMb: sizeMb,
          isDownloaded: true,
          category: 'Custom Upload',
          lyrics: [
            `${songTitle} (Exact Original Audio File)`,
            `Artist: ${songArtist}`,
            `Direct offline playback from ${file.name}`
          ],
          melodyNotes: [60, 64, 67, 72, 71, 67, 64, 60]
        },
        file
      );
    }

    setIsProcessingFiles(false);
    setUploadProgressMsg('All songs saved to your local offline library!');
    setTimeout(() => {
      setSelectedFiles([]);
      setUploadProgressMsg(null);
      setIsUploadModalOpen(false);
    }, 1500);
  };

  // Spotify resolver
  const handleResolveSpotify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!spotifyInput.trim()) return;

    setIsResolvingSpotify(true);
    setResolvedSpotifyTrack(null);
    setSpotifyImportSuccess(null);

    const trackMeta = await resolveSpotifyUrlOrSearch(spotifyInput);
    setIsResolvingSpotify(false);
    if (trackMeta) {
      setResolvedSpotifyTrack(trackMeta);
    }
  };

  const handleImportSpotifyTrack = async (track: SpotifyTrackMeta) => {
    setIsProcessingManual(true);
    await addCustomSong({
      title: track.title,
      artist: track.artist,
      movie: track.movie,
      albumArt: track.albumArt,
      audioUrl: track.audioUrl,
      duration: track.duration,
      fileSizeMb: track.fileSizeMb,
      isDownloaded: true,
      category: track.category,
      lyrics: track.lyrics,
      melodyNotes: track.melodyNotes,
      year: track.year
    });
    setIsProcessingManual(false);
    setSpotifyImportSuccess(`"${track.title}" added to local library & cached!`);
    setTimeout(() => {
      setSpotifyImportSuccess(null);
      setResolvedSpotifyTrack(null);
      setSpotifyInput('');
    }, 2000);
  };

  const handleImportAllHits = async () => {
    setBatchImporting(true);
    for (const track of SPOTIFY_POPULAR_TELUGU_HITS) {
      const alreadyExists = songs.some(
        (s) => s.title.toLowerCase() === track.title.toLowerCase()
      );
      if (!alreadyExists) {
        await addCustomSong({
          title: track.title,
          artist: track.artist,
          movie: track.movie,
          albumArt: track.albumArt,
          audioUrl: track.audioUrl,
          duration: track.duration,
          fileSizeMb: track.fileSizeMb,
          isDownloaded: true,
          category: track.category,
          lyrics: track.lyrics,
          melodyNotes: track.melodyNotes,
          year: track.year
        });
      }
    }
    setBatchImporting(false);
    setSpotifyImportSuccess('All Spotify Telugu Hits successfully added & cached!');
    setTimeout(() => {
      setSpotifyImportSuccess(null);
    }, 2500);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsProcessingManual(true);
    const dummyAudioUrl = 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1144.mp3';

    await addCustomSong(
      {
        title,
        artist: artist || 'Telugu Artist',
        movie: movie || undefined,
        albumArt,
        audioUrl: dummyAudioUrl,
        duration: duration || 210,
        fileSizeMb: fileSizeMb || 5.0,
        isDownloaded: true,
        category,
        lyrics: [
          `${title} - Telugu Track`,
          `Sung by ${artist || 'Unknown Artist'}`,
          'Direct offline playback stored in local SQLite'
        ]
      },
      singleAudioBlob || undefined
    );

    setIsProcessingManual(false);
    setIsUploadModalOpen(false);
  };

  return (
    <div
      id="upload-modal"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        className="border rounded-2xl w-full max-w-md p-4 shadow-2xl space-y-3 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: themeConfig.surfaceDark,
          borderColor: themeConfig.surfaceBorder 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 rounded-lg border flex items-center justify-center"
              style={{ 
                backgroundColor: themeConfig.badgeBg, 
                color: themeConfig.badgeText, 
                borderColor: themeConfig.surfaceBorder 
              }}
            >
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Add & Play Exact Audio Songs</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                  Exact Audio
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Add original audio files (.mp3, .m4a) or sync Spotify songs</p>
            </div>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-black/40 p-0.5 rounded-xl border border-white/10 text-[11px]">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'file' ? 'text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            style={activeTab === 'file' ? { backgroundColor: themeConfig.primary } : {}}
          >
            <Upload className="w-3 h-3" />
            <span>Upload Exact MP3s</span>
          </button>
          <button
            onClick={() => setActiveTab('spotify')}
            className={`flex-1 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'spotify' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Spotify Hits</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'manual' ? 'text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            style={activeTab === 'manual' ? { backgroundColor: themeConfig.primary } : {}}
          >
            <span>Manual Entry</span>
          </button>
        </div>

        {/* TAB 1: EXACT DEVICE MP3 FILES UPLOAD */}
        {activeTab === 'file' && (
          <div className="space-y-3">
            {/* Direct instructions for exact playback */}
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-2 text-slate-300 text-[10px] leading-relaxed">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Play Exact Original Audio:</strong>
                <p className="mt-0.5 text-slate-300">
                  Select your downloaded Telugu/Hindi/English audio files from your phone/computer (<strong>.mp3, .m4a, .wav, .aac</strong>). They will be stored directly in your local offline database and will play with 100% exact full audio quality!
                </p>
              </div>
            </div>

            {/* Drag & Click Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-4 text-center bg-black/40 hover:bg-black/60 cursor-pointer transition-all space-y-1.5"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*,.mp3,.wav,.m4a,.aac,.flac,.ogg"
                onChange={(e) => handleFilesSelected(e.target.files)}
                className="hidden"
              />
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-md"
                style={{ backgroundColor: themeConfig.badgeBg, color: themeConfig.accent }}
              >
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Tap to Choose Audio Files from Phone / PC</p>
                <p className="text-[10px] text-slate-400">Select one or multiple songs (Oh Sita Hey Rama, Chuttamalle, etc.)</p>
              </div>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold uppercase">
                  <span>Selected Files ({selectedFiles.length})</span>
                  <button 
                    onClick={() => setSelectedFiles([])}
                    className="text-rose-400 hover:text-rose-300 text-[9px] cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileAudio className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-[11px] font-medium text-white truncate">{file.name}</span>
                        <span className="text-[9px] text-slate-400 shrink-0">
                          {Math.round((file.size / (1024 * 1024)) * 10) / 10} MB
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(idx)}
                        className="text-slate-400 hover:text-rose-400 p-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {uploadProgressMsg && (
                  <p className="text-[10px] text-emerald-400 font-medium animate-pulse text-center">
                    {uploadProgressMsg}
                  </p>
                )}

                <button
                  onClick={handleSaveSelectedFiles}
                  disabled={isProcessingFiles}
                  className={`w-full py-2 bg-gradient-to-tr ${themeConfig.gradient} disabled:opacity-50 text-white font-bold rounded-xl shadow flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer`}
                >
                  {isProcessingFiles ? (
                    <span className="animate-pulse">Importing & Storing Offline...</span>
                  ) : (
                    <>
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Save & Play Exact Songs ({selectedFiles.length})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SPOTIFY IMPORTER */}
        {activeTab === 'spotify' && (
          <div className="space-y-3">
            {/* Search or Paste Link */}
            <form onSubmit={handleResolveSpotify} className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-emerald-400" />
                  <span>Paste Spotify Track Link or Search Title</span>
                </span>
                <span className="text-[9px] text-emerald-400 font-mono">open.spotify.com</span>
              </label>

              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={spotifyInput}
                    onChange={(e) => setSpotifyInput(e.target.value)}
                    placeholder="e.g. https://open.spotify.com/track/... or 'Samayama'"
                    className="w-full pl-8 pr-2.5 py-1.5 bg-black/50 rounded-lg border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isResolvingSpotify || !spotifyInput.trim()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow transition-all cursor-pointer shrink-0"
                >
                  {isResolvingSpotify ? (
                    <span className="animate-spin text-xs">⏳</span>
                  ) : (
                    <span>Resolve</span>
                  )}
                </button>
              </div>
            </form>

            {/* Notification Toast */}
            {spotifyImportSuccess && (
              <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-2 text-emerald-300 text-[11px] animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">{spotifyImportSuccess}</span>
              </div>
            )}

            {/* Resolved Preview Card */}
            {resolvedSpotifyTrack && (
              <div className="bg-black/60 p-3 rounded-xl border border-emerald-500/40 space-y-2 animate-in zoom-in-95">
                <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase">
                  <span>Spotify Track Found</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">Ready to Cache</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <img
                    src={resolvedSpotifyTrack.albumArt}
                    alt={resolvedSpotifyTrack.title}
                    className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0 shadow"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{resolvedSpotifyTrack.title}</h4>
                    <p className="text-[10px] text-slate-300 truncate">{resolvedSpotifyTrack.artist}</p>
                    <p className="text-[9px] text-slate-400">{resolvedSpotifyTrack.movie} • {Math.floor(resolvedSpotifyTrack.duration / 60)}m {resolvedSpotifyTrack.duration % 60}s</p>
                  </div>
                </div>

                <button
                  onClick={() => handleImportSpotifyTrack(resolvedSpotifyTrack)}
                  disabled={isProcessingManual}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>{isProcessingManual ? 'Saving to Offline Database...' : 'Import to Offline SQLite'}</span>
                </button>
              </div>
            )}

            {/* Popular Spotify Telugu Hits List */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Trending Spotify Telugu Hits (1-Tap Add)</span>
                </label>
                <button
                  onClick={handleImportAllHits}
                  disabled={batchImporting}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
                >
                  {batchImporting ? 'Importing All...' : 'Import All 10 Hits'}
                </button>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {SPOTIFY_POPULAR_TELUGU_HITS.map((hit) => {
                  const alreadyInLibrary = songs.some(
                    (s) => s.title.toLowerCase() === hit.title.toLowerCase()
                  );

                  return (
                    <div
                      key={hit.spotifyId}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/5 flex items-center justify-between gap-2 transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={hit.albumArt}
                          alt={hit.title}
                          className="w-8 h-8 rounded-md object-cover border border-white/10 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{hit.title}</p>
                          <p className="text-[9px] text-slate-400 truncate">{hit.movie} • {hit.artist.split(',')[0]}</p>
                        </div>
                      </div>

                      {alreadyInLibrary ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold flex items-center gap-0.5 shrink-0">
                          <Check className="w-2.5 h-2.5" />
                          <span>Saved</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleImportSpotifyTrack(hit)}
                          className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                        >
                          <DownloadCloud className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANUAL ENTRY */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-300">Song Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Inkem Inkem"
                  className="w-full px-2.5 py-1.5 bg-black/50 rounded-lg border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-300">Singer / Artist</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. Sid Sriram"
                  className="w-full px-2.5 py-1.5 bg-black/50 rounded-lg border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-300">Movie / Album</label>
                <input
                  type="text"
                  value={movie}
                  onChange={(e) => setMovie(e.target.value)}
                  placeholder="e.g. Geetha Govindam"
                  className="w-full px-2.5 py-1.5 bg-black/50 rounded-lg border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] font-semibold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-black/50 rounded-lg border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="Telugu Romance">Telugu Romance</option>
                  <option value="Melody">Melody</option>
                  <option value="Trending">Trending</option>
                  <option value="Custom Upload">Custom Upload</option>
                </select>
              </div>
            </div>

            {/* Cover Art Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Cover Art</span>
                <span className="text-[9px] text-slate-400">Preset Artwork</span>
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {defaultCovers.map((cover, idx) => (
                  <div
                    key={idx}
                    onClick={() => setAlbumArt(cover)}
                    className={`relative w-10 h-10 rounded-lg overflow-hidden cursor-pointer border shrink-0 transition-all ${
                      albumArt === cover ? 'border-white ring-1 ring-white/50 scale-105 shadow' : 'border-white/10 opacity-70'
                    }`}
                  >
                    <img src={cover} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {albumArt === cover && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessingManual || !title}
              className={`w-full py-2 bg-gradient-to-tr ${themeConfig.gradient} disabled:opacity-50 text-white font-bold rounded-xl shadow flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Save to Offline Library</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
