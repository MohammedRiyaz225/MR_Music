import React, { useState } from 'react';
import { X, Sliders, RotateCcw, Check } from 'lucide-react';
import { useMusic, EQUALIZER_PRESETS } from '../context/MusicContext';
import { EqualizerPreset } from '../types';

export const EqualizerModal: React.FC = () => {
  const {
    isEqualizerModalOpen,
    setIsEqualizerModalOpen,
    activeEqualizer,
    setEqualizerPreset,
    updateCustomEqualizerBands,
    themeConfig
  } = useMusic();

  const [currentBands, setCurrentBands] = useState<[number, number, number, number, number]>(activeEqualizer.bands);
  const [bassBoost, setBassBoost] = useState<number>(activeEqualizer.bassBoost);
  const [surround, setSurround] = useState<number>(activeEqualizer.surround);

  if (!isEqualizerModalOpen) return null;

  const bandLabels = ['60 Hz', '230 Hz', '910 Hz', '3.6 kHz', '14 kHz'];
  const bandDescriptions = ['Sub-Bass', 'Bass', 'Midrange', 'Presence', 'Air'];

  const handleBandChange = (index: number, val: number) => {
    const next: [number, number, number, number, number] = [
      currentBands[0],
      currentBands[1],
      currentBands[2],
      currentBands[3],
      currentBands[4]
    ];
    next[index] = val;
    setCurrentBands(next);
    updateCustomEqualizerBands(next, bassBoost);
  };

  const handleBassChange = (val: number) => {
    setBassBoost(val);
    updateCustomEqualizerBands(currentBands, val);
  };

  const applyPreset = (preset: EqualizerPreset) => {
    setCurrentBands(preset.bands);
    setBassBoost(preset.bassBoost);
    setSurround(preset.surround);
    setEqualizerPreset(preset);
  };

  const resetFlat = () => {
    const flat: [number, number, number, number, number] = [0, 0, 0, 0, 0];
    setCurrentBands(flat);
    setBassBoost(0);
    setSurround(0);
    setEqualizerPreset({
      name: 'Flat / Studio',
      bands: flat,
      bassBoost: 0,
      surround: 0
    });
  };

  return (
    <div
      id="equalizer-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div 
        className="border rounded-2xl w-full max-w-sm p-4 shadow-2xl space-y-3.5 animate-in zoom-in-95 duration-200"
        style={{ 
          backgroundColor: themeConfig.surfaceDark,
          borderColor: themeConfig.surfaceBorder 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 rounded-lg border"
              style={{ 
                backgroundColor: themeConfig.badgeBg, 
                color: themeConfig.badgeText, 
                borderColor: themeConfig.surfaceBorder 
              }}
            >
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-tight">Audio Equalizer</h3>
              <p className="text-[10px] text-slate-400">Acoustic & frequency calibration</p>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={resetFlat}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Reset Flat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEqualizerModalOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preset Selector Chips */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Sound Presets</label>
          <div className="flex flex-wrap gap-1">
            {EQUALIZER_PRESETS.map((preset) => {
              const isSelected = activeEqualizer.name === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? `bg-gradient-to-tr ${themeConfig.gradient} text-white shadow`
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 Vertical Band Sliders */}
        <div className="bg-black/60 p-3 rounded-xl border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
            <span>+12 dB</span>
            <span className="text-slate-300 font-semibold">Gain Response</span>
            <span>-12 dB</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1 pb-1 items-end h-36">
            {currentBands.map((gain, idx) => (
              <div key={idx} className="flex flex-col items-center justify-between h-full group">
                <span className="text-[9px] font-mono font-bold" style={{ color: themeConfig.accent }}>
                  {gain > 0 ? `+${gain}` : gain}
                </span>

                {/* Vertical Slider Wrapper */}
                <div className="relative h-22 flex items-center justify-center">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={gain}
                    onChange={(e) => handleBandChange(idx, parseInt(e.target.value))}
                    className="w-22 h-1.5 -rotate-90 origin-center bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: themeConfig.primary }}
                  />
                </div>

                <div className="text-center mt-0.5">
                  <p className="text-[10px] font-bold text-slate-200">{bandLabels[idx]}</p>
                  <p className="text-[8px] text-slate-500 leading-tight">{bandDescriptions[idx]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bass Boost & Spatial Surround */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-semibold text-slate-300">Bass Boost</span>
              <span className="font-mono text-[10px] font-bold" style={{ color: themeConfig.accent }}>{bassBoost}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={bassBoost}
              onChange={(e) => handleBassChange(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: themeConfig.primary }}
            />
          </div>

          <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-semibold text-slate-300">Vocal Clarity</span>
              <span className="font-mono text-[10px] font-bold text-sky-400">{surround}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={surround}
              onChange={(e) => setSurround(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={() => setIsEqualizerModalOpen(false)}
          id="btn-eq-done"
          className={`w-full py-2 bg-gradient-to-tr ${themeConfig.gradient} text-white font-bold rounded-xl shadow transition-all text-xs cursor-pointer`}
        >
          Apply Tuning
        </button>
      </div>
    </div>
  );
};
