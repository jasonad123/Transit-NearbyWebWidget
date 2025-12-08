// Transit API client - uses local Express API proxy
interface NearbyRoutesParams {
  lat: number;
  lon: number;
  max_distance: number;
}

interface SearchStopsParams {
  lat: number;
  lon: number;
  query: string;
}

export class TransitAPI {
  private baseUrl = '/api';

  async getNearbyRoutes(params: NearbyRoutesParams) {
    const url = `${this.baseUrl}/nearby?lat=${params.lat}&lon=${params.lon}&max_distance=${params.max_distance}`;
    return this.fetch(url);
  }

  async searchStops(params: SearchStopsParams) {
    const url = `${this.baseUrl}/stops?lat=${params.lat}&lon=${params.lon}&query=${encodeURIComponent(params.query)}`;
    return this.fetch(url);
  }

  private async fetch(url: string) {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
