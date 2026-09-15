import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../services/audioEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  color?: string;
  barCount?: number;
  height?: number;
  mode?: 'bars' | 'wave';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  color = '#f43f5e',
  barCount = 28,
  height = 36,
  mode = 'bars'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.05;
      const data = audioEngine.getVisualizerData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      if (mode === 'bars') {
        const barWidth = (w / barCount) * 0.75;
        const gap = (w / barCount) * 0.25;

        for (let i = 0; i < barCount; i++) {
          const rawVal = data[i % data.length] || 0;
          const factor = isPlaying ? Math.max(0.12, rawVal / 255) : 0.08;
          const barHeight = Math.max(3, factor * h);

          const x = i * (barWidth + gap);
          const y = h - barHeight;

          // Romantic Rose / Ruby Gradient for bars
          const grad = ctx.createLinearGradient(0, y, 0, h);
          grad.addColorStop(0, '#fda4af'); // light rose
          grad.addColorStop(0.5, '#f43f5e'); // vibrant rose
          grad.addColorStop(1, '#be123c'); // deep ruby

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
          ctx.fill();
        }
      } else {
        // Wave mode
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 8;

        const sliceWidth = w / barCount;
        let x = 0;

        for (let i = 0; i < barCount; i++) {
          const rawVal = data[i % data.length] || 0;
          const factor = isPlaying ? rawVal / 255 : 0.1;
          const y = (h / 2) + Math.sin(time + i * 0.5) * (factor * (h / 2.5));

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, color, barCount, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 8}
      height={height}
      className="w-full h-full block"
      id="audio-visualizer-canvas"
    />
  );
};
