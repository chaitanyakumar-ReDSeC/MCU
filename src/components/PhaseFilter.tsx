import React from 'react';
import { LayoutGrid, Table, Search, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';
import { FilterState, PhaseCategory, ViewMode } from '../types';

interface PhaseFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  totalCount: number;
  filteredCount: number;
  phaseList: string[];
  onReset: () => void;
}

export const PhaseFilter: React.FC<PhaseFilterProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  totalCount,
  filteredCount,
  phaseList,
  onReset
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Bar: Search, View Mode Toggle, and Count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a] p-4 rounded-lg border border-[#222222]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Movie/Series Title..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-[#111111] border border-[#222222] rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#e23636] transition-all"
            id="search-input"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-gray-400 hover:text-white bg-[#222222] px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Availability Filter */}
          <select
            value={filters.availability}
            onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value as any }))}
            className="bg-[#111111] border border-[#222222] text-xs text-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#e23636] uppercase tracking-wider font-medium"
            id="availability-select"
          >
            <option value="all">All Platforms</option>
            <option value="hotstar">On Hotstar</option>
            <option value="netflix">On Netflix</option>
            <option value="amazon-prime">On Amazon Prime Video</option>
            <option value="yts">On YTS</option>
            <option value="both">On Both Platforms</option>
          </select>

          {/* Media Type Filter */}
          <select
            value={filters.mediaType}
            onChange={(e) => setFilters(prev => ({ ...prev, mediaType: e.target.value as any }))}
            className="bg-[#111111] border border-[#222222] text-xs text-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#e23636] uppercase tracking-wider font-medium"
            id="mediatype-select"
          >
            <option value="all">Complete Collection</option>
            <option value="movie">Movies Only</option>
            <option value="show">TV Shows Only</option>
          </select>

          {/* Reset Filters */}
          {(filters.searchQuery || filters.phase !== 'All' || filters.availability !== 'all' || filters.mediaType !== 'all') && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase text-[#e23636] hover:bg-[#e23636]/10 border border-[#e23636]/40 rounded-md transition-all"
              title="Reset all filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#111111] p-1 rounded-md border border-[#222222]">
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#e23636] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              id="grid-view-btn"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                viewMode === 'table'
                  ? 'bg-[#e23636] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              id="table-view-btn"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Phase Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#222222]">
        {phaseList.map((phase) => {
          const isActive = filters.phase === phase;
          return (
            <button
              key={phase}
              onClick={() => setFilters(prev => ({ ...prev, phase }))}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-all ${
                isActive
                  ? 'bg-[#e23636] text-white shadow-sm'
                  : 'bg-[#111111] text-gray-400 hover:text-white border border-[#222222] hover:border-gray-700'
              }`}
              id={`phase-tab-${phase.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {phase}
            </button>
          );
        })}
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-widest px-1">
        <span>
          Displaying <strong className="text-white font-mono">{filteredCount}</strong> of <strong className="text-gray-300 font-mono">{totalCount}</strong> MCU Titles
        </span>

        {filters.phase !== 'All' && (
          <span className="text-[#e23636] font-bold bg-[#111111] px-2.5 py-0.5 rounded border border-[#222222]">
            Filter: {filters.phase}
          </span>
        )}
      </div>
    </div>
  );
};
