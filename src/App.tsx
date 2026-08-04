import React, { useState, useMemo, useEffect } from 'react';
import { fetchMCUFromCSV } from './utils/csvLoader';
import { FilterState, MCUItem, ViewMode } from './types';
import { Header } from './components/Header';
import { PhaseFilter } from './components/PhaseFilter';
import { MovieCard } from './components/MovieCard';
import { MovieTableView } from './components/MovieTableView';
import { MovieModal } from './components/MovieModal';
import { Clapperboard, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [catalog, setCatalog] = useState<MCUItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadedFromCSV, setIsLoadedFromCSV] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedMovie, setSelectedMovie] = useState<MCUItem | null>(null);

  // Load from CSV on mount
  useEffect(() => {
    setIsLoading(true);
    fetchMCUFromCSV().then((data) => {
      if (data && data.length > 0) {
        setCatalog(data);
        setIsLoadedFromCSV(true);
      }
      setIsLoading(false);
    });
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    phase: 'All',
    availability: 'all',
    mediaType: 'all',
    sortBy: 'order-asc'
  });

  // Calculate stats and phase list from catalog
  const totalCount = catalog.length;

  const phaseList = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach(item => set.add(item.phase));
    return ['All', ...Array.from(set)];
  }, [catalog]);

  // Filter MCU catalog
  const filteredCatalog = useMemo(() => {
    return catalog.filter((item) => {
      // Phase Filter
      if (filters.phase !== 'All' && item.phase !== filters.phase) {
        return false;
      }

      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesOrder = String(item.order) === q || `#${item.order}` === q || String(item.order).padStart(2, '0') === q;
        const matchesYear = item.year?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrder && !matchesYear) {
          return false;
        }
      }

      // Availability
      if (filters.availability === 'hotstar' && item.hotstarStatus !== 'available') {
        return false;
      }
      if (filters.availability === 'yts' && item.ytsStatus !== 'available') {
        return false;
      }
      if (filters.availability === 'both' && (item.hotstarStatus !== 'available' || item.ytsStatus !== 'available')) {
        return false;
      }

      // Media type
      if (filters.mediaType === 'movie' && item.mediaType !== 'movie') {
        return false;
      }
      if (filters.mediaType === 'show' && item.mediaType !== 'show') {
        return false;
      }

      return true;
    });
  }, [catalog, filters]);

  // Modal navigation (prev/next)
  const selectedIndex = selectedMovie ? filteredCatalog.findIndex(i => i.id === selectedMovie.id) : -1;
  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex >= 0 && selectedIndex < filteredCatalog.length - 1;

  const handleNavigateModal = (direction: 'prev' | 'next') => {
    if (selectedIndex === -1) return;
    if (direction === 'prev' && hasPrev) {
      setSelectedMovie(filteredCatalog[selectedIndex - 1]);
    } else if (direction === 'next' && hasNext) {
      setSelectedMovie(filteredCatalog[selectedIndex + 1]);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      phase: 'All',
      availability: 'all',
      mediaType: 'all',
      sortBy: 'order-asc'
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#e23636] selection:text-white">
      {/* Header */}
      <Header 
        catalogItems={catalog}
        isLoadedFromCSV={isLoadedFromCSV}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter Controls */}
        <PhaseFilter
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalCount={totalCount}
          filteredCount={filteredCatalog.length}
          phaseList={phaseList}
          onReset={handleResetFilters}
        />

        {/* Catalog Content - Grouped clearly into Phase Sections */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-10 h-10 text-[#e23636] animate-spin mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Loading Catalog directly from CSV...</p>
          </div>
        ) : filteredCatalog.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="space-y-12">
              {phaseList.filter(p => p !== 'All').map((phaseName) => {
                const phaseItems = filteredCatalog.filter(item => item.phase === phaseName);
                if (phaseItems.length === 0) return null;

                return (
                  <section key={phaseName} className="space-y-4">
                    {/* Phase Section Header */}
                    <div className="flex items-center justify-between border-b border-[#22222e] pb-3 pt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-6 bg-[#e23636] rounded-sm" />
                        <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                          {phaseName}
                        </h2>
                        <span className="text-xs font-mono font-bold text-gray-400 bg-[#16161e] border border-[#262634] px-2.5 py-0.5 rounded-full">
                          {phaseItems.length} {phaseItems.length === 1 ? 'Title' : 'Titles'}
                        </span>
                      </div>
                    </div>

                    {/* Movie Cards Grid for this Phase */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {phaseItems.map((item) => (
                        <MovieCard
                          key={item.id}
                          item={item}
                          onSelect={setSelectedMovie}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            /* Sequential Table View grouped by Phase */
            <div className="space-y-10">
              {phaseList.filter(p => p !== 'All').map((phaseName) => {
                const phaseItems = filteredCatalog.filter(item => item.phase === phaseName);
                if (phaseItems.length === 0) return null;

                return (
                  <section key={phaseName} className="space-y-3">
                    <div className="flex items-center gap-3 border-b border-[#22222e] pb-2">
                      <div className="w-2 h-5 bg-[#e23636] rounded-sm" />
                      <h2 className="text-base font-extrabold uppercase tracking-wider text-white">
                        {phaseName}
                      </h2>
                      <span className="text-xs font-mono font-semibold text-gray-400 bg-[#16161e] px-2 py-0.5 rounded-full border border-[#242430]">
                        {phaseItems.length}
                      </span>
                    </div>

                    <MovieTableView
                      items={phaseItems}
                      onSelect={setSelectedMovie}
                    />
                  </section>
                );
              })}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#0a0a0f] rounded-2xl border border-[#22222e] text-center">
            <div className="w-16 h-16 rounded-full bg-[#1c1214] border border-[#e23636]/30 flex items-center justify-center text-[#e23636] mb-4 shadow-inner">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">
              No titles match your filters
            </h3>
            <p className="text-xs text-gray-400 max-w-md mb-6 uppercase tracking-wider">
              Try searching for a different keyword or resetting your phase &amp; streaming filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-lg bg-[#e23636] hover:bg-[#c92a2a] text-white font-extrabold text-xs uppercase tracking-widest transition-all shadow-lg"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1c1c24] bg-[#0a0a0e] py-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#e23636] uppercase tracking-wider">Marvel Cinematic Universe</span>
            <span>• All MCU Movies in Sequential Order</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500 uppercase tracking-widest text-[10px]">
            <span>Chaitanya Kumar Sathivada</span>
          </div>
        </div>
      </footer>

      {/* Movie Details Modal */}
      <MovieModal
        item={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onNavigate={handleNavigateModal}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
    </div>
  );
}
