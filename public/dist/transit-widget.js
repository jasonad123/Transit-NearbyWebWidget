const X = globalThis, _e = X.ShadowRoot && (X.ShadyCSS === void 0 || X.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ye = Symbol(), Pe = /* @__PURE__ */ new WeakMap();
class je {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== ye)
      throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this._strings = t;
  }
  // This is a getter so that it's lazy. In practice, this means stylesheets
  // are not created until the first element instance is made.
  get styleSheet() {
    let e = this._styleSheet;
    const t = this._strings;
    if (_e && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = Pe.get(t)), e === void 0 && ((this._styleSheet = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Pe.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
}
const Xe = (s) => {
  if (s._$cssResult$ === !0)
    return s.cssText;
  if (typeof s == "number")
    return s;
  throw new Error(`Value passed to 'css' function must be a 'css' function result: ${s}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`);
}, Ze = (s) => new je(typeof s == "string" ? s : String(s), void 0, ye), ie = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, n, r) => i + Xe(n) + s[r + 1], s[0]);
  return new je(t, s, ye);
}, et = (s, e) => {
  if (_e)
    s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else
    for (const t of e) {
      const i = document.createElement("style"), n = X.litNonce;
      n !== void 0 && i.setAttribute("nonce", n), i.textContent = t.cssText, s.appendChild(i);
    }
}, tt = (s) => {
  let e = "";
  for (const t of s.cssRules)
    e += t.cssText;
  return Ze(e);
}, Te = _e ? (s) => s : (s) => s instanceof CSSStyleSheet ? tt(s) : s;
const { is: st, defineProperty: it, getOwnPropertyDescriptor: Ce, getOwnPropertyNames: nt, getOwnPropertySymbols: rt, getPrototypeOf: Ee } = Object, $ = globalThis;
let x;
const Ne = $.trustedTypes, ot = Ne ? Ne.emptyScript : "", He = $.reactiveElementPolyfillSupportDevMode;
$.litIssuedWarnings ??= /* @__PURE__ */ new Set(), x = (s, e) => {
  e += ` See https://lit.dev/msg/${s} for more information.`, !$.litIssuedWarnings.has(e) && !$.litIssuedWarnings.has(s) && (console.warn(e), $.litIssuedWarnings.add(e));
}, queueMicrotask(() => {
  x("dev-mode", "Lit is in dev mode. Not recommended for production!"), $.ShadyDOM?.inUse && He === void 0 && x("polyfill-support-missing", "Shadow DOM is being polyfilled via `ShadyDOM` but the `polyfill-support` module has not been loaded.");
});
const at = (s) => {
  $.emitLitDebugLogEvents && $.dispatchEvent(new CustomEvent("lit-debug", {
    detail: s
  }));
}, W = (s, e) => s, ee = {
  toAttribute(s, e) {
    switch (e) {
      case Boolean:
        s = s ? ot : null;
        break;
      case Object:
      case Array:
        s = s == null ? s : JSON.stringify(s);
        break;
    }
    return s;
  },
  fromAttribute(s, e) {
    let t = s;
    switch (e) {
      case Boolean:
        t = s !== null;
        break;
      case Number:
        t = s === null ? null : Number(s);
        break;
      case Object:
      case Array:
        try {
          t = JSON.parse(s);
        } catch {
          t = null;
        }
        break;
    }
    return t;
  }
}, be = (s, e) => !st(s, e), ke = {
  attribute: !0,
  type: String,
  converter: ee,
  reflect: !1,
  useDefault: !1,
  hasChanged: be
};
Symbol.metadata ??= Symbol("metadata");
$.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
class C extends HTMLElement {
  /**
   * Adds an initializer function to the class that is called during instance
   * construction.
   *
   * This is useful for code that runs against a `ReactiveElement`
   * subclass, such as a decorator, that needs to do work for each
   * instance, such as setting up a `ReactiveController`.
   *
   * ```ts
   * const myDecorator = (target: typeof ReactiveElement, key: string) => {
   *   target.addInitializer((instance: ReactiveElement) => {
   *     // This is run during construction of the element
   *     new MyController(instance);
   *   });
   * }
   * ```
   *
   * Decorating a field will then cause each instance to run an initializer
   * that adds a controller:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   @myDecorator foo;
   * }
   * ```
   *
   * Initializers are stored per-constructor. Adding an initializer to a
   * subclass does not add it to a superclass. Since initializers are run in
   * constructors, initializers will run in order of the class hierarchy,
   * starting with superclasses and progressing to the instance's class.
   *
   * @nocollapse
   */
  static addInitializer(e) {
    this.__prepare(), (this._initializers ??= []).push(e);
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   * @category attributes
   */
  static get observedAttributes() {
    return this.finalize(), this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()];
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist
   * and stores a {@linkcode PropertyDeclaration} for the property with the
   * given options. The property setter calls the property's `hasChanged`
   * property option or uses a strict identity check to determine whether or not
   * to request an update.
   *
   * This method may be overridden to customize properties; however,
   * when doing so, it's important to call `super.createProperty` to ensure
   * the property is setup correctly. This method calls
   * `getPropertyDescriptor` internally to get a descriptor to install.
   * To customize what properties do when they are get or set, override
   * `getPropertyDescriptor`. To customize the options for a property,
   * implement `createProperty` like this:
   *
   * ```ts
   * static createProperty(name, options) {
   *   options = Object.assign(options, {myOption: true});
   *   super.createProperty(name, options);
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static createProperty(e, t = ke) {
    if (t.state && (t.attribute = !1), this.__prepare(), this.prototype.hasOwnProperty(e) && (t = Object.create(t), t.wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = (
        // Use Symbol.for in dev mode to make it easier to maintain state
        // when doing HMR.
        Symbol.for(`${String(e)} (@property() cache)`)
      ), n = this.getPropertyDescriptor(e, i, t);
      n !== void 0 && it(this.prototype, e, n);
    }
  }
  /**
   * Returns a property descriptor to be defined on the given named property.
   * If no descriptor is returned, the property will not become an accessor.
   * For example,
   *
   * ```ts
   * class MyElement extends LitElement {
   *   static getPropertyDescriptor(name, key, options) {
   *     const defaultDescriptor =
   *         super.getPropertyDescriptor(name, key, options);
   *     const setter = defaultDescriptor.set;
   *     return {
   *       get: defaultDescriptor.get,
   *       set(value) {
   *         setter.call(this, value);
   *         // custom action.
   *       },
   *       configurable: true,
   *       enumerable: true
   *     }
   *   }
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static getPropertyDescriptor(e, t, i) {
    const { get: n, set: r } = Ce(this.prototype, e) ?? {
      get() {
        return this[t];
      },
      set(o) {
        this[t] = o;
      }
    };
    if (n == null) {
      if ("value" in (Ce(this.prototype, e) ?? {}))
        throw new Error(`Field ${JSON.stringify(String(e))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);
      x("reactive-property-without-getter", `Field ${JSON.stringify(String(e))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`);
    }
    return {
      get: n,
      set(o) {
        const l = n?.call(this);
        r?.call(this, o), this.requestUpdate(e, l, i);
      },
      configurable: !0,
      enumerable: !0
    };
  }
  /**
   * Returns the property options associated with the given property.
   * These options are defined with a `PropertyDeclaration` via the `properties`
   * object or the `@property` decorator and are registered in
   * `createProperty(...)`.
   *
   * Note, this method should be considered "final" and not overridden. To
   * customize the options for a given property, override
   * {@linkcode createProperty}.
   *
   * @nocollapse
   * @final
   * @category properties
   */
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ke;
  }
  /**
   * Initializes static own properties of the class used in bookkeeping
   * for element properties, initializers, etc.
   *
   * Can be called multiple times by code that needs to ensure these
   * properties exist before using them.
   *
   * This method ensures the superclass is finalized so that inherited
   * property metadata can be copied down.
   * @nocollapse
   */
  static __prepare() {
    if (this.hasOwnProperty(W("elementProperties")))
      return;
    const e = Ee(this);
    e.finalize(), e._initializers !== void 0 && (this._initializers = [...e._initializers]), this.elementProperties = new Map(e.elementProperties);
  }
  /**
   * Finishes setting up the class so that it's ready to be registered
   * as a custom element and instantiated.
   *
   * This method is called by the ReactiveElement.observedAttributes getter.
   * If you override the observedAttributes getter, you must either call
   * super.observedAttributes to trigger finalization, or call finalize()
   * yourself.
   *
   * @nocollapse
   */
  static finalize() {
    if (this.hasOwnProperty(W("finalized")))
      return;
    if (this.finalized = !0, this.__prepare(), this.hasOwnProperty(W("properties"))) {
      const t = this.properties, i = [
        ...nt(t),
        ...rt(t)
      ];
      for (const n of i)
        this.createProperty(n, t[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0)
        for (const [i, n] of t)
          this.elementProperties.set(i, n);
    }
    this.__attributeToPropertyMap = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const n = this.__attributeNameForProperty(t, i);
      n !== void 0 && this.__attributeToPropertyMap.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles), this.hasOwnProperty("createProperty") && x("no-override-create-property", "Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators"), this.hasOwnProperty("getPropertyDescriptor") && x("no-override-get-property-descriptor", "Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators");
  }
  /**
   * Takes the styles the user supplied via the `static styles` property and
   * returns the array of styles to apply to the element.
   * Override this method to integrate into a style management system.
   *
   * Styles are deduplicated preserving the _last_ instance in the list. This
   * is a performance optimization to avoid duplicated styles that can occur
   * especially when composing via subclassing. The last item is kept to try
   * to preserve the cascade order with the assumption that it's most important
   * that last added styles override previous styles.
   *
   * @nocollapse
   * @category styles
   */
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const n of i)
        t.unshift(Te(n));
    } else e !== void 0 && t.push(Te(e));
    return t;
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static __attributeNameForProperty(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this.__instanceProperties = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this.__reflectingProperty = null, this.__initialize();
  }
  /**
   * Internal only override point for customizing work done when elements
   * are constructed.
   */
  __initialize() {
    this.__updatePromise = new Promise((e) => this.enableUpdating = e), this._$changedProperties = /* @__PURE__ */ new Map(), this.__saveInstanceProperties(), this.requestUpdate(), this.constructor._initializers?.forEach((e) => e(this));
  }
  /**
   * Registers a `ReactiveController` to participate in the element's reactive
   * update cycle. The element automatically calls into any registered
   * controllers during its lifecycle callbacks.
   *
   * If the element is connected when `addController()` is called, the
   * controller's `hostConnected()` callback will be immediately called.
   * @category controllers
   */
  addController(e) {
    (this.__controllers ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  /**
   * Removes a `ReactiveController` from the element.
   * @category controllers
   */
  removeController(e) {
    this.__controllers?.delete(e);
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs.
   */
  __saveInstanceProperties() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys())
      this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this.__instanceProperties = e);
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   *
   * @return Returns a node into which to render.
   * @category rendering
   */
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return et(e, this.constructor.elementStyles), e;
  }
  /**
   * On first connection, creates the element's renderRoot, sets up
   * element styling, and enables updating.
   * @category lifecycle
   */
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this.__controllers?.forEach((e) => e.hostConnected?.());
  }
  /**
   * Note, this method should be considered final and not overridden. It is
   * overridden on the element instance with a function that triggers the first
   * update.
   * @category updates
   */
  enableUpdating(e) {
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   * @category lifecycle
   */
  disconnectedCallback() {
    this.__controllers?.forEach((e) => e.hostDisconnected?.());
  }
  /**
   * Synchronizes property values when attributes change.
   *
   * Specifically, when an attribute is set, the corresponding property is set.
   * You should rarely need to implement this callback. If this method is
   * overridden, `super.attributeChangedCallback(name, _old, value)` must be
   * called.
   *
   * See [responding to attribute changes](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes)
   * on MDN for more information about the `attributeChangedCallback`.
   * @category attributes
   */
  attributeChangedCallback(e, t, i) {
    this._$attributeToProperty(e, i);
  }
  __propertyToAttribute(e, t) {
    const n = this.constructor.elementProperties.get(e), r = this.constructor.__attributeNameForProperty(e, n);
    if (r !== void 0 && n.reflect === !0) {
      const l = (n.converter?.toAttribute !== void 0 ? n.converter : ee).toAttribute(t, n.type);
      this.constructor.enabledWarnings.includes("migration") && l === void 0 && x("undefined-attribute-value", `The attribute value for the ${e} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`), this.__reflectingProperty = e, l == null ? this.removeAttribute(r) : this.setAttribute(r, l), this.__reflectingProperty = null;
    }
  }
  /** @internal */
  _$attributeToProperty(e, t) {
    const i = this.constructor, n = i.__attributeToPropertyMap.get(e);
    if (n !== void 0 && this.__reflectingProperty !== n) {
      const r = i.getPropertyOptions(n), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : ee;
      this.__reflectingProperty = n;
      const l = o.fromAttribute(t, r.type);
      this[n] = l ?? this.__defaultValues?.get(n) ?? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      l, this.__reflectingProperty = null;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should be called
   * when an element should update based on some state not triggered by setting
   * a reactive property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored.
   *
   * @param name name of requesting property
   * @param oldValue old value of requesting property
   * @param options property options to use instead of the previously
   *     configured options
   * @category updates
   */
  requestUpdate(e, t, i) {
    if (e !== void 0) {
      e instanceof Event && x("", "The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()");
      const n = this.constructor, r = this[e];
      if (i ??= n.getPropertyOptions(e), (i.hasChanged ?? be)(r, t) || // When there is no change, check a corner case that can occur when
      // 1. there's a initial value which was not reflected
      // 2. the property is subsequently set to this value.
      // For example, `prop: {useDefault: true, reflect: true}`
      // and el.prop = 'foo'. This should be considered a change if the
      // attribute is not set because we will now reflect the property to the attribute.
      i.useDefault && i.reflect && r === this.__defaultValues?.get(e) && !this.hasAttribute(n.__attributeNameForProperty(e, i)))
        this._$changeProperty(e, t, i);
      else
        return;
    }
    this.isUpdatePending === !1 && (this.__updatePromise = this.__enqueueUpdate());
  }
  /**
   * @internal
   */
  _$changeProperty(e, t, { useDefault: i, reflect: n, wrapped: r }, o) {
    i && !(this.__defaultValues ??= /* @__PURE__ */ new Map()).has(e) && (this.__defaultValues.set(e, o ?? t ?? this[e]), r !== !0 || o !== void 0) || (this._$changedProperties.has(e) || (!this.hasUpdated && !i && (t = void 0), this._$changedProperties.set(e, t)), n === !0 && this.__reflectingProperty !== e && (this.__reflectingProperties ??= /* @__PURE__ */ new Set()).add(e));
  }
  /**
   * Sets up the element to asynchronously update.
   */
  async __enqueueUpdate() {
    this.isUpdatePending = !0;
    try {
      await this.__updatePromise;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  /**
   * Schedules an element update. You can override this method to change the
   * timing of updates by returning a Promise. The update will await the
   * returned Promise, and you should resolve the Promise to allow the update
   * to proceed. If this method is overridden, `super.scheduleUpdate()`
   * must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```ts
   * override protected async scheduleUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.scheduleUpdate();
   * }
   * ```
   * @category updates
   */
  scheduleUpdate() {
    const e = this.performUpdate();
    return this.constructor.enabledWarnings.includes("async-perform-update") && typeof e?.then == "function" && x("async-perform-update", `Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`), e;
  }
  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * Call `performUpdate()` to immediately process a pending update. This should
   * generally not be needed, but it can be done in rare cases when you need to
   * update synchronously.
   *
   * @category updates
   */
  performUpdate() {
    if (!this.isUpdatePending)
      return;
    if (at?.({ kind: "update" }), !this.hasUpdated) {
      this.renderRoot ??= this.createRenderRoot();
      {
        const r = [...this.constructor.elementProperties.keys()].filter((o) => this.hasOwnProperty(o) && o in Ee(this));
        if (r.length)
          throw new Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${r.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`);
      }
      if (this.__instanceProperties) {
        for (const [n, r] of this.__instanceProperties)
          this[n] = r;
        this.__instanceProperties = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0)
        for (const [n, r] of i) {
          const { wrapped: o } = r, l = this[n];
          o === !0 && !this._$changedProperties.has(n) && l !== void 0 && this._$changeProperty(n, void 0, r, l);
        }
    }
    let e = !1;
    const t = this._$changedProperties;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this.__controllers?.forEach((i) => i.hostUpdate?.()), this.update(t)) : this.__markUpdated();
    } catch (i) {
      throw e = !1, this.__markUpdated(), i;
    }
    e && this._$didUpdate(t);
  }
  /**
   * Invoked before `update()` to compute values needed during the update.
   *
   * Implement `willUpdate` to compute property values that depend on other
   * properties and are used in the rest of the update process.
   *
   * ```ts
   * willUpdate(changedProperties) {
   *   // only need to check changed properties for an expensive computation.
   *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
   *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
   *   }
   * }
   *
   * render() {
   *   return html`SHA: ${this.sha}`;
   * }
   * ```
   *
   * @category updates
   */
  willUpdate(e) {
  }
  // Note, this is an override point for polyfill-support.
  // @internal
  _$didUpdate(e) {
    this.__controllers?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e), this.isUpdatePending && this.constructor.enabledWarnings.includes("change-in-update") && x("change-in-update", `Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`);
  }
  __markUpdated() {
    this._$changedProperties = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. If the Promise is rejected, an
   * exception was thrown during the update.
   *
   * To await additional asynchronous work, override the `getUpdateComplete`
   * method. For example, it is sometimes useful to await a rendered element
   * before fulfilling this Promise. To do this, first await
   * `super.getUpdateComplete()`, then any subsequent state.
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  get updateComplete() {
    return this.getUpdateComplete();
  }
  /**
   * Override point for the `updateComplete` promise.
   *
   * It is not safe to override the `updateComplete` getter directly due to a
   * limitation in TypeScript which means it is not possible to call a
   * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
   * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
   * This method should be overridden instead. For example:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   override async getUpdateComplete() {
   *     const result = await super.getUpdateComplete();
   *     await this._myChild.updateComplete;
   *     return result;
   *   }
   * }
   * ```
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  getUpdateComplete() {
    return this.__updatePromise;
  }
  /**
   * Controls whether or not `update()` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  shouldUpdate(e) {
    return !0;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  update(e) {
    this.__reflectingProperties &&= this.__reflectingProperties.forEach((t) => this.__propertyToAttribute(t, this[t])), this.__markUpdated();
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  updated(e) {
  }
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * ```ts
   * firstUpdated() {
   *   this.renderRoot.getElementById('my-text-area').focus();
   * }
   * ```
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  firstUpdated(e) {
  }
}
C.elementStyles = [];
C.shadowRootOptions = { mode: "open" };
C[W("elementProperties")] = /* @__PURE__ */ new Map();
C[W("finalized")] = /* @__PURE__ */ new Map();
He?.({ ReactiveElement: C });
{
  C.enabledWarnings = [
    "change-in-update",
    "async-perform-update"
  ];
  const s = function(e) {
    e.hasOwnProperty(W("enabledWarnings")) || (e.enabledWarnings = e.enabledWarnings.slice());
  };
  C.enableWarning = function(e) {
    s(this), this.enabledWarnings.includes(e) || this.enabledWarnings.push(e);
  }, C.disableWarning = function(e) {
    s(this);
    const t = this.enabledWarnings.indexOf(e);
    t >= 0 && this.enabledWarnings.splice(t, 1);
  };
}
($.reactiveElementVersions ??= []).push("2.1.1");
$.reactiveElementVersions.length > 1 && queueMicrotask(() => {
  x("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
const b = globalThis, u = (s) => {
  b.emitLitDebugLogEvents && b.dispatchEvent(new CustomEvent("lit-debug", {
    detail: s
  }));
};
let lt = 0, F;
b.litIssuedWarnings ??= /* @__PURE__ */ new Set(), F = (s, e) => {
  e += s ? ` See https://lit.dev/msg/${s} for more information.` : "", !b.litIssuedWarnings.has(e) && !b.litIssuedWarnings.has(s) && (console.warn(e), b.litIssuedWarnings.add(e));
}, queueMicrotask(() => {
  F("dev-mode", "Lit is in dev mode. Not recommended for production!");
});
const w = b.ShadyDOM?.inUse && b.ShadyDOM?.noPatch === !0 ? b.ShadyDOM.wrap : (s) => s, te = b.trustedTypes, Re = te ? te.createPolicy("lit-html", {
  createHTML: (s) => s
}) : void 0, dt = (s) => s, ne = (s, e, t) => dt, ct = (s) => {
  if (V !== ne)
    throw new Error("Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.");
  V = s;
}, ht = () => {
  V = ne;
}, me = (s, e, t) => V(s, e, t), qe = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, Fe = "?" + T, ut = `<${Fe}>`, U = document, K = () => U.createComment(""), G = (s) => s === null || typeof s != "object" && typeof s != "function", $e = Array.isArray, pt = (s) => $e(s) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
typeof s?.[Symbol.iterator] == "function", de = `[ 	
\f\r]`, mt = `[^ 	
\f\r"'\`<>=]`, ft = `[^\\s"'>=/]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ae = 1, ce = 2, gt = 3, Ie = /-->/g, Oe = />/g, I = new RegExp(`>|${de}(?:(${ft}+)(${de}*=${de}*(?:${mt}|("|')|))|$)`, "g"), _t = 0, Me = 1, yt = 2, Ue = 3, he = /'/g, ue = /"/g, Ke = /^(?:script|style|textarea|title)$/i, bt = 1, fe = 2, ge = 3, we = 1, se = 2, $t = 3, wt = 4, xt = 5, xe = 6, St = 7, vt = (s) => (e, ...t) => (e.some((i) => i === void 0) && console.warn(`Some template strings are undefined.
This is probably caused by illegal octal escape sequences.`), t.some((i) => i?._$litStatic$) && F("", `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`), {
  // This property needs to remain unminified.
  _$litType$: s,
  strings: e,
  values: t
}), f = vt(bt), D = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), De = /* @__PURE__ */ new WeakMap(), M = U.createTreeWalker(
  U,
  129
  /* NodeFilter.SHOW_{ELEMENT|COMMENT} */
);
let V = ne;
function Ge(s, e) {
  if (!$e(s) || !s.hasOwnProperty("raw")) {
    let t = "invalid template strings array";
    throw t = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g, `
`), new Error(t);
  }
  return Re !== void 0 ? Re.createHTML(e) : e;
}
const Pt = (s, e) => {
  const t = s.length - 1, i = [];
  let n = e === fe ? "<svg>" : e === ge ? "<math>" : "", r, o = H;
  for (let a = 0; a < t; a++) {
    const c = s[a];
    let y = -1, p, d = 0, h;
    for (; d < c.length && (o.lastIndex = d, h = o.exec(c), h !== null); )
      if (d = o.lastIndex, o === H) {
        if (h[Ae] === "!--")
          o = Ie;
        else if (h[Ae] !== void 0)
          o = Oe;
        else if (h[ce] !== void 0)
          Ke.test(h[ce]) && (r = new RegExp(`</${h[ce]}`, "g")), o = I;
        else if (h[gt] !== void 0)
          throw new Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions");
      } else o === I ? h[_t] === ">" ? (o = r ?? H, y = -1) : h[Me] === void 0 ? y = -2 : (y = o.lastIndex - h[yt].length, p = h[Me], o = h[Ue] === void 0 ? I : h[Ue] === '"' ? ue : he) : o === ue || o === he ? o = I : o === Ie || o === Oe ? o = H : (o = I, r = void 0);
    console.assert(y === -1 || o === I || o === he || o === ue, "unexpected parse state B");
    const m = o === I && s[a + 1].startsWith("/>") ? " " : "";
    n += o === H ? c + ut : y >= 0 ? (i.push(p), c.slice(0, y) + qe + c.slice(y) + T + m) : c + T + (y === -2 ? a : m);
  }
  const l = n + (s[t] || "<?>") + (e === fe ? "</svg>" : e === ge ? "</math>" : "");
  return [Ge(s, l), i];
};
class J {
  constructor({ strings: e, ["_$litType$"]: t }, i) {
    this.parts = [];
    let n, r = 0, o = 0;
    const l = e.length - 1, a = this.parts, [c, y] = Pt(e, t);
    if (this.el = J.createElement(c, i), M.currentNode = this.el.content, t === fe || t === ge) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = M.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        {
          const p = n.localName;
          if (/^(?:textarea|template)$/i.test(p) && n.innerHTML.includes(T)) {
            const d = `Expressions are not supported inside \`${p}\` elements. See https://lit.dev/msg/expression-in-${p} for more information.`;
            if (p === "template")
              throw new Error(d);
            F("", d);
          }
        }
        if (n.hasAttributes())
          for (const p of n.getAttributeNames())
            if (p.endsWith(qe)) {
              const d = y[o++], m = n.getAttribute(p).split(T), _ = /([.?@])?(.*)/.exec(d);
              a.push({
                type: we,
                index: r,
                name: _[2],
                strings: m,
                ctor: _[1] === "." ? Ct : _[1] === "?" ? Et : _[1] === "@" ? Nt : oe
              }), n.removeAttribute(p);
            } else p.startsWith(T) && (a.push({
              type: xe,
              index: r
            }), n.removeAttribute(p));
        if (Ke.test(n.tagName)) {
          const p = n.textContent.split(T), d = p.length - 1;
          if (d > 0) {
            n.textContent = te ? te.emptyScript : "";
            for (let h = 0; h < d; h++)
              n.append(p[h], K()), M.nextNode(), a.push({ type: se, index: ++r });
            n.append(p[d], K());
          }
        }
      } else if (n.nodeType === 8)
        if (n.data === Fe)
          a.push({ type: se, index: r });
        else {
          let d = -1;
          for (; (d = n.data.indexOf(T, d + 1)) !== -1; )
            a.push({ type: St, index: r }), d += T.length - 1;
        }
      r++;
    }
    if (y.length !== o)
      throw new Error('Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=${true} ?disabled=${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: \n`' + e.join("${...}") + "`");
    u && u({
      kind: "template prep",
      template: this,
      clonableTemplate: this.el,
      parts: this.parts,
      strings: e
    });
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @nocollapse */
  static createElement(e, t) {
    const i = U.createElement("template");
    return i.innerHTML = e, i;
  }
}
function B(s, e, t = s, i) {
  if (e === D)
    return e;
  let n = i !== void 0 ? t.__directives?.[i] : t.__directive;
  const r = G(e) ? void 0 : (
    // This property needs to remain unminified.
    e._$litDirective$
  );
  return n?.constructor !== r && (n?._$notifyDirectiveConnectionChanged?.(!1), r === void 0 ? n = void 0 : (n = new r(s), n._$initialize(s, t, i)), i !== void 0 ? (t.__directives ??= [])[i] = n : t.__directive = n), n !== void 0 && (e = B(s, n._$resolve(s, e.values), n, i)), e;
}
class Tt {
  constructor(e, t) {
    this._$parts = [], this._$disconnectableChildren = void 0, this._$template = e, this._$parent = t;
  }
  // Called by ChildPart parentNode getter
  get parentNode() {
    return this._$parent.parentNode;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  // This method is separate from the constructor because we need to return a
  // DocumentFragment and we don't want to hold onto it with an instance field.
  _clone(e) {
    const { el: { content: t }, parts: i } = this._$template, n = (e?.creationScope ?? U).importNode(t, !0);
    M.currentNode = n;
    let r = M.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === se ? c = new re(r, r.nextSibling, this, e) : a.type === we ? c = new a.ctor(r, a.name, a.strings, this, e) : a.type === xe && (c = new kt(r, this, e)), this._$parts.push(c), a = i[++l];
      }
      o !== a?.index && (r = M.nextNode(), o++);
    }
    return M.currentNode = U, n;
  }
  _update(e) {
    let t = 0;
    for (const i of this._$parts)
      i !== void 0 && (u && u({
        kind: "set part",
        part: i,
        value: e[t],
        valueIndex: t,
        values: e,
        templateInstance: this
      }), i.strings !== void 0 ? (i._$setValue(e, i, t), t += i.strings.length - 2) : i._$setValue(e[t])), t++;
  }
}
let re = class Je {
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent?._$isConnected ?? this.__isConnected;
  }
  constructor(e, t, i, n) {
    this.type = se, this._$committedValue = g, this._$disconnectableChildren = void 0, this._$startNode = e, this._$endNode = t, this._$parent = i, this.options = n, this.__isConnected = n?.isConnected ?? !0, this._textSanitizer = void 0;
  }
  /**
   * The parent node into which the part renders its content.
   *
   * A ChildPart's content consists of a range of adjacent child nodes of
   * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
   * `.endNode`).
   *
   * - If both `.startNode` and `.endNode` are non-null, then the part's content
   * consists of all siblings between `.startNode` and `.endNode`, exclusively.
   *
   * - If `.startNode` is non-null but `.endNode` is null, then the part's
   * content consists of all siblings following `.startNode`, up to and
   * including the last child of `.parentNode`. If `.endNode` is non-null, then
   * `.startNode` will always be non-null.
   *
   * - If both `.endNode` and `.startNode` are null, then the part's content
   * consists of all child nodes of `.parentNode`.
   */
  get parentNode() {
    let e = w(this._$startNode).parentNode;
    const t = this._$parent;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  /**
   * The part's leading marker node, if any. See `.parentNode` for more
   * information.
   */
  get startNode() {
    return this._$startNode;
  }
  /**
   * The part's trailing marker node, if any. See `.parentNode` for more
   * information.
   */
  get endNode() {
    return this._$endNode;
  }
  _$setValue(e, t = this) {
    if (this.parentNode === null)
      throw new Error("This `ChildPart` has no `parentNode` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's `innerHTML` or `textContent` can do this.");
    if (e = B(this, e, t), G(e))
      e === g || e == null || e === "" ? (this._$committedValue !== g && (u && u({
        kind: "commit nothing to child",
        start: this._$startNode,
        end: this._$endNode,
        parent: this._$parent,
        options: this.options
      }), this._$clear()), this._$committedValue = g) : e !== this._$committedValue && e !== D && this._commitText(e);
    else if (e._$litType$ !== void 0)
      this._commitTemplateResult(e);
    else if (e.nodeType !== void 0) {
      if (this.options?.host === e) {
        this._commitText("[probable mistake: rendered a template's host in itself (commonly caused by writing ${this} in a template]"), console.warn("Attempted to render the template host", e, "inside itself. This is almost always a mistake, and in dev mode ", "we render some warning text. In production however, we'll ", "render it, which will usually result in an error, and sometimes ", "in the element disappearing from the DOM.");
        return;
      }
      this._commitNode(e);
    } else pt(e) ? this._commitIterable(e) : this._commitText(e);
  }
  _insert(e) {
    return w(w(this._$startNode).parentNode).insertBefore(e, this._$endNode);
  }
  _commitNode(e) {
    if (this._$committedValue !== e) {
      if (this._$clear(), V !== ne) {
        const t = this._$startNode.parentNode?.nodeName;
        if (t === "STYLE" || t === "SCRIPT") {
          let i = "Forbidden";
          throw t === "STYLE" ? i = "Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css`...` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets." : i = "Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.", new Error(i);
        }
      }
      u && u({
        kind: "commit node",
        start: this._$startNode,
        parent: this._$parent,
        value: e,
        options: this.options
      }), this._$committedValue = this._insert(e);
    }
  }
  _commitText(e) {
    if (this._$committedValue !== g && G(this._$committedValue)) {
      const t = w(this._$startNode).nextSibling;
      this._textSanitizer === void 0 && (this._textSanitizer = me(t, "data", "property")), e = this._textSanitizer(e), u && u({
        kind: "commit text",
        node: t,
        value: e,
        options: this.options
      }), t.data = e;
    } else {
      const t = U.createTextNode("");
      this._commitNode(t), this._textSanitizer === void 0 && (this._textSanitizer = me(t, "data", "property")), e = this._textSanitizer(e), u && u({
        kind: "commit text",
        node: t,
        value: e,
        options: this.options
      }), t.data = e;
    }
    this._$committedValue = e;
  }
  _commitTemplateResult(e) {
    const { values: t, ["_$litType$"]: i } = e, n = typeof i == "number" ? this._$getTemplate(e) : (i.el === void 0 && (i.el = J.createElement(Ge(i.h, i.h[0]), this.options)), i);
    if (this._$committedValue?._$template === n)
      u && u({
        kind: "template updating",
        template: n,
        instance: this._$committedValue,
        parts: this._$committedValue._$parts,
        options: this.options,
        values: t
      }), this._$committedValue._update(t);
    else {
      const r = new Tt(n, this), o = r._clone(this.options);
      u && u({
        kind: "template instantiated",
        template: n,
        instance: r,
        parts: r._$parts,
        options: this.options,
        fragment: o,
        values: t
      }), r._update(t), u && u({
        kind: "template instantiated and updated",
        template: n,
        instance: r,
        parts: r._$parts,
        options: this.options,
        fragment: o,
        values: t
      }), this._commitNode(o), this._$committedValue = r;
    }
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @internal */
  _$getTemplate(e) {
    let t = De.get(e.strings);
    return t === void 0 && De.set(e.strings, t = new J(e)), t;
  }
  _commitIterable(e) {
    $e(this._$committedValue) || (this._$committedValue = [], this._$clear());
    const t = this._$committedValue;
    let i = 0, n;
    for (const r of e)
      i === t.length ? t.push(n = new Je(this._insert(K()), this._insert(K()), this, this.options)) : n = t[i], n._$setValue(r), i++;
    i < t.length && (this._$clear(n && w(n._$endNode).nextSibling, i), t.length = i);
  }
  /**
   * Removes the nodes contained within this Part from the DOM.
   *
   * @param start Start node to clear from, for clearing a subset of the part's
   *     DOM (used when truncating iterables)
   * @param from  When `start` is specified, the index within the iterable from
   *     which ChildParts are being removed, used for disconnecting directives
   *     in those Parts.
   *
   * @internal
   */
  _$clear(e = w(this._$startNode).nextSibling, t) {
    for (this._$notifyConnectionChanged?.(!1, !0, t); e !== this._$endNode; ) {
      const i = w(e).nextSibling;
      w(e).remove(), e = i;
    }
  }
  /**
   * Implementation of RootPart's `isConnected`. Note that this method
   * should only be called on `RootPart`s (the `ChildPart` returned from a
   * top-level `render()` call). It has no effect on non-root ChildParts.
   * @param isConnected Whether to set
   * @internal
   */
  setConnected(e) {
    if (this._$parent === void 0)
      this.__isConnected = e, this._$notifyConnectionChanged?.(e);
    else
      throw new Error("part.setConnected() may only be called on a RootPart returned from render().");
  }
};
class oe {
  get tagName() {
    return this.element.tagName;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  constructor(e, t, i, n, r) {
    this.type = we, this._$committedValue = g, this._$disconnectableChildren = void 0, this.element = e, this.name = t, this._$parent = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$committedValue = new Array(i.length - 1).fill(new String()), this.strings = i) : this._$committedValue = g, this._sanitizer = void 0;
  }
  /**
   * Sets the value of this part by resolving the value from possibly multiple
   * values and static strings and committing it to the DOM.
   * If this part is single-valued, `this._strings` will be undefined, and the
   * method will be called with a single value argument. If this part is
   * multi-value, `this._strings` will be defined, and the method is called
   * with the value array of the part's owning TemplateInstance, and an offset
   * into the value array from which the values should be read.
   * This method is overloaded this way to eliminate short-lived array slices
   * of the template instance values, and allow a fast-path for single-valued
   * parts.
   *
   * @param value The part value, or an array of values for multi-valued parts
   * @param valueIndex the index to start reading values from. `undefined` for
   *   single-valued parts
   * @param noCommit causes the part to not commit its value to the DOM. Used
   *   in hydration to prime attribute parts with their first-rendered value,
   *   but not set the attribute, and in SSR to no-op the DOM operation and
   *   capture the value for serialization.
   *
   * @internal
   */
  _$setValue(e, t = this, i, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0)
      e = B(this, e, t, 0), o = !G(e) || e !== this._$committedValue && e !== D, o && (this._$committedValue = e);
    else {
      const l = e;
      e = r[0];
      let a, c;
      for (a = 0; a < r.length - 1; a++)
        c = B(this, l[i + a], t, a), c === D && (c = this._$committedValue[a]), o ||= !G(c) || c !== this._$committedValue[a], c === g ? e = g : e !== g && (e += (c ?? "") + r[a + 1]), this._$committedValue[a] = c;
    }
    o && !n && this._commitValue(e);
  }
  /** @internal */
  _commitValue(e) {
    e === g ? w(this.element).removeAttribute(this.name) : (this._sanitizer === void 0 && (this._sanitizer = V(this.element, this.name, "attribute")), e = this._sanitizer(e ?? ""), u && u({
      kind: "commit attribute",
      element: this.element,
      name: this.name,
      value: e,
      options: this.options
    }), w(this.element).setAttribute(this.name, e ?? ""));
  }
}
class Ct extends oe {
  constructor() {
    super(...arguments), this.type = $t;
  }
  /** @internal */
  _commitValue(e) {
    this._sanitizer === void 0 && (this._sanitizer = V(this.element, this.name, "property")), e = this._sanitizer(e), u && u({
      kind: "commit property",
      element: this.element,
      name: this.name,
      value: e,
      options: this.options
    }), this.element[this.name] = e === g ? void 0 : e;
  }
}
class Et extends oe {
  constructor() {
    super(...arguments), this.type = wt;
  }
  /** @internal */
  _commitValue(e) {
    u && u({
      kind: "commit boolean attribute",
      element: this.element,
      name: this.name,
      value: !!(e && e !== g),
      options: this.options
    }), w(this.element).toggleAttribute(this.name, !!e && e !== g);
  }
}
class Nt extends oe {
  constructor(e, t, i, n, r) {
    if (super(e, t, i, n, r), this.type = xt, this.strings !== void 0)
      throw new Error(`A \`<${e.localName}>\` has a \`@${t}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`);
  }
  // EventPart does not use the base _$setValue/_resolveValue implementation
  // since the dirty checking is more complex
  /** @internal */
  _$setValue(e, t = this) {
    if (e = B(this, e, t, 0) ?? g, e === D)
      return;
    const i = this._$committedValue, n = e === g && i !== g || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, r = e !== g && (i === g || n);
    u && u({
      kind: "commit event listener",
      element: this.element,
      name: this.name,
      value: e,
      options: this.options,
      removeListener: n,
      addListener: r,
      oldListener: i
    }), n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, e), this._$committedValue = e;
  }
  handleEvent(e) {
    typeof this._$committedValue == "function" ? this._$committedValue.call(this.options?.host ?? this.element, e) : this._$committedValue.handleEvent(e);
  }
}
class kt {
  constructor(e, t, i) {
    this.element = e, this.type = xe, this._$disconnectableChildren = void 0, this._$parent = t, this.options = i;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  _$setValue(e) {
    u && u({
      kind: "commit to element binding",
      element: this.element,
      value: e,
      options: this.options
    }), B(this, e);
  }
}
const Rt = {
  _ChildPart: re
}, At = b.litHtmlPolyfillSupportDevMode;
At?.(J, re);
(b.litHtmlVersions ??= []).push("3.3.1");
b.litHtmlVersions.length > 1 && queueMicrotask(() => {
  F("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
const Z = (s, e, t) => {
  if (e == null)
    throw new TypeError(`The container to render into may not be ${e}`);
  const i = lt++, n = t?.renderBefore ?? e;
  let r = n._$litPart$;
  if (u && u({
    kind: "begin render",
    id: i,
    value: s,
    container: e,
    options: t,
    part: r
  }), r === void 0) {
    const o = t?.renderBefore ?? null;
    n._$litPart$ = r = new re(e.insertBefore(K(), o), o, void 0, t ?? {});
  }
  return r._$setValue(s), u && u({
    kind: "end render",
    id: i,
    value: s,
    container: e,
    options: t,
    part: r
  }), r;
};
Z.setSanitizer = ct, Z.createSanitizer = me, Z._testOnlyClearSanitizerFactoryDoNotCallOrElse = ht;
const It = (s, e) => s, N = globalThis;
let Qe;
N.litIssuedWarnings ??= /* @__PURE__ */ new Set(), Qe = (s, e) => {
  e += ` See https://lit.dev/msg/${s} for more information.`, !N.litIssuedWarnings.has(e) && !N.litIssuedWarnings.has(s) && (console.warn(e), N.litIssuedWarnings.add(e));
};
class R extends C {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this.__childPart = void 0;
  }
  /**
   * @category rendering
   */
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * @param changedProperties Map of changed properties with old values
   * @category updates
   */
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this.__childPart = Z(t, this.renderRoot, this.renderOptions);
  }
  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * ```ts
   * connectedCallback() {
   *   super.connectedCallback();
   *   addEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   *
   * @category lifecycle
   */
  connectedCallback() {
    super.connectedCallback(), this.__childPart?.setConnected(!0);
  }
  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * ```ts
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   window.removeEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * An element may be re-connected after being disconnected.
   *
   * @category lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback(), this.__childPart?.setConnected(!1);
  }
  /**
   * Invoked on each update to perform rendering tasks. This method may return
   * any value renderable by lit-html's `ChildPart` - typically a
   * `TemplateResult`. Setting properties inside this method will *not* trigger
   * the element to update.
   * @category rendering
   */
  render() {
    return D;
  }
}
R._$litElement$ = !0;
R[It("finalized")] = !0;
N.litElementHydrateSupport?.({ LitElement: R });
const Ot = N.litElementPolyfillSupportDevMode;
Ot?.({ LitElement: R });
(N.litElementVersions ??= []).push("4.2.1");
N.litElementVersions.length > 1 && queueMicrotask(() => {
  Qe("multiple-versions", "Multiple versions of Lit loaded. Loading multiple versions is not recommended.");
});
const ae = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
let Ye;
globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set(), Ye = (s, e) => {
  e += ` See https://lit.dev/msg/${s} for more information.`, !globalThis.litIssuedWarnings.has(e) && !globalThis.litIssuedWarnings.has(s) && (console.warn(e), globalThis.litIssuedWarnings.add(e));
};
const Mt = (s, e, t) => {
  const i = e.hasOwnProperty(t);
  return e.constructor.createProperty(t, s), i ? Object.getOwnPropertyDescriptor(e, t) : void 0;
}, Ut = {
  attribute: !0,
  type: String,
  converter: ee,
  reflect: !1,
  hasChanged: be
}, Dt = (s = Ut, e, t) => {
  const { kind: i, metadata: n } = t;
  n == null && Ye("missing-class-metadata", `The class ${e} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), i === "setter" && (s = Object.create(s), s.wrapped = !0), r.set(t.name, s), i === "accessor") {
    const { name: o } = t;
    return {
      set(l) {
        const a = e.get.call(this);
        e.set.call(this, l), this.requestUpdate(o, a, s);
      },
      init(l) {
        return l !== void 0 && this._$changeProperty(o, void 0, s, l), l;
      }
    };
  } else if (i === "setter") {
    const { name: o } = t;
    return function(l) {
      const a = this[o];
      e.call(this, l), this.requestUpdate(o, a, s);
    };
  }
  throw new Error(`Unsupported decorator location: ${i}`);
};
function A(s) {
  return (e, t) => typeof t == "object" ? Dt(s, e, t) : Mt(s, e, t);
}
function v(s) {
  return A({
    ...s,
    // Add both `state` and `attribute` because we found a third party
    // controller that is keying off of PropertyOptions.state to determine
    // whether a field is a private internal property or not.
    state: !0,
    attribute: !1
  });
}
const Vt = (s, e, t) => (t.configurable = !0, t.enumerable = !0, // We check for Reflect.decorate each time, in case the zombiefill
// is applied via lazy loading some Angular code.
Reflect.decorate && typeof e != "object" && Object.defineProperty(s, e, t), t);
globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
function zt(s, e) {
  return ((t, i, n) => {
    const r = (o) => o.renderRoot?.querySelector(s) ?? null;
    return Vt(t, i, {
      get() {
        return r(this);
      }
    });
  });
}
class Lt {
  constructor() {
    this.baseUrl = "/api";
  }
  async getNearbyRoutes(e) {
    const t = `${this.baseUrl}/nearby?lat=${e.lat}&lon=${e.lon}&max_distance=${e.max_distance}`;
    return this.fetch(t);
  }
  async searchStops(e) {
    const t = `${this.baseUrl}/stops?lat=${e.lat}&lon=${e.lon}&query=${encodeURIComponent(e.query)}`;
    return this.fetch(t);
  }
  async fetch(e) {
    const t = await fetch(e, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (!t.ok)
      throw new Error(`API request failed: ${t.status} ${t.statusText}`);
    return t.json();
  }
}
function Ve() {
  const s = window.location.hash.slice(1);
  if (!s) return {};
  const e = /(-?\d+\.\d+),(-?\d+\.\d+)\|?([^\|]*)(\|.+)?/, t = s.match(e);
  if (!t) return {};
  const i = {
    lat: parseFloat(t[1]),
    lng: parseFloat(t[2]),
    search: decodeURIComponent(t[3] || "")
  };
  if (t[4]) {
    const n = /\|([^=]+)=([^|]+)/g;
    let r;
    for (; r = n.exec(t[4]); ) {
      const o = r[1], l = r[2];
      switch (o) {
        case "distance":
        case "autoScroll":
        case "autoCarousel":
        case "staticDirection":
          i[o] = parseInt(l);
          break;
        case "sortByTime":
          i[o] = l === "1" || l === "true";
          break;
      }
    }
  }
  return i;
}
function ze(s, e, t = "", i = {}) {
  let n = `${s},${e}`;
  t && (n += `|${encodeURIComponent(t)}`);
  for (const [r, o] of Object.entries(i))
    o != null && (n += `|${r}=${o}`);
  window.location.hash = n;
}
var Wt = Object.defineProperty, Bt = Object.getOwnPropertyDescriptor, j = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? Bt(e, t) : e, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = (i ? o(e, t, n) : o(n)) || n);
  return i && n && Wt(e, t, n), n;
};
let k = class extends R {
  constructor() {
    super(...arguments), this.results = [], this.showSuggestions = !1, this.selectedIndex = -1, this.value = "";
  }
  handleInput(s) {
    if (this.value = s.target.value, clearTimeout(this.debounceTimer), !this.value) {
      this.showSuggestions = !1;
      return;
    }
    this.debounceTimer = window.setTimeout(() => {
      this.dispatchEvent(new CustomEvent("search", {
        detail: { query: this.value }
      }));
    }, 300);
  }
  handleKeyDown(s) {
    switch (s.key) {
      case "ArrowUp":
        s.preventDefault(), this.selectPrevious();
        break;
      case "ArrowDown":
        s.preventDefault(), this.selectNext();
        break;
      case "Enter":
        s.preventDefault(), this.selectCurrent();
        break;
      case "Escape":
        this.showSuggestions = !1;
        break;
    }
  }
  selectNext() {
    this.results.length !== 0 && (this.selectedIndex = (this.selectedIndex + 1) % this.results.length);
  }
  selectPrevious() {
    this.results.length !== 0 && (this.selectedIndex = this.selectedIndex <= 0 ? this.results.length - 1 : this.selectedIndex - 1);
  }
  selectCurrent() {
    this.selectedIndex >= 0 && this.selectedIndex < this.results.length && this.handleResultClick(this.results[this.selectedIndex]);
  }
  handleResultClick(s) {
    this.value = s.name, this.showSuggestions = !1, this.dispatchEvent(new CustomEvent("location-select", {
      detail: s
    }));
  }
  handleFocus() {
    this.results.length > 0 && (this.showSuggestions = !0);
  }
  handleBlur() {
    setTimeout(() => {
      this.showSuggestions = !1;
    }, 200);
  }
  // Public method to update results from parent
  setResults(s) {
    this.results = s.sort((e, t) => t.probability - e.probability), this.showSuggestions = s.length > 0, this.selectedIndex = -1;
  }
  render() {
    return f`
      <div class="search-container">
        <i class="search">🔍</i>
        <input
          type="text"
          placeholder="Search or enter an address"
          .value=${this.value}
          @input=${this.handleInput}
          @keydown=${this.handleKeyDown}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          role="combobox"
          aria-expanded=${this.showSuggestions}
          aria-autocomplete="list"
          aria-label="Search for a location"
        />
      </div>

      ${this.showSuggestions ? f`
        <div class="suggestions">
          <ul role="listbox">
            ${this.results.map((s, e) => f`
              <li
                role="option"
                class=${e === this.selectedIndex ? "selected" : ""}
                aria-selected=${e === this.selectedIndex}
                @click=${() => this.handleResultClick(s)}
              >
                ${s.name}
              </li>
            `)}
          </ul>
        </div>
      ` : ""}
    `;
  }
};
k.styles = ie`
    :host {
      display: block;
      position: relative;
    }

    .search-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: #fff;
    }

    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      padding: 0;
    }

    .suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #fff;
      border: 1px solid #ccc;
      border-top: none;
      border-radius: 0 0 8px 8px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .suggestions ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .suggestions li {
      padding: 0.75rem;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
    }

    .suggestions li:hover,
    .suggestions li.selected {
      background: #f5f5f5;
    }

    .suggestions li:last-child {
      border-bottom: none;
    }
  `;
j([
  v()
], k.prototype, "results", 2);
j([
  v()
], k.prototype, "showSuggestions", 2);
j([
  v()
], k.prototype, "selectedIndex", 2);
j([
  v()
], k.prototype, "value", 2);
j([
  zt("input")
], k.prototype, "input", 2);
k = j([
  ae("search-box")
], k);
const jt = {
  CHILD: 2
}, Ht = (s) => (...e) => ({
  // This property needs to remain unminified.
  _$litDirective$: s,
  values: e
});
class qt {
  constructor(e) {
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  /** @internal */
  _$initialize(e, t, i) {
    this.__part = e, this._$parent = t, this.__attributeIndex = i;
  }
  /** @internal */
  _$resolve(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
}
const { _ChildPart: Ft } = Rt, L = window.ShadyDOM?.inUse && window.ShadyDOM?.noPatch === !0 ? window.ShadyDOM.wrap : (s) => s, Le = () => document.createComment(""), q = (s, e, t) => {
  const i = L(s._$startNode).parentNode, n = e === void 0 ? s._$endNode : e._$startNode;
  if (t === void 0) {
    const r = L(i).insertBefore(Le(), n), o = L(i).insertBefore(Le(), n);
    t = new Ft(r, o, s, s.options);
  } else {
    const r = L(t._$endNode).nextSibling, o = t._$parent, l = o !== s;
    if (l) {
      t._$reparentDisconnectables?.(s), t._$parent = s;
      let a;
      t._$notifyConnectionChanged !== void 0 && (a = s._$isConnected) !== o._$isConnected && t._$notifyConnectionChanged(a);
    }
    if (r !== n || l) {
      let a = t._$startNode;
      for (; a !== r; ) {
        const c = L(a).nextSibling;
        L(i).insertBefore(a, n), a = c;
      }
    }
  }
  return t;
}, O = (s, e, t = s) => (s._$setValue(e, t), s), Kt = {}, Gt = (s, e = Kt) => s._$committedValue = e, Jt = (s) => s._$committedValue, pe = (s) => {
  s._$clear(), s._$startNode.remove();
};
const We = (s, e, t) => {
  const i = /* @__PURE__ */ new Map();
  for (let n = e; n <= t; n++)
    i.set(s[n], n);
  return i;
};
class Qt extends qt {
  constructor(e) {
    if (super(e), e.type !== jt.CHILD)
      throw new Error("repeat() can only be used in text expressions");
  }
  _getValuesAndKeys(e, t, i) {
    let n;
    i === void 0 ? i = t : t !== void 0 && (n = t);
    const r = [], o = [];
    let l = 0;
    for (const a of e)
      r[l] = n ? n(a, l) : l, o[l] = i(a, l), l++;
    return {
      values: o,
      keys: r
    };
  }
  render(e, t, i) {
    return this._getValuesAndKeys(e, t, i).values;
  }
  update(e, [t, i, n]) {
    const r = Jt(e), { values: o, keys: l } = this._getValuesAndKeys(t, i, n);
    if (!Array.isArray(r))
      return this._itemKeys = l, o;
    const a = this._itemKeys ??= [], c = [];
    let y, p, d = 0, h = r.length - 1, m = 0, _ = o.length - 1;
    for (; d <= h && m <= _; )
      if (r[d] === null)
        d++;
      else if (r[h] === null)
        h--;
      else if (a[d] === l[m])
        c[m] = O(r[d], o[m]), d++, m++;
      else if (a[h] === l[_])
        c[_] = O(r[h], o[_]), h--, _--;
      else if (a[d] === l[_])
        c[_] = O(r[d], o[_]), q(e, c[_ + 1], r[d]), d++, _--;
      else if (a[h] === l[m])
        c[m] = O(r[h], o[m]), q(e, r[d], r[h]), h--, m++;
      else if (y === void 0 && (y = We(l, m, _), p = We(a, d, h)), !y.has(a[d]))
        pe(r[d]), d++;
      else if (!y.has(a[h]))
        pe(r[h]), h--;
      else {
        const P = p.get(l[m]), le = P !== void 0 ? r[P] : null;
        if (le === null) {
          const ve = q(e, r[d]);
          O(ve, o[m]), c[m] = ve;
        } else
          c[m] = O(le, o[m]), q(e, r[d], le), r[P] = null;
        m++;
      }
    for (; m <= _; ) {
      const P = q(e, c[_ + 1]);
      O(P, o[m]), c[m++] = P;
    }
    for (; d <= h; ) {
      const P = r[d++];
      P !== null && pe(P);
    }
    return this._itemKeys = l, Gt(e, c), D;
  }
}
const Yt = Ht(Qt);
function Be(s) {
  const e = Date.now() / 1e3;
  return Math.round((s - e) / 60);
}
var Xt = Object.defineProperty, Zt = Object.getOwnPropertyDescriptor, Y = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? Zt(e, t) : e, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = (i ? o(e, t, n) : o(n)) || n);
  return i && n && Xt(e, t, n), n;
};
let z = class extends R {
  constructor() {
    super(...arguments), this.routes = [], this.sortByTime = !1, this.routeStates = [], this.currentTime = Date.now();
  }
  connectedCallback() {
    super.connectedCallback(), this.startTimeUpdates();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.updateTimer && clearInterval(this.updateTimer);
  }
  updated(s) {
    s.has("routes") && this.initializeRouteStates();
  }
  initializeRouteStates() {
    this.routeStates = this.routes.map((s) => ({
      ...s,
      current_itinerary_index: 0
    })), this.sortByTime && this.sortRoutesByNextDeparture();
  }
  sortRoutesByNextDeparture() {
    const s = this.currentTime / 1e3;
    this.routeStates.sort((e, t) => {
      const i = this.getNextDepartureTime(e, s), n = this.getNextDepartureTime(t, s);
      return i && n ? i - n : i ? -1 : n ? 1 : 0;
    });
  }
  getNextDepartureTime(s, e) {
    const i = s.itineraries[s.current_itinerary_index].schedule_items.find((n) => n.departure_time > e);
    return i ? i.departure_time : null;
  }
  startTimeUpdates() {
    this.updateTimer = window.setInterval(() => {
      this.currentTime = Date.now();
    }, 1e4);
  }
  cycleItinerary(s) {
    this.routeStates[s].current_itinerary_index = (this.routeStates[s].current_itinerary_index + 1) % this.routeStates[s].itineraries.length, this.requestUpdate();
  }
  getNextDepartures(s) {
    return this.currentTime / 1e3, s.schedule_items.filter((e) => {
      const t = Be(e.departure_time);
      return t >= 0 && t <= 90;
    }).slice(0, 3);
  }
  render() {
    return this.routeStates.length === 0 ? f`
        <div class="no-routes">
          <p>No routes found nearby</p>
        </div>
      ` : f`
      ${Yt(
      this.routeStates,
      (s) => `${s.route_short_name}-${s.route_long_name}`,
      (s, e) => this.renderRoute(s, e)
    )}
    `;
  }
  renderRoute(s, e) {
    const t = s.itineraries[s.current_itinerary_index], i = this.getNextDepartures(t);
    return f`
      <div
        class="route"
        @click=${() => this.cycleItinerary(e)}
        role="article"
        aria-label="Route ${s.route_short_name} to ${t.headsign}"
      >
        <div
          class="route-header"
          style="background-color: #${s.route_color}; color: #${s.route_text_color}"
        >
          <div class="route-number">${s.route_short_name}</div>
          <div class="route-name">${s.route_long_name}</div>
        </div>

        <div class="route-content">
          <h3>${t.headsign}</h3>

          <div class="departures" role="status">
            ${i.length > 0 ? f`
              <div class="time-list">
                ${i.map((n, r) => {
      const o = Be(n.departure_time);
      return f`
                    <div class="time">
                      <h2>
                        <span>${o}</span>
                        ${n.is_real_time ? f`<small class="realtime">●</small>` : ""}
                      </h2>
                      ${r === 0 ? f`<small>min</small>` : ""}
                    </div>
                  `;
    })}
              </div>
            ` : f`
              <div class="inactive">
                <p>No departures in the next 90 minutes</p>
              </div>
            `}
          </div>
        </div>

        ${s.itineraries.length > 1 ? f`
          <div class="pagination" role="navigation" aria-label="Route directions">
            ${s.itineraries.map((n, r) => f`
              <i
                class=${r === s.current_itinerary_index ? "active" : ""}
                aria-label="Direction ${r + 1} of ${s.itineraries.length}"
              ></i>
            `)}
          </div>
        ` : ""}
      </div>
    `;
  }
};
z.styles = ie`
    :host {
      display: block;
    }

    .route {
      background: #fff;
      border-radius: 8px;
      margin-bottom: 1rem;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.2s;
    }

    .route:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .route-header {
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .route-number {
      font-weight: bold;
      font-size: 1.25rem;
      min-width: 3rem;
      text-align: center;
    }

    .route-name {
      flex: 1;
      font-size: 0.875rem;
    }

    .route-content {
      padding: 1rem;
      background: #f9f9f9;
    }

    .route-content h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      color: #333;
    }

    .departures {
      display: flex;
      gap: 1rem;
    }

    .time-list {
      display: flex;
      gap: 1.5rem;
    }

    .time {
      text-align: center;
    }

    .time h2 {
      font-size: 2rem;
      margin: 0;
      color: #333;
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }

    .time small {
      font-size: 0.75rem;
      color: #666;
    }

    .realtime {
      color: #0f0;
      font-size: 0.5rem;
    }

    .inactive {
      text-align: center;
      padding: 2rem;
      color: #999;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border-top: 1px solid #e0e0e0;
    }

    .pagination i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ccc;
      display: inline-block;
    }

    .pagination i.active {
      background: #333;
    }
  `;
Y([
  A({ type: Array })
], z.prototype, "routes", 2);
Y([
  A({ type: Boolean })
], z.prototype, "sortByTime", 2);
Y([
  v()
], z.prototype, "routeStates", 2);
Y([
  v()
], z.prototype, "currentTime", 2);
z = Y([
  ae("route-list")
], z);
var es = Object.defineProperty, ts = Object.getOwnPropertyDescriptor, Se = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? ts(e, t) : e, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = (i ? o(e, t, n) : o(n)) || n);
  return i && n && es(e, t, n), n;
};
let Q = class extends R {
  constructor() {
    super(...arguments), this.loading = !1, this.error = "";
  }
  async handleClick() {
    if (!navigator.geolocation) {
      this.showError("Geolocation is not supported");
      return;
    }
    this.loading = !0, this.error = "";
    try {
      const s = await this.getCurrentPosition();
      this.dispatchEvent(new CustomEvent("location-found", {
        detail: s.coords
      }));
    } catch (s) {
      const e = s instanceof GeolocationPositionError ? this.getErrorMessage(s.code) : "Unable to determine your location";
      this.showError(e);
    } finally {
      this.loading = !1;
    }
  }
  getCurrentPosition() {
    return new Promise((s, e) => {
      navigator.geolocation.getCurrentPosition(s, e, {
        enableHighAccuracy: !1,
        timeout: 1e4,
        maximumAge: 3e5
      });
    });
  }
  getErrorMessage(s) {
    switch (s) {
      case GeolocationPositionError.PERMISSION_DENIED:
        return "Location permission denied";
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        return "Location unavailable";
      case GeolocationPositionError.TIMEOUT:
        return "Location request timed out";
      default:
        return "Location error";
    }
  }
  showError(s) {
    this.error = s, setTimeout(() => {
      this.error = "";
    }, 3e3);
  }
  render() {
    return f`
      <div style="position: relative;">
        <button
          @click=${this.handleClick}
          ?disabled=${this.loading}
          class=${this.loading ? "active" : ""}
          aria-busy=${this.loading}
          aria-label="Use current location"
        >
          ${this.loading ? f`
            <div class="spinner"></div>
            <span>Locating...</span>
          ` : f`
            <span>📍</span>
            <span>Use my location</span>
          `}
        </button>

        ${this.error ? f`
          <div class="error-message" role="alert">
            ${this.error}
          </div>
        ` : ""}
      </div>
    `;
  }
};
Q.styles = ie`
    :host {
      display: inline-block;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      background: #0066cc;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;
    }

    button:hover {
      background: #0052a3;
    }

    button:active,
    button.active {
      background: #003d7a;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 0.5rem;
      padding: 0.75rem 1rem;
      background: #fee;
      color: #c00;
      border-radius: 4px;
      white-space: nowrap;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `;
Se([
  v()
], Q.prototype, "loading", 2);
Se([
  v()
], Q.prototype, "error", 2);
Q = Se([
  ae("location-button")
], Q);
var ss = Object.defineProperty, is = Object.getOwnPropertyDescriptor, E = (s, e, t, i) => {
  for (var n = i > 1 ? void 0 : i ? is(e, t) : e, r = s.length - 1, o; r >= 0; r--)
    (o = s[r]) && (n = (i ? o(e, t, n) : o(n)) || n);
  return i && n && ss(e, t, n), n;
};
let S = class extends R {
  constructor() {
    super(...arguments), this.apiKey = "", this.latitude = 45.51485, this.longitude = -73.55965, this.distance = 500, this.sortByTime = !1, this.routes = [], this.loading = !1, this.error = "", this.handleHashChange = () => {
      const s = Ve();
      s.lat && s.lng && (this.latitude = s.lat, this.longitude = s.lng, this.loadNearbyRoutes());
    }, this.handleSearch = async (s) => {
      const { query: e } = s.detail;
      try {
        const t = await this.api.searchStops({
          lat: this.latitude,
          lon: this.longitude,
          query: e
        });
        this.dispatchEvent(new CustomEvent("search-results", {
          detail: { results: t.results }
        }));
      } catch (t) {
        console.error("Search error:", t);
      }
    }, this.handleLocationSelect = (s) => {
      const { lat: e, lon: t, name: i } = s.detail;
      this.latitude = e, this.longitude = t, ze(e, t, i), this.loadNearbyRoutes();
    }, this.handleLocationFound = (s) => {
      const e = s.detail;
      this.latitude = e.latitude, this.longitude = e.longitude, ze(e.latitude, e.longitude, "Current location"), this.loadNearbyRoutes();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.api = new Lt();
    const s = Ve();
    s.lat && (this.latitude = s.lat), s.lng && (this.longitude = s.lng), s.distance && (this.distance = s.distance), s.sortByTime && (this.sortByTime = s.sortByTime), window.addEventListener("hashchange", this.handleHashChange), this.loadNearbyRoutes();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("hashchange", this.handleHashChange), this.refreshTimer && clearTimeout(this.refreshTimer);
  }
  async loadNearbyRoutes() {
    this.loading = !0, this.error = "";
    try {
      const s = await this.api.getNearbyRoutes({
        lat: this.latitude,
        lon: this.longitude,
        max_distance: this.distance
      });
      this.routes = s.routes, this.refreshTimer && clearTimeout(this.refreshTimer), this.refreshTimer = window.setTimeout(() => this.loadNearbyRoutes(), 3e4);
    } catch (s) {
      this.error = "Failed to load routes. Please try again.", console.error("Error loading routes:", s);
    } finally {
      this.loading = !1;
    }
  }
  render() {
    return f`
      <div class="widget-container">
        <div class="header">
          <search-box
            @search=${this.handleSearch}
            @location-select=${this.handleLocationSelect}
          ></search-box>

          <location-button
            @location-found=${this.handleLocationFound}
          ></location-button>
        </div>

        <div class="content">
          ${this.error ? f`
            <div class="error" role="alert">${this.error}</div>
          ` : ""}

          ${this.loading ? f`
            <div class="loading" role="status" aria-live="polite">
              <svg width="40" height="40" viewBox="0 0 50 50">
                <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate"
                                  from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>
                </path>
              </svg>
              <p>Loading routes...</p>
            </div>
          ` : f`
            <route-list
              .routes=${this.routes}
              .sortByTime=${this.sortByTime}
            ></route-list>
          `}
        </div>

        <div class="footer" role="contentinfo">
          Powered by <a href="https://transitapp.com" target="_blank">Transit</a>
          <br>
          Free on <a href="https://transitapp.com/download/ios.html" target="_blank">iOS</a>
          and <a href="https://transitapp.com/download/android.html" target="_blank">Android</a>
        </div>
      </div>
    `;
  }
};
S.styles = ie`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 100%;
      height: 100vh;
      overflow: hidden;
    }

    .widget-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .header {
      padding: 1rem;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      flex-shrink: 0;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .footer {
      padding: 1rem;
      text-align: center;
      font-size: 0.875rem;
      color: #666;
      border-top: 1px solid #e0e0e0;
      flex-shrink: 0;
    }

    .footer a {
      color: #0066cc;
      text-decoration: none;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 1rem;
    }

    .error {
      background: #fee;
      color: #c00;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }
  `;
E([
  A({ type: String })
], S.prototype, "apiKey", 2);
E([
  A({ type: Number })
], S.prototype, "latitude", 2);
E([
  A({ type: Number })
], S.prototype, "longitude", 2);
E([
  A({ type: Number })
], S.prototype, "distance", 2);
E([
  A({ type: Boolean })
], S.prototype, "sortByTime", 2);
E([
  v()
], S.prototype, "routes", 2);
E([
  v()
], S.prototype, "loading", 2);
E([
  v()
], S.prototype, "error", 2);
S = E([
  ae("transit-widget")
], S);
export {
  S as TransitWidget
};
//# sourceMappingURL=transit-widget.js.map
