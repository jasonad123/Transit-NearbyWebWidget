// Search box Lit component
import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

interface SearchResult {
  lat: number;
  lon: number;
  name: string;
  probability: number;
}

@customElement('search-box')
export class SearchBox extends LitElement {
  // Render to Light DOM so original CSS applies
  createRenderRoot() {
    return this;
  }

  @state()
  private results: SearchResult[] = [];

  @state()
  private showSuggestions = false;

  @state()
  private selectedIndex = -1;

  @state()
  private value = '';

  @query('input')
  private input!: HTMLInputElement;

  private debounceTimer?: number;

  private handleInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    clearTimeout(this.debounceTimer);

    if (!this.value) {
      this.showSuggestions = false;
      return;
    }

    // Debounce search
    this.debounceTimer = window.setTimeout(() => {
      this.dispatchEvent(new CustomEvent('search', {
        detail: { query: this.value }
      }));
    }, 300);
  }

  private handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        this.selectPrevious();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.selectNext();
        break;
      case 'Enter':
        e.preventDefault();
        this.selectCurrent();
        break;
      case 'Escape':
        this.showSuggestions = false;
        break;
    }
  }

  private selectNext() {
    if (this.results.length === 0) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
  }

  private selectPrevious() {
    if (this.results.length === 0) return;
    this.selectedIndex = this.selectedIndex <= 0
      ? this.results.length - 1
      : this.selectedIndex - 1;
  }

  private selectCurrent() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.results.length) {
      this.handleResultClick(this.results[this.selectedIndex]);
    }
  }

  private handleResultClick(result: SearchResult) {
    this.value = result.name;
    this.showSuggestions = false;

    this.dispatchEvent(new CustomEvent('location-select', {
      detail: result
    }));
  }

  private handleFocus() {
    if (this.results.length > 0) {
      this.showSuggestions = true;
    }
  }

  private handleBlur() {
    // Delay to allow click events
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  // Public method to update results from parent
  setResults(results: SearchResult[]) {
    this.results = results.sort((a, b) => b.probability - a.probability);
    this.showSuggestions = results.length > 0;
    this.selectedIndex = -1;
  }

  private handleClick() {
    const input = this.querySelector('input') as HTMLInputElement;
    if (input) {
      input.select();
    }
    if (this.results.length > 0) {
      this.showSuggestions = true;
    }
  }

  private handleLocateClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.geolocation) {
      const button = e.target as HTMLElement;
      button.classList.add('active');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          button.classList.remove('active');
          this.value = 'Current location';

          this.dispatchEvent(new CustomEvent('location-request', {
            detail: position.coords
          }));
        },
        (err) => {
          button.classList.remove('active');
          console.error('Geolocation error:', err);
        }
      );
    }
  }

  render() {
    return html`
      <div id="search">
        <i class="search"></i>
        <input
          name="search"
          placeholder="Search or enter an address"
          .value=${this.value}
          @input=${this.handleInput}
          @keydown=${this.handleKeyDown}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          @click=${this.handleClick}
          role="combobox"
          aria-expanded="${this.showSuggestions}"
          aria-autocomplete="list"
          aria-owns="suggestion_listbox"
          aria-activedescendant="selected"
          aria-label="Search for a location. Start typing to get suggestions"
          autocomplete="off"
        />
        <button
          type="button"
          name="locate"
          aria-label="Use your current location"
          @click=${this.handleLocateClick}
        ></button>
      </div>

      <div id="suggestion_listbox" class="autocomplete" style="display: ${this.showSuggestions ? 'block' : 'none'};">
        <ul>
          ${this.results.map((result, index) => html`
            <li
              id="${index === this.selectedIndex ? 'selected' : ''}"
              role="option"
              class="${index === this.selectedIndex ? 'selected' : ''}"
              aria-selected="${index === this.selectedIndex}"
              @click=${() => this.handleResultClick(result)}
            >
              <span>${result.name}</span>
            </li>
          `)}
        </ul>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-box': SearchBox;
  }
}
