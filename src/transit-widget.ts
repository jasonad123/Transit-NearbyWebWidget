// Main Lit web component
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TransitAPI } from './api/transit';
import { parseHashParams, updateHash } from './utils/url';
import './components/search-box';
import './components/route-list';

interface Route {
  route_color: string;
  route_text_color: string;
  route_short_name: string;
  route_long_name: string;
  itineraries: Itinerary[];
}

interface Itinerary {
  headsign: string;
  schedule_items: ScheduleItem[];
}

interface ScheduleItem {
  departure_time: number;
  is_real_time: boolean;
}

@customElement('transit-widget')
export class TransitWidget extends LitElement {
  // Render to Light DOM so original CSS applies
  createRenderRoot() {
    return this;
  }

  @property({ type: String })
  apiKey = '';

  @property({ type: Number })
  latitude = 45.51485;

  @property({ type: Number })
  longitude = -73.55965;

  @property({ type: Number })
  distance = 500;

  @property({ type: Boolean })
  sortByTime = false;

  @state()
  private routes: Route[] = [];

  @state()
  private loading = false;

  @state()
  private error = '';

  private api!: TransitAPI;
  private refreshTimer?: number;

  connectedCallback() {
    super.connectedCallback();

    // Initialize API (no key needed - using Express proxy)
    this.api = new TransitAPI();

    // Parse hash params for embedding
    const params = parseHashParams();
    if (params.lat) this.latitude = params.lat;
    if (params.lng) this.longitude = params.lng;
    if (params.distance) this.distance = params.distance;
    if (params.sortByTime) this.sortByTime = params.sortByTime;

    // Listen for hash changes
    window.addEventListener('hashchange', this.handleHashChange);

    // Load initial data
    this.loadNearbyRoutes();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this.handleHashChange);
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
  }

  private handleHashChange = () => {
    const params = parseHashParams();
    if (params.lat && params.lng) {
      this.latitude = params.lat;
      this.longitude = params.lng;
      this.loadNearbyRoutes();
    }
  };

  private async loadNearbyRoutes() {
    this.loading = true;
    this.error = '';

    try {
      const response = await this.api.getNearbyRoutes({
        lat: this.latitude,
        lon: this.longitude,
        max_distance: this.distance
      });

      this.routes = response.routes;

      // Schedule refresh
      if (this.refreshTimer) clearTimeout(this.refreshTimer);
      this.refreshTimer = window.setTimeout(() => this.loadNearbyRoutes(), 30000);

    } catch (err) {
      this.error = 'Failed to load routes. Please try again.';
      console.error('Error loading routes:', err);
    } finally {
      this.loading = false;
    }
  }

  private handleSearch = async (e: CustomEvent<{ query: string }>) => {
    const { query } = e.detail;

    try {
      const results = await this.api.searchStops({
        lat: this.latitude,
        lon: this.longitude,
        query
      });

      // Pass results to search-box component
      const searchBox = this.querySelector('search-box') as any;
      if (searchBox && searchBox.setResults) {
        searchBox.setResults(results.results || []);
      }

    } catch (err) {
      console.error('Search error:', err);
    }
  };

  private handleLocationSelect = (e: CustomEvent<{ lat: number; lon: number; name: string }>) => {
    const { lat, lon, name } = e.detail;
    this.latitude = lat;
    this.longitude = lon;
    updateHash(lat, lon, name);
    this.loadNearbyRoutes();
  };

  private handleLocationFound = (e: CustomEvent<GeolocationCoordinates>) => {
    const coords = e.detail;
    this.latitude = coords.latitude;
    this.longitude = coords.longitude;
    updateHash(coords.latitude, coords.longitude, 'Current location');
    this.loadNearbyRoutes();
  };

  render() {
    return html`
      <form role="search" action="">
        <search-box
          @search=${this.handleSearch}
          @location-select=${this.handleLocationSelect}
          @location-request=${this.handleLocationFound}
        ></search-box>
      </form>

      ${this.loading ? html`
        <div id="loading" style="display: block;">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;">
            <path fill="#fff" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
              <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>
            </path>
          </svg>
          loading...
        </div>
      ` : ''}

      <route-list
        .routes=${this.routes}
        .sortByTime=${this.sortByTime}
        .loading=${this.loading}
      ></route-list>

      <div class="error">
        <p>${this.error}</p>
      </div>

      <div id="power_by" role="contentinfo">
        <span>Powered by</span>
        ${' '}
        <div id="transit-logo"></div>
        ${' '}
        <a target="_blank" href="https://transitapp.com" aria-label="Powered by Transit">Transit</a>
        .
        <br>
        Free on
        <a class="download" target="_blank" href="https://transitapp.com/download/ios.html?c=widget" aria-label="Download free for iOS">iOS</a>
        ${' and '}
        <a class="download" target="_blank" href="https://transitapp.com/download/android.html?c=widget" aria-label="Download free for Android">Android</a>
        .
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'transit-widget': TransitWidget;
  }
}
