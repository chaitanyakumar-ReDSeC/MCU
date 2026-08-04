import { MCUItem, PhaseCategory, MediaType } from '../types';

export function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function formatPosterUrl(url: string): string {
  if (!url) return '';
  let trimmed = url.trim();
  // Transform GitHub blob URLs to raw usercontent URLs so images load directly
  if (trimmed.includes('github.com') && trimmed.includes('/blob/')) {
    trimmed = trimmed.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }
  return trimmed;
}

export function cleanUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '-' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'n/a') {
    return null;
  }
  return trimmed;
}

export function parseMCUCSV(csvText: string): MCUItem[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = parseCSVRow(lines[0]).map(h => h.trim().toLowerCase());
  
  // Find column indices
  const countIdx = headers.indexOf('movie_count');
  const titleIdx = headers.indexOf('title');
  const phaseIdx = headers.indexOf('phase');
  const yearIdx = headers.indexOf('year');
  const typeIdx = headers.indexOf('mediatype');
  const posterIdx = headers.indexOf('poster_link');
  const hotstarIdx = headers.indexOf('hotstar_link');
  const ytsIdx = headers.indexOf('yts_link');
  const netflixIdx = headers.indexOf('netflix_link');
  const amznIdx = headers.indexOf('amznprime_link');

  const items: MCUItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVRow(lines[i]);
    if (cols.length < 2) continue;

    const orderNum = parseInt(cols[countIdx >= 0 ? countIdx : 0] || String(i), 10);
    const title = cols[titleIdx >= 0 ? titleIdx : 1] || `Title ${orderNum}`;
    const phase = (cols[phaseIdx >= 0 ? phaseIdx : 2] || 'Phase 1') as PhaseCategory;
    const year = cols[yearIdx >= 0 ? yearIdx : 3] || '';
    const mediaType = (cols[typeIdx >= 0 ? typeIdx : 4] || 'movie') as MediaType;
    const rawPoster = cols[posterIdx >= 0 ? posterIdx : 5] || '';
    const posterUrl = formatPosterUrl(rawPoster);

    const hotstarUrl = cleanUrl(cols[hotstarIdx >= 0 ? hotstarIdx : 6]);
    const ytsUrl = cleanUrl(cols[ytsIdx >= 0 ? ytsIdx : 7]);
    const netflixUrl = cleanUrl(cols[netflixIdx >= 0 ? netflixIdx : 8]);
    const amznPrimeUrl = cleanUrl(cols[amznIdx >= 0 ? amznIdx : 9]);

    items.push({
      id: `mcu-csv-${orderNum}`,
      order: isNaN(orderNum) ? i : orderNum,
      title,
      phase,
      mediaType: mediaType === 'show' || mediaType === 'special' ? mediaType : 'movie',
      year,
      posterUrl,
      hotstarUrl,
      hotstarStatus: hotstarUrl ? 'available' : 'unavailable',
      ytsUrl,
      ytsStatus: ytsUrl ? 'available' : 'unavailable',
      netflixUrl,
      netflixStatus: netflixUrl ? 'available' : 'unavailable',
      amznPrimeUrl,
      amznPrimeStatus: amznPrimeUrl ? 'available' : 'unavailable'
    });
  }

  return items;
}

export async function fetchMCUFromCSV(): Promise<MCUItem[] | null> {
  try {
    const response = await fetch('/mcu_catalog.csv?t=' + Date.now());
    if (!response.ok) return null;
    const text = await response.text();
    const items = parseMCUCSV(text);
    return items.length > 0 ? items : null;
  } catch (err) {
    console.error('Failed to load CSV:', err);
    return null;
  }
}
