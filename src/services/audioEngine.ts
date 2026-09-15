import { EqualizerPreset, Song } from '../types';

export class AudioEngine {
  private static instance: AudioEngine;
  private audio: HTMLAudioElement;
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private bassFilter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  
  // Melody synthesizer for acoustic simulation
  private synthInterval: number | null = null;
  private isSynthPlaying: boolean = false;

  private constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.preload = 'auto';
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public getAudioElement(): HTMLAudioElement {
    return this.audio;
  }

  public initWebAudio() {
    if (this.audioCtx) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
      this.gainNode = this.audioCtx.createGain();

      // Setup 5-Band Equalizer: 60Hz (Lowshelf), 230Hz (Peaking), 910Hz (Peaking), 3.6kHz (Peaking), 14kHz (Highshelf)
      const freqs = [60, 230, 910, 3600, 14000];
      const types: BiquadFilterType[] = ['lowshelf', 'peaking', 'peaking', 'peaking', 'highshelf'];

      this.eqFilters = freqs.map((freq, index) => {
        const filter = this.audioCtx!.createBiquadFilter();
        filter.type = types[index];
        filter.frequency.value = freq;
        filter.gain.value = 0;
        filter.Q.value = 1.0;
        return filter;
      });

      // Bass Boost filter (lowpass resonant boost)
      this.bassFilter = this.audioCtx.createBiquadFilter();
      this.bassFilter.type = 'lowshelf';
      this.bassFilter.frequency.value = 120;
      this.bassFilter.gain.value = 0;

      // Analyser for real-time visualizer
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      // Chain: Source -> EQ1 -> EQ2 -> EQ3 -> EQ4 -> EQ5 -> BassFilter -> Analyser -> Gain -> Destination
      let lastNode: AudioNode = this.sourceNode;
      for (const filter of this.eqFilters) {
        lastNode.connect(filter);
        lastNode = filter;
      }
      lastNode.connect(this.bassFilter);
      this.bassFilter.connect(this.analyser);
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
    } catch {
      // Audio context might fail if not triggered by gesture yet, will initialize on first play
    }
  }

  public async playSong(src: string, isOffline: boolean = false, fallbackSong?: Song): Promise<void> {
    this.initWebAudio();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.stopSynth();

    return new Promise((resolve, reject) => {
      this.audio.src = src;
      this.audio.load();

      const onCanPlay = () => {
        this.audio.play().then(resolve).catch((err) => {
          // If media URL is blocked or offline, trigger melodic synth fallback
          if (fallbackSong) {
            this.startMelodicSynth(fallbackSong);
            resolve();
          } else {
            reject(err);
          }
        });
        cleanup();
      };

      const onError = () => {
        cleanup();
        if (fallbackSong) {
          this.startMelodicSynth(fallbackSong);
          resolve();
        } else {
          reject(new Error('Audio playback failed'));
        }
      };

      const cleanup = () => {
        this.audio.removeEventListener('canplay', onCanPlay);
        this.audio.removeEventListener('error', onError);
      };

      this.audio.addEventListener('canplay', onCanPlay);
      this.audio.addEventListener('error', onError);

      // Timeout fallback if network stalls
      setTimeout(() => {
        if (this.audio.paused && !this.isSynthPlaying && fallbackSong) {
          this.startMelodicSynth(fallbackSong);
          resolve();
        }
      }, 2500);
    });
  }

  public pause(): void {
    this.audio.pause();
    this.stopSynth();
  }

  public resume(): void {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.audio.play().catch(() => {});
  }

  public seek(seconds: number): void {
    if (Number.isFinite(seconds)) {
      this.audio.currentTime = seconds;
    }
  }

  public setVolume(vol: number): void {
    this.audio.volume = Math.max(0, Math.min(1, vol));
  }

  public setSpeed(speed: number): void {
    this.audio.playbackRate = speed;
  }

  public applyEqualizer(preset: EqualizerPreset): void {
    if (!this.audioCtx) this.initWebAudio();
    if (!this.eqFilters.length) return;

    preset.bands.forEach((gain, index) => {
      if (this.eqFilters[index]) {
        this.eqFilters[index].gain.setTargetAtTime(gain, this.audioCtx!.currentTime, 0.05);
      }
    });

    if (this.bassFilter) {
      const bassGain = (preset.bassBoost / 100) * 12; // 0 to 12 dB boost
      this.bassFilter.gain.setTargetAtTime(bassGain, this.audioCtx!.currentTime, 0.05);
    }
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) {
      // Return simulated calm ripple data if analyser not yet attached
      const simulated = new Uint8Array(32);
      if (!this.audio.paused || this.isSynthPlaying) {
        const time = Date.now() * 0.005;
        for (let i = 0; i < 32; i++) {
          simulated[i] = Math.floor(60 + Math.sin(time + i * 0.4) * 50 + Math.random() * 20);
        }
      }
      return simulated;
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  // Melodic synthesizer producing sweet acoustic chords for romantic Telugu tracks
  private startMelodicSynth(song: Song): void {
    if (!this.audioCtx) this.initWebAudio();
    if (!this.audioCtx) return;

    this.isSynthPlaying = true;
    const notes = song.melodyNotes && song.melodyNotes.length > 0 ? song.melodyNotes : [60, 64, 67, 72, 71, 67, 65, 64, 62, 60];
    let noteIdx = 0;

    const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

    this.synthInterval = window.setInterval(() => {
      if (!this.isSynthPlaying || !this.audioCtx) return;

      const midi = notes[noteIdx % notes.length];
      noteIdx++;

      try {
        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();

        // Warm sine / triangle acoustic tone
        osc.type = noteIdx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(midiToFreq(midi), this.audioCtx.currentTime);

        noteGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.12, this.audioCtx.currentTime + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.9);

        osc.connect(noteGain);
        if (this.gainNode) {
          noteGain.connect(this.gainNode);
        } else {
          noteGain.connect(this.audioCtx.destination);
        }

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.95);
      } catch {
        // ignore
      }
    }, 600);
  }

  private stopSynth(): void {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynthPlaying = false;
  }
}

export const audioEngine = AudioEngine.getInstance();
