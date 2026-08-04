import React, { useEffect } from 'react';
import { X, ExternalLink, Play, Download, ChevronLeft, ChevronRight, Copy, Check, Film, Tv, Calendar } from 'lucide-react';
import { MCUItem } from '../types';
import { PosterImage } from './PosterImage';

interface MovieModalProps {
  item: MCUItem | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  item,
  onClose,
  onNavigate,
  hasPrev,
  hasNext,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate('prev');
      if (e.key === 'ArrowRight' && hasNext) onNavigate('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate, hasPrev, hasNext]);

  if (!item) return null;

  const isHotstarAvailable = item.hotstarStatus === 'available' && item.hotstarUrl;
  const isYtsAvailable = item.ytsStatus === 'available' && item.ytsUrl;

  const handleCopy = () => {
    const textToCopy = `${item.title} (#${String(item.order).padStart(2, '0')})\nHotstar: ${item.hotstarUrl || 'Unavailable'}\nYTS: ${item.ytsUrl || 'Unavailable'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#0a0a0a] border border-[#222222] rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[#111111] text-gray-400 hover:text-white hover:bg-[#222222] transition-all"
          id="modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Poster Column */}
        <div className="w-full md:w-5/12 p-6 bg-[#050505] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#222222]">
          <div className="w-48 md:w-full max-w-[220px]">
            <PosterImage item={item} />
          </div>
        </div>

        {/* Information Column */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header info */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-[#e23636]/10 text-[#e23636] border border-[#e23636]/30">
                #{String(item.order).padStart(2, '0')}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#111116] text-gray-300 border border-[#22222a]">
                {item.phase}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
                item.mediaType === 'show' ? 'text-purple-300 bg-purple-950/60 border-purple-500/30' : 'text-gray-300 bg-[#15151a] border-[#33333d]'
              }`}>
                {item.mediaType === 'show' ? 'Series' : item.mediaType === 'special' ? 'Special' : 'Movie'}
              </span>
              {item.year && (
                <span className="text-xs font-mono text-gray-400 flex items-center gap-1 ml-auto">
                  <Calendar className="w-3 h-3" />
                  {item.year}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight uppercase tracking-wide mb-5">
              {item.title}
            </h2>

            {/* Streaming Links Box */}
            <div className="space-y-3 bg-[#111116] p-4 rounded-xl border border-[#22222e] mb-6">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                Available Streaming &amp; Downloads
              </h4>

              {/* Hotstar */}
              {isHotstarAvailable ? (
                <a
                  href={item.hotstarUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md group"
                >
                  <div className="flex items-center gap-2.5">
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch on Disney+ Hotstar</span>
                  </div>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <div className="p-3 rounded-lg bg-[#18181f] border border-[#22222a] text-xs text-gray-500 uppercase font-bold flex items-center justify-between">
                  <span>Disney+ Hotstar Stream</span>
                  <span className="font-mono text-[10px]">Unavailable</span>
                </div>
              )}

              {/* Netflix */}
              {item.netflixStatus === 'available' && item.netflixUrl && (
                <a
                  href={item.netflixUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#E50914] via-[#f0141e] to-[#b81d24] hover:from-[#f6121d] hover:to-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md group"
                >
                  <div className="flex items-center gap-2.5">
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch on Netflix</span>
                  </div>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}

              {/* Amazon Prime */}
              {item.amznPrimeStatus === 'available' && item.amznPrimeUrl && (
                <a
                  href={item.amznPrimeUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-sky-600 via-sky-500 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md group"
                >
                  <div className="flex items-center gap-2.5">
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch on Amazon Prime</span>
                  </div>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}

              {/* YTS */}
              {isYtsAvailable ? (
                <a
                  href={item.ytsUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md group"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4" />
                    <span>Watch/Download on YTS Torrents</span>
                  </div>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <div className="p-3 rounded-lg bg-[#18181f] border border-[#22222a] text-xs text-gray-500 uppercase font-bold flex items-center justify-between">
                  <span>YTS Torrent Download</span>
                  <span className="font-mono text-[10px]">Unavailable</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#222222] flex items-center justify-between gap-4">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-[#111111] px-3 py-2 rounded border border-[#222222] transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#4caf50]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Links!' : 'Copy Links'}</span>
            </button>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-2">
              <button
                disabled={!hasPrev}
                onClick={() => onNavigate('prev')}
                className="p-2 rounded bg-[#111111] text-gray-300 hover:text-white hover:bg-[#222222] border border-[#222222] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Previous MCU Entry"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                disabled={!hasNext}
                onClick={() => onNavigate('next')}
                className="p-2 rounded bg-[#111111] text-[#e23636] hover:text-white hover:bg-[#222222] border border-[#222222] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Next MCU Entry"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
