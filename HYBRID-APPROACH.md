# Hybrid Approach: Lit Components + Original CSS

This document explains the hybrid modernization strategy used for this widget, similar to the Transit-TV rewrite.

## The Challenge

The original widget had a highly optimized, compact design with:
- 715 lines of carefully crafted CSS
- Complex hover states and animations
- Information-dense layout (12px base font)
- Real-time pulsing indicators
- Multi-direction route carousels
- Specific visual design language

A complete redesign would have lost this carefully tuned UX.

## The Solution: Light DOM Rendering

Instead of using Shadow DOM (Lit's default), we use **Light DOM** rendering to preserve compatibility with the original CSS.

### How It Works

```typescript
@customElement('route-list')
export class RouteList extends LitElement {
  // Render to Light DOM instead of Shadow DOM
  createRenderRoot() {
    return this;  // Return element itself, not shadow root
  }

  render() {
    // HTML output goes directly into document
    // Original CSS from widget.css applies
    return html`<div id="routes">...</div>`;
  }
}
```

### Why This Matters

**Shadow DOM (default):**
- CSS encapsulation
- Styles don't leak in/out
- Original CSS wouldn't apply
- Would need to rewrite all 715 lines

**Light DOM (our approach):**
- No encapsulation barrier
- Original CSS applies directly
- Components output exact HTML structure CSS expects
- Maintains original visual design

## Architecture

### Component Structure

```
transit-widget (Light DOM)
├── search-box (Light DOM)
│   ├── Renders #search div
│   ├── Renders #suggestion_listbox
│   └── Original CSS applies
│
└── route-list (Light DOM)
    ├── Renders #routes div
    ├── Renders .route elements
    ├── Matches original HTML structure
    └── Original CSS + animations work
```

### HTML Output Compatibility

The components output HTML matching the original doT.js templates:

**Original (doT.js):**
```html
<div class="route white" style="background: #174ba5; color: #fff;">
  <h1><span>10</span></h1>
  <div class="pagination">
    <i class="active"></i>
    <i></i>
  </div>
  <div class="content active">
    <div class="info">
      <h1><span>10</span></h1>
      <h3>Downtown</h3>
      <p>Main St</p>
    </div><div class="time">
      <h2 data-time="1234567890">
        <span>5</span>
        <i class="realtime"></i>
        <small>min</small>
      </h2>
      <small>minutes</small>
    </div>
  </div>
</div>
```

**New (Lit):**
```typescript
html`
  <div class="route ${darkText ? 'white' : ''}"
       style="background: #${route.route_color}; color: #${route.route_text_color};">
    <h1><span>${route.route_short_name}</span></h1>
    <div class="pagination">
      ${route.itineraries.map((_, i) => html`
        <i class="${i === currentIndex ? 'active' : ''}"></i>
      `)}
    </div>
    <!-- Rest matches original structure -->
  </div>
`
```

## Benefits

### 1. Preserved Original Design
- All 715 lines of CSS work unchanged
- Compact, information-dense layout maintained
- Animations and hover states preserved
- Real-time indicators (pulsing waves) still work
- Route carousel interactions identical

### 2. Modern Component Architecture
- Lit's reactive rendering
- TypeScript type safety
- Component lifecycle management
- Cleaner event handling
- Better state management

### 3. Reduced Migration Effort
- No need to rewrite CSS
- No need to recreate animations
- Focus on functionality, not styling
- Faster development time

### 4. Smaller Bundle
- Original: 115 KB (jQuery + doT.js + code)
- New: 77 KB total (22 KB gzipped)
- 33% smaller than original
- Much smaller than Shadow DOM + rewritten CSS would be

## Trade-offs

### What We Gave Up

**CSS Encapsulation:**
- Components aren't fully isolated
- Global styles can affect components
- Components can affect global styles

**Resolution:** Acceptable because:
- This is a standalone widget
- Not intended for complex page integration
- Original design was also global

### What We Gained

**Maintainability:**
- Modern component structure
- Type safety
- Better testing capabilities
- Cleaner code organization

**Performance:**
- Smaller bundle
- Faster initial load
- Efficient reactive updates

**Developer Experience:**
- Hot module replacement
- Better debugging
- TypeScript autocomplete
- Modern tooling (Vite)

## Similar to Transit-TV Approach

Transit-TV also used a hybrid approach:
- SvelteKit with traditional CSS
- Maintained design consistency
- Focused modernization on functionality
- Preserved visual identity

Both projects prioritized:
1. Modern development experience
2. Preserved user experience
3. Pragmatic technical decisions
4. Faster delivery

## Key Differences from Full Shadow DOM

| Aspect | Shadow DOM | Light DOM (Our Approach) |
|--------|-----------|-------------------------|
| CSS Isolation | ✅ Fully isolated | ❌ Global namespace |
| Style Reuse | ❌ Must rewrite | ✅ Original CSS works |
| Bundle Size | Larger | Smaller |
| Migration Effort | High | Medium |
| Visual Parity | Requires recreation | Automatic |

## File Changes

### Components Updated

**transit-widget.ts:**
```typescript
createRenderRoot() {
  return this;  // Light DOM
}
```

**search-box.ts:**
```typescript
createRenderRoot() {
  return this;  // Light DOM
}
```

**route-list.ts:**
```typescript
createRenderRoot() {
  return this;  // Light DOM
}
```

### CSS Loading

**public/index.html:**
```html
<!-- Original widget styles -->
<link rel="stylesheet" href="/css/widget.css">
<link rel="stylesheet" href="/css/widget-modern.css">

<!-- Load the widget -->
<script type="module" src="/js/transit-widget.js"></script>
```

### Result

- Modern Lit components
- Original visual design
- TypeScript safety
- Smaller bundle
- Better DX
- No visual regression

## Lessons Learned

1. **Not all problems need full rewrites** - Sometimes the best solution is hybrid
2. **Shadow DOM isn't always necessary** - Light DOM has valid use cases
3. **Preserve what works** - The original CSS was well-crafted
4. **Focus modernization** - Updated tooling/architecture, kept UX
5. **Pragmatic > Perfect** - Ship working code over ideal architecture

## Future Considerations

If needing true encapsulation later:
- Could migrate to Shadow DOM
- Would need to port CSS
- Could use CSS custom properties for theming
- Would be a larger undertaking

For now, Light DOM hybrid approach is the right balance of:
- Modern development
- Preserved design
- Practical delivery
- Maintainable code
