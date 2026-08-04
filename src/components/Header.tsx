import React, { useState, useRef, useEffect } from 'react';
import { Film, ChevronDown, Play, Download, Database, CheckCircle2, Sparkles, ExternalLink, Github } from 'lucide-react';
import { MCUItem } from '../types';

interface HeaderProps {
  catalogItems: MCUItem[];
  isLoadedFromCSV?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ catalogItems, isLoadedFromCSV = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate platform & media type breakdown statistics
  const totalCount = catalogItems.length;
  const moviesCount = catalogItems.filter(i => i.mediaType === 'movie').length;
  const seriesCount = catalogItems.filter(i => i.mediaType === 'show').length;
  const specialsCount = catalogItems.filter(i => i.mediaType === 'special').length;

  const hotstarCount = catalogItems.filter(i => i.hotstarStatus === 'available' && i.hotstarUrl).length;
  const netflixCount = catalogItems.filter(i => i.netflixStatus === 'available' && i.netflixUrl).length;
  const ytsCount = catalogItems.filter(i => i.ytsStatus === 'available' && i.ytsUrl).length;
  const amznCount = catalogItems.filter(i => i.amznPrimeStatus === 'available' && i.amznPrimeUrl).length;

  const bannerImageUrl = 'https://raw.githubusercontent.com/chaitanyakumar-ReDSeC/assets/main/general/image_assets/static/marvel-studios.png';

  return (
    <header className="relative bg-[#0a0a0d] border-b border-[#1f1f2a] py-6 mb-8 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Banner & Credit Section */}
          <div className="flex flex-col items-center md:items-start gap-2.5">
            <div className="flex items-center gap-3">
              <img 
                src={bannerImageUrl} 
                alt="Marvel Studios" 
                className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_4px_12px_rgba(226,54,54,0.3)]"
                onError={(e) => {
                  // Fallback if raw image path fails
                  (e.currentTarget as HTMLImageElement).src = 'https://github.com/chaitanyakumar-ReDSeC/assets/raw/main/general/image_assets/static/marvel-studios.png';
                }}
              />
              {/* {isLoadedFromCSV && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <Database className="w-2.5 h-2.5" />
                  CSV Sync
                </span>
              )} */}
            </div>

            {/* Credit Button */}
            <a
              href="https://github.com/chaitanyakumar-ReDSeC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#14141d] hover:bg-[#1a1a26] border border-[#262638] hover:border-[#3a3a52] text-gray-300 hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 group shadow-sm"
              id="github-credit-btn"
            >
              <Github className="w-3.5 h-3.5 text-[#e23636] group-hover:scale-110 transition-transform" />
              <span>Created by <strong className="text-white font-mono">chaitanyakumar-ReDSeC</strong></span>
              <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-gray-300 transition-colors" />
            </a>
          </div>

          {/* Interactive Dynamic Counter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-3 bg-[#121218] hover:bg-[#181822] px-4 py-2.5 rounded-xl border transition-all duration-200 shadow-md ${
                isOpen ? 'border-[#e23636] ring-2 ring-[#e23636]/20' : 'border-[#262634] hover:border-[#38384d]'
              }`}
              id="catalog-counter-btn"
            >
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#e23636]" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Catalog: <strong className="text-white font-mono text-sm ml-1">{totalCount}</strong>
                </span>
              </div>

              <span className="h-4 w-px bg-[#262634]" />

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-[11px] font-semibold text-gray-400">Platform Breakdown</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#e23636]' : ''}`} />
              </div>
            </button>

            {/* Dropdown Stats Overlay */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0f0f15] border border-[#2a2a3a] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#222230] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      Platform &amp; Media Stats
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 bg-[#1a1a24] px-2 py-0.5 rounded">
                    Total: {totalCount}
                  </span>
                </div>

                {/* Media Type Breakdown */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="bg-[#14141c] p-2 rounded-lg border border-[#222230]">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Movies</span>
                    <span className="text-sm font-black font-mono text-white">{moviesCount}</span>
                  </div>
                  <div className="bg-[#14141c] p-2 rounded-lg border border-[#222230]">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Series</span>
                    <span className="text-sm font-black font-mono text-purple-400">{seriesCount}</span>
                  </div>
                  <div className="bg-[#14141c] p-2 rounded-lg border border-[#222230]">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Specials</span>
                    <span className="text-sm font-black font-mono text-amber-400">{specialsCount}</span>
                  </div>
                </div>

                {/* Platform Counts */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-extrabold tracking-widest text-gray-500 mb-1">
                    Available Streaming &amp; Downloads
                  </div>

                  {/* Disney+ Hotstar */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#14141d] border border-[#222230] hover:border-blue-500/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                        <Play className="w-3 h-3 fill-blue-400" />
                      </div>
                      <span className="text-xs font-bold text-gray-200">Disney+ Hotstar</span>
                    </div>
                    <span className="text-xs font-mono font-black text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                      {hotstarCount} titles
                    </span>
                  </div>

                  {/* Netflix */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#14141d] border border-[#222230] hover:border-red-500/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                        <Play className="w-3 h-3 fill-red-400" />
                      </div>
                      <span className="text-xs font-bold text-gray-200">Netflix</span>
                    </div>
                    <span className="text-xs font-mono font-black text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                      {netflixCount} titles
                    </span>
                  </div>

                  {/* YTS Torrents */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#14141d] border border-[#222230] hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Download className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold text-gray-200">YTS Torrents</span>
                    </div>
                    <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      {ytsCount} titles
                    </span>
                  </div>

                  {/* Amazon Prime Video */}
                  {amznCount > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#14141d] border border-[#222230] hover:border-sky-500/40 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                          <Play className="w-3 h-3 fill-sky-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-200">Amazon Prime</span>
                      </div>
                      <span className="text-xs font-mono font-black text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                        {amznCount} titles
                      </span>
                    </div>
                  )}
                </div>

                {/* CSV File direct link */}
                {/* <div className="mt-3 pt-2.5 border-t border-[#222230] flex items-center justify-between text-[11px] text-gray-400">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Loaded from <code className="text-amber-300 font-mono text-[10px]">/mcu_catalog.csv</code></span>
                  </div>
                  <a
                    href="/mcu_catalog.csv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#e23636] hover:underline font-bold"
                  >
                    CSV File <ExternalLink className="w-3 h-3" />
                  </a>
                </div> */}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
