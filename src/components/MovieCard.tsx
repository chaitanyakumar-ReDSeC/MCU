import React, { useState } from 'react';
import { ExternalLink, Play, Download, AlertCircle, Clock, Info, Film } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { MCUItem } from '../types';
import { PosterImage } from './PosterImage';

interface MovieCardProps {
  item: MCUItem;
  onSelect: (item: MCUItem) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ item, onSelect }) => {
  const isHotstarAvailable = item.hotstarStatus === 'available' && item.hotstarUrl;
  const isYtsAvailable = item.ytsStatus === 'available' && item.ytsUrl;
  const isNetflixAvailable = item.netflixStatus === 'available' && item.netflixUrl;
  const isAmznAvailable = item.amznPrimeStatus === 'available' && item.amznPrimeUrl;

  const hasAnyLink = isHotstarAvailable || isNetflixAvailable || isAmznAvailable || isYtsAvailable;

  // Parallax tilt effect handlers
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col bg-[#0f0f12] border border-[#22222a] hover:border-[#e23636] rounded-xl overflow-hidden transition-colors duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-950/20"
      id={`mcu-card-${item.order}`}
    >
      {/* Poster Container with Click to Details & Parallax Poster */}
      <div 
        className="relative cursor-pointer overflow-hidden aspect-[2/3]" 
        onClick={() => onSelect(item)}
      >
        <PosterImage item={item} />

        {/* Hover info overlay without movie description */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-20">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-300 font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-500/30 w-fit">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Click for quick details</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#0f0f12] to-[#0a0a0c]">
        <div>
          {/* Header Row: Movie Counter on Left & Year on Right */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {/* Movie Counter on Left Hand Side */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] font-black tracking-wider text-[#e23636] bg-[#e23636]/10 border border-[#e23636]/30 px-2 py-0.5 rounded shrink-0">
                #{String(item.order).padStart(2, '0')}
              </span>
            </div>

            {item.year && (
              <span className="text-[10px] font-mono font-semibold text-gray-400 bg-[#1c1c22] px-2 py-0.5 rounded border border-[#2a2a34]">
                {item.year}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(item)}
            className="font-extrabold text-white text-sm leading-snug uppercase line-clamp-2 hover:text-[#e23636] cursor-pointer transition-colors mb-2 tracking-wide"
            title={item.title}
          >
            {item.title}
          </h3>
        </div>

        {/* Streaming Action Links - Render strictly when URL exists in CSV */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-[#22222e]">
          {/* HOTSTAR */}
          {isHotstarAvailable && (
            <div className="flex-1 min-w-[75px]">
              <a
                href={item.hotstarUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white uppercase text-[10px] font-extrabold tracking-wider transition-all shadow-md shadow-blue-900/20 group/btn"
                id={`hotstar-btn-${item.order}`}
              >
                <Play className="w-3 h-3 fill-white group-hover/btn:scale-110 transition-transform" />
                <span>Hotstar</span>
              </a>
            </div>
          )}

          {/* NETFLIX */}
          {isNetflixAvailable && (
            <div className="flex-1 min-w-[75px]">
              <a
                href={item.netflixUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-[#E50914] via-[#f0141e] to-[#b81d24] hover:from-[#f6121d] hover:to-[#E50914] text-white uppercase text-[10px] font-extrabold tracking-wider transition-all shadow-md shadow-red-900/30 group/nflix"
                id={`netflix-btn-${item.order}`}
              >
                <Play className="w-3 h-3 fill-white group-hover/nflix:scale-110 transition-transform" />
                <span>Netflix</span>
              </a>
            </div>
          )}

          {/* AMAZON PRIME */}
          {isAmznAvailable && (
            <div className="flex-1 min-w-[75px]">
              <a
                href={item.amznPrimeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-sky-600 via-sky-500 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white uppercase text-[10px] font-extrabold tracking-wider transition-all shadow-md shadow-sky-900/30 group/prime"
                id={`prime-btn-${item.order}`}
              >
                <Play className="w-3 h-3 fill-white group-hover/prime:scale-110 transition-transform" />
                <span>Prime</span>
              </a>
            </div>
          )}

          {/* YTS TORRENT */}
          {isYtsAvailable && (
            <div className="flex-1 min-w-[75px]">
              <a
                href={item.ytsUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white uppercase text-[10px] font-extrabold tracking-wider transition-all shadow-md shadow-emerald-900/20 group/btn"
                id={`yts-btn-${item.order}`}
              >
                <Download className="w-3 h-3 group-hover/btn:translate-y-0.5 transition-transform" />
                <span>YTS</span>
              </a>
            </div>
          )}

          {/* IF NO LINKS ARE SPECIFIED IN CSV */}
          {!hasAnyLink && (
            <div className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#14141c] text-gray-500 uppercase text-[10px] font-bold border border-[#222230]">
              <AlertCircle className="w-3 h-3 text-gray-500" />
              <span>No Streams Listed</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
