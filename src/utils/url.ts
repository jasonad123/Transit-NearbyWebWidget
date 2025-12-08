// URL hash parameter utilities (same for both vanilla and Lit)
interface HashParams {
  lat?: number;
  lng?: number;
  search?: string;
  distance?: number;
  sortByTime?: boolean;
  autoScroll?: number;
  autoCarousel?: number;
  staticDirection?: number;
}

export function parseHashParams(): HashParams {
  const hash = window.location.hash.slice(1);
  if (!hash) return {};

  const regex = /(-?\d+\.\d+),(-?\d+\.\d+)\|?([^\|]*)(\|.+)?/;
  const match = hash.match(regex);

  if (!match) return {};

  const params: HashParams = {
    lat: parseFloat(match[1]),
    lng: parseFloat(match[2]),
    search: decodeURIComponent(match[3] || '')
  };

  if (match[4]) {
    const paramRegex = /\|([^=]+)=([^|]+)/g;
    let paramMatch;

    while ((paramMatch = paramRegex.exec(match[4]))) {
      const key = paramMatch[1];
      const value = paramMatch[2];

      switch (key) {
        case 'distance':
        case 'autoScroll':
        case 'autoCarousel':
        case 'staticDirection':
          params[key] = parseInt(value);
          break;
        case 'sortByTime':
          params[key] = value === '1' || value === 'true';
          break;
      }
    }
  }

  return params;
}

export function updateHash(lat: number, lng: number, search: string = '', additionalParams: Record<string, any> = {}) {
  let hash = `${lat},${lng}`;

  if (search) {
    hash += `|${encodeURIComponent(search)}`;
  }

  for (const [key, value] of Object.entries(additionalParams)) {
    if (value !== undefined && value !== null) {
      hash += `|${key}=${value}`;
    }
  }

  window.location.hash = hash;
}
