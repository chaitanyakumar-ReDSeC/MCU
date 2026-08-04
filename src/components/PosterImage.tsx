import React, { useState } from 'react';
import { Film, Tv, ShieldAlert, Sparkles, Clapperboard } from 'lucide-react';
import { MCUItem } from '../types';

interface PosterImageProps {
  item: MCUItem;
  className?: string;
}

// Map titles to distinct theme color gradients and iconic accents for poster art
const getHeroGradient = (title: string, phase: string) => {
  const t = title.toLowerCase();
  if (t.includes('iron man')) return 'from-red-900 via-amber-900 to-yellow-950 border-amber-500/30';
  if (t.includes('hulk')) return 'from-emerald-950 via-green-900 to-lime-950 border-emerald-500/30';
  if (t.includes('thor')) return 'from-blue-950 via-slate-900 to-amber-950 border-blue-400/30';
  if (t.includes('captain america')) return 'from-blue-950 via-red-950 to-slate-900 border-red-500/30';
  if (t.includes('avengers')) return 'from-blue-950 via-indigo-950 to-purple-950 border-amber-400/30';
  if (t.includes('guardians')) return 'from-purple-950 via-indigo-950 to-pink-950 border-purple-400/30';
  if (t.includes('ant-man')) return 'from-red-950 via-slate-900 to-zinc-950 border-red-500/30';
  if (t.includes('doctor strange')) return 'from-amber-950 via-orange-950 to-emerald-950 border-amber-400/30';
  if (t.includes('spider-man')) return 'from-red-950 via-blue-950 to-red-900 border-blue-500/30';
  if (t.includes('black panther') || t.includes('wakanda')) return 'from-purple-950 via-zinc-950 to-purple-900 border-purple-400/30';
  if (t.includes('captain marvel') || t.includes('marvels')) return 'from-amber-950 via-blue-950 to-red-950 border-amber-300/30';
  if (t.includes('wandavision')) return 'from-red-950 via-rose-950 to-neutral-900 border-rose-500/30';
  if (t.includes('loki')) return 'from-emerald-950 via-amber-950 to-emerald-900 border-emerald-400/30';
  if (t.includes('black widow')) return 'from-zinc-950 via-red-950 to-black border-red-600/30';
  if (t.includes('shang-chi')) return 'from-red-950 via-amber-950 to-red-900 border-amber-500/30';
  if (t.includes('eternals')) return 'from-amber-950 via-yellow-950 to-slate-900 border-amber-300/30';
  if (t.includes('deadpool')) return 'from-red-950 via-zinc-950 to-red-900 border-red-600/30';
  if (t.includes('daredevil') || t.includes('punisher')) return 'from-red-950 via-neutral-950 to-red-900 border-red-700/30';
  if (t.includes('x-men') || t.includes('wolverine') || t.includes('logan')) return 'from-blue-950 via-cyan-950 to-yellow-950 border-blue-400/30';
  if (phase.includes('X-Men')) return 'from-blue-950 via-slate-900 to-cyan-950 border-cyan-500/30';
  
  return 'from-red-950 via-slate-950 to-zinc-950 border-red-500/20';
};

export const PosterImage: React.FC<PosterImageProps> = ({ item, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // High quality poster fallbacks or stylized poster card
  const heroGradient = getHeroGradient(item.title, item.phase);

  return (
    <div className={`relative overflow-hidden rounded-xl aspect-[2/3] bg-zinc-900 border border-zinc-800 shadow-xl group ${className}`}>
      {!imageError ? (
        <>
          <img
            src={item.posterUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
          {/* Shimmer loading background before image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse flex flex-col items-center justify-center p-4 text-center">
              <Clapperboard className="w-8 h-8 text-zinc-600 mb-2 animate-bounce" />
              <span className="text-xs text-zinc-500 font-mono">#{String(item.order).padStart(2, '0')}</span>
            </div>
          )}
        </>
      ) : null}

      {/* Styled Poster Fallback when external image fails to load */}
      {imageError && (
        <div className={`absolute inset-0 bg-gradient-to-b ${heroGradient} border flex flex-col justify-between p-4 select-none`}>
          {/* Top Header */}
          <div className="flex items-center justify-end">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>

          {/* Center Graphic Title */}
          <div className="my-auto text-center py-2 relative z-10">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-inner">
              {item.mediaType === 'show' ? (
                <Tv className="w-5 h-5 text-amber-300" />
              ) : (
                <Film className="w-5 h-5 text-red-400" />
              )}
            </div>
            <h3 className="font-black text-lg leading-snug text-white drop-shadow-md tracking-tight uppercase line-clamp-3">
              {item.title}
            </h3>
            {item.year && (
              <p className="text-xs font-medium text-zinc-400 mt-1">
                {item.year}
              </p>
            )}
          </div>

          {/* Bottom Phase Badge */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-300 font-medium">
            <span className="truncate max-w-[90%] text-amber-400/90 font-semibold">{item.phase}</span>
          </div>
        </div>
      )}

      {/* Poster Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

      {/* Keep Movie/Series tag top right */}
      <div className="absolute top-2 right-2 z-20">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
          item.mediaType === 'show' 
            ? 'bg-purple-950/90 text-purple-200 border border-purple-500/40' 
            : item.mediaType === 'special'
            ? 'bg-amber-950/90 text-amber-200 border border-amber-500/40'
            : 'bg-black/80 text-gray-200 border border-[#444444]'
        }`}>
          {item.mediaType === 'show' ? 'Series' : item.mediaType === 'special' ? 'Special' : 'Movie'}
        </span>
      </div>
    </div>
  );
};
