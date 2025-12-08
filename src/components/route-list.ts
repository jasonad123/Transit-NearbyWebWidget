// Route list component - Light DOM for CSS compatibility
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { getMinutesUntil } from '../utils/time';

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
  closest_stop?: { stop_name: string };
}

interface ScheduleItem {
  departure_time: number;
  is_real_time: boolean;
  is_last?: boolean;
}

interface RouteState extends Route {
  current_itinerary_index: number;
}

@customElement('route-list')
export class RouteList extends LitElement {
  // Render to Light DOM so original CSS applies
  createRenderRoot() {
    return this;
  }

  @property({ type: Array })
  routes: Route[] = [];

  @property({ type: Boolean })
  sortByTime = false;

  @property({ type: Boolean })
  loading = false;

  @state()
  private routeStates: RouteState[] = [];

  @state()
  private currentTime = Date.now();

  private updateTimer?: number;

  connectedCallback() {
    super.connectedCallback();
    this.startTimeUpdates();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.updateTimer) clearInterval(this.updateTimer);
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('routes')) {
      this.initializeRouteStates();
    }
  }

  private initializeRouteStates() {
    this.routeStates = this.routes.map(route => ({
      ...route,
      current_itinerary_index: 0
    }));

    if (this.sortByTime) {
      this.sortRoutesByNextDeparture();
    }
  }

  private sortRoutesByNextDeparture() {
    const now = this.currentTime / 1000;

    this.routeStates.sort((a, b) => {
      const aTime = this.getNextDepartureTime(a, now);
      const bTime = this.getNextDepartureTime(b, now);

      if (aTime && bTime) return aTime - bTime;
      if (aTime) return -1;
      if (bTime) return 1;
      return 0;
    });
  }

  private getNextDepartureTime(route: RouteState, now: number): number | null {
    const itinerary = route.itineraries[route.current_itinerary_index];
    const next = itinerary.schedule_items.find(item => item.departure_time > now);
    return next ? next.departure_time : null;
  }

  private startTimeUpdates() {
    this.updateTimer = window.setInterval(() => {
      this.currentTime = Date.now();
    }, 3000); // Update every 3 seconds like original
  }

  private cycleItinerary(index: number) {
    this.routeStates[index].current_itinerary_index =
      (this.routeStates[index].current_itinerary_index + 1) %
      this.routeStates[index].itineraries.length;

    this.requestUpdate();
  }

  private getNextDepartures(itinerary: Itinerary): ScheduleItem[] {
    const now = this.currentTime / 1000;
    return itinerary.schedule_items
      .filter(item => {
        const minutes = getMinutesUntil(item.departure_time);
        return minutes >= 0 && minutes <= 90;
      })
      .slice(0, 3);
  }

  private isDarkText(textColor: string): boolean {
    return textColor === '000000';
  }

  render() {
    if (this.loading || this.routeStates.length === 0) {
      return html`<div id="routes"></div>`;
    }

    return html`
      <div id="routes">
        ${repeat(
          this.routeStates,
          (route) => `${route.route_short_name}-${route.route_long_name}`,
          (route, index) => this.renderRoute(route, index)
        )}
      </div>
    `;
  }

  private renderRoute(route: RouteState, routeIndex: number) {
    const darkText = this.isDarkText(route.route_text_color);

    return html`
      <div
        class="route ${darkText ? 'white' : ''}"
        style="background: #${route.route_color}; color: #${route.route_text_color};"
        role="tablist"
        @click=${() => this.cycleItinerary(routeIndex)}
      >
        <h1 role="presentation">
          <span>${route.route_short_name}</span>
        </h1>

        <div class="pagination" role="presentation">
          ${route.itineraries.map((_, i) => html`
            <i class="${i === route.current_itinerary_index ? 'active' : ''}"></i>
          `)}
        </div>

        ${route.itineraries.map((itinerary, dirIndex) =>
          this.renderItinerary(route, itinerary, dirIndex)
        )}
      </div>
    `;
  }

  private renderItinerary(route: RouteState, itinerary: Itinerary, dirIndex: number) {
    const selected = dirIndex === route.current_itinerary_index;
    const marginLeft = dirIndex === 0 ? `-${route.current_itinerary_index * 100}%` : '0';
    const departures = this.getNextDepartures(itinerary);

    return html`
      <div
        class="content ${selected ? 'active' : ''}"
        style="${dirIndex === 0 ? `margin-left: ${marginLeft};` : ''}"
        role="tab"
        tabindex="${selected ? '0' : '-1'}"
        aria-selected="${selected}"
      >
        <div class="info">
          <h1>
            <span>${route.route_short_name}</span>
          </h1>

          <h3 aria-label="Line ${route.route_short_name}, Direction ${itinerary.headsign}">
            ${itinerary.headsign}
          </h3>

          ${itinerary.closest_stop ? html`
            <p aria-hidden="true">${itinerary.closest_stop.stop_name}</p>
          ` : ''}
        </div><div class="time">
          ${departures.length > 0 ? html`
            ${departures.map((dep, i) => {
              const minutes = getMinutesUntil(dep.departure_time);
              return html`
                <h2 data-time="${dep.departure_time}">
                  <span>${minutes}</span>

                  ${dep.is_real_time ? html`
                    <i class="realtime"></i>
                  ` : ''}
                  <small class="${dep.is_last ? 'last' : ''}">
                    ${dep.is_last ? 'last' : 'min'}
                  </small>
                </h2>
              `;
            })}

            <small>minutes</small>
          ` : ''}
          <i class="inactive" style="${departures.length === 0 ? 'display: block;' : 'display: none;'}"></i>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'route-list': RouteList;
  }
}
