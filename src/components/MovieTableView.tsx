import React from 'react';
import { ExternalLink, Play, Download, AlertCircle, Clock } from 'lucide-react';
import { MCUItem } from '../types';

interface MovieTableViewProps {
  items: MCUItem[];
  onSelect: (item: MCUItem) => void;
}

export const MovieTableView: React.FC<MovieTableViewProps> = ({ items, onSelect }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[#222222] bg-[#0a0a0a] shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#111111] border-b border-[#222222] text-xs uppercase tracking-widest text-gray-400 font-bold">
            <th className="py-3.5 px-4 w-16 text-center">Counter</th>
            <th className="py-3.5 px-4 min-w-[200px]">Title</th>
            <th className="py-3.5 px-4 w-32">Phase</th>
            <th className="py-3.5 px-4 w-24">Format</th>
            <th className="py-3.5 px-4 min-w-[130px]">HotStar</th>
            <th className="py-3.5 px-4 min-w-[130px]">Netflix</th>
            <th className="py-3.5 px-4 min-w-[130px]">Amazon Prime</th>
            <th className="py-3.5 px-4 min-w-[130px]">YTS Torrent</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222222] text-sm">
          {items.map((item) => {
            const isHotstarAvailable = item.hotstarStatus === 'available' && item.hotstarUrl;
            const isYtsAvailable = item.ytsStatus === 'available' && item.ytsUrl;
            const isNetflixAvailable = item.netflixStatus === 'available' && item.netflixUrl;
            const isAmznAvailable = item.amznPrimeStatus === 'available' && item.amznPrimeUrl;

            return (
              <tr 
                key={item.id} 
                className="hover:bg-[#111111] transition-colors group"
                id={`table-row-${item.order}`}
              >
                {/* Left Counter */}
                <td className="py-3 px-4 text-center">
                  <span className="inline-block font-mono text-[11px] font-black text-[#e23636] bg-[#e23636]/10 border border-[#e23636]/30 px-2 py-0.5 rounded">
                    #{String(item.order).padStart(2, '0')}
                  </span>
                </td>

                {/* Title & Year */}
                <td className="py-3 px-4 font-bold text-white uppercase tracking-wide">
                  <div className="flex items-center gap-3">
                    <span 
                      onClick={() => onSelect(item)} 
                      className="cursor-pointer hover:text-[#e23636] transition-colors"
                    >
                      {item.title}
                    </span>
                    {item.year && (
                      <span className="text-xs font-mono font-medium text-gray-500 bg-[#1c1c1c] px-1.5 py-0.5 rounded">
                        {item.year}
                      </span>
                    )}
                  </div>
                </td>

                {/* Phase */}
                <td className="py-3 px-4 text-xs text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  {item.phase}
                </td>

                {/* Type */}
                <td className="py-3 px-4 text-xs uppercase font-bold tracking-wider whitespace-nowrap">
                  <span className={`inline-block ${
                    item.mediaType === 'show' ? 'text-purple-400' : 'text-gray-300'
                  }`}>
                    {item.mediaType === 'show' ? 'Series' : item.mediaType === 'special' ? 'Special' : 'Movie'}
                  </span>
                </td>

                {/* Hotstar */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {isHotstarAvailable ? (
                    <a
                      href={item.hotstarUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white uppercase text-[10px] font-extrabold tracking-wider transition-all shadow-md shadow-blue-900/20"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Hotstar</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 uppercase font-bold">
                      <AlertCircle className="w-3 h-3" />
                      Unavailable
                    </span>
                  )}
                </td>

                {/* Netflix */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {isNetflixAvailable ? (
                    <a
                      href={item.netflixUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#E50914] to-[#b81d24] hover:from-[#f6121d] hover:to-[#E50914] text-white uppercase text-[10px] font-extrabold tracking-wider transition-all shadow-md shadow-red-900/30"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Netflix</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-600 uppercase font-bold">
                      —
                    </span>
                  )}
                </td>

                {/* Amazon Prime */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {isAmznAvailable ? (
                    <a
                      href={item.amznPrimeUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white uppercase text-[10px] font-extrabold tracking-wider transition-all shadow-md shadow-sky-900/30"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Prime</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-600 uppercase font-bold">
                      —
                    </span>
                  )}
                </td>

                {/* YTS */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {isYtsAvailable ? (
                    <a
                      href={item.ytsUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white uppercase text-[10px] font-extrabold tracking-wider transition-all shadow-md shadow-emerald-900/20"
                    >
                      <Download className="w-3 h-3" />
                      <span>YTS</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 uppercase font-bold">
                      <Clock className="w-3 h-3" />
                      Unavailable
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
