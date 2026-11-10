import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const EVENT_NAME = 'virtualscroll';

interface SupportInfo {
  hasWheelEvent: boolean;
  hasMouseWheelEvent: boolean;
  hasTouch: boolean;
  hasTouchWin: boolean;
  hasPointer: boolean;
  hasKeyDown: boolean;
  isFirefox: boolean;
}

let support: SupportInfo | undefined;

function getBodyStyle(): CSSStyleDeclaration & { msTouchAction?: string } {
  return document.body.style as CSSStyleDeclaration & { msTouchAction?: string };
}

class TinyEmitter {
  e: Record<string, Array<{ fn: (payload: VirtualScrollPayload) => void; ctx: unknown }>> = {};

  on(name: string, callback: (payload: VirtualScrollPayload) => void, ctx?: unknown) {
    (this.e[name] || (this.e[name] = [])).push({ fn: callback, ctx });
    return this;
  }

  emit(name: string, data: VirtualScrollPayload) {
    for (const listener of (this.e[name] || []).slice()) {
      listener.fn.call(listener.ctx, data);
    }
    return this;
  }

  off(name?: string, callback?: (payload: VirtualScrollPayload) => void) {
    if (name === undefined) {
      this.e = {};
      return this;
    }
    const evts = this.e[name];
    const liveEvents: Array<{ fn: (payload: VirtualScrollPayload) => void; ctx: unknown }> = [];
    if (evts && callback) {
      for (const evt of evts) {
        if (evt.fn !== callback) liveEvents.push(evt);
      }
    }
    if (liveEvents.length) {
      this.e[name] = liveEvents;
    } else {
      delete this.e[name];
    }
    return this;
  }
}

interface VirtualScrollOptions {
  el?: HTMLElement | Window;
  mouseMultiplier?: number;
  touchMultiplier?: number;
  firefoxMultiplier?: number;
  keyStep?: number;
  preventTouch?: boolean;
  unpreventTouchClass?: string;
  useKeyboard?: boolean;
  useTouch?: boolean;
  passive?: boolean;
}

interface VirtualScrollPayload {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  originalEvent: Event;
  touchDevice?: boolean;
}

class VirtualScroll {
  private options: Required<Omit<VirtualScrollOptions, 'el' | 'passive'>> & { passive?: boolean };
  private el: HTMLElement | Window;
  private emitter: TinyEmitter;
  private event: VirtualScrollPayload;
  private touchStart: { x: number; y: number };
  private bodyTouchAction: string | null;
  listenerOptions?: AddEventListenerOptions;

  constructor(options?: VirtualScrollOptions) {
    this.el = window;
    const opts = { ...options };
    if (opts && opts.el) {
      this.el = opts.el;
      delete opts.el;
    }
    if (!support) {
      const nav = navigator as Navigator & { msMaxTouchPoints?: number; msPointerEnabled?: boolean };
      support = {
        hasWheelEvent: 'onwheel' in document,
        hasMouseWheelEvent: 'onmousewheel' in document,
        hasTouch: 'ontouchstart' in document,
        hasTouchWin: Boolean(nav.msMaxTouchPoints && nav.msMaxTouchPoints > 1),
        hasPointer: Boolean(nav.msPointerEnabled),
        hasKeyDown: 'onkeydown' in document,
        isFirefox: navigator.userAgent.indexOf('Firefox') > -1,
      };
    }
    this.options = Object.assign(
      {
        mouseMultiplier: 1,
        touchMultiplier: 2,
        firefoxMultiplier: 15,
        keyStep: 120,
        preventTouch: false,
        unpreventTouchClass: 'vs-touchmove-allowed',
        useKeyboard: true,
        useTouch: true,
      },
      opts
    );
    this.emitter = new TinyEmitter();
    this.event = { y: 0, x: 0, deltaX: 0, deltaY: 0, originalEvent: new Event(EVENT_NAME) };
    this.touchStart = { x: 0, y: 0 };
    this.bodyTouchAction = null;
    if (this.options.passive !== undefined) {
      this.listenerOptions = { passive: this.options.passive };
    }
  }

  private _notify(e: Event) {
    const evt = this.event;
    evt.x += evt.deltaX;
    evt.y += evt.deltaY;
    this.emitter.emit(EVENT_NAME, {
      x: evt.x,
      y: evt.y,
      deltaX: evt.deltaX,
      deltaY: evt.deltaY,
      originalEvent: e,
    });
  }

  private _onWheel = (e: Event) => {
    const we = e as WheelEvent & { wheelDeltaX?: number; wheelDeltaY?: number };
    const options = this.options;
    const evt = this.event;
    evt.deltaX = we.wheelDeltaX || -1 * we.deltaX;
    evt.deltaY = we.wheelDeltaY || -1 * we.deltaY;
    if (support?.isFirefox && we.deltaMode === 1) {
      evt.deltaX *= options.firefoxMultiplier;
      evt.deltaY *= options.firefoxMultiplier;
    }
    evt.deltaX *= options.mouseMultiplier;
    evt.deltaY *= options.mouseMultiplier;
    this._notify(e);
  };

  private _onMouseWheel = (e: Event) => {
    const mwe = e as Event & { wheelDeltaX?: number; wheelDeltaY?: number; wheelDelta?: number };
    const evt = this.event;
    evt.deltaX = mwe.wheelDeltaX ? mwe.wheelDeltaX : 0;
    evt.deltaY = mwe.wheelDeltaY ? mwe.wheelDeltaY : (mwe.wheelDelta ?? 0);
    this._notify(e);
  };

  private _onTouchStart = (e: Event) => {
    const te = e as TouchEvent & { pageX?: number; pageY?: number };
    const t = te.targetTouches ? te.targetTouches[0] : te;
    this.touchStart.x = t.pageX ?? 0;
    this.touchStart.y = t.pageY ?? 0;
  };

  private _onTouchMove = (e: Event) => {
    const te = e as TouchEvent & { pageX?: number; pageY?: number };
    const options = this.options;
    const targetEl = te.target as HTMLElement | null;
    if (options.preventTouch && targetEl && !targetEl.classList.contains(options.unpreventTouchClass)) {
      te.preventDefault();
    }
    const evt = this.event;
    const t = te.targetTouches ? te.targetTouches[0] : te;
    const px = t.pageX ?? 0;
    const py = t.pageY ?? 0;
    evt.deltaX = (px - this.touchStart.x) * options.touchMultiplier;
    evt.deltaY = (py - this.touchStart.y) * options.touchMultiplier;
    this.touchStart.x = px;
    this.touchStart.y = py;
    this._notify(e);
  };

  private _onKeyDown = (e: KeyboardEvent) => {
    const evt = this.event;
    evt.deltaX = evt.deltaY = 0;
    const windowHeight = window.innerHeight - 40;
    switch (e.keyCode) {
      case 37:
      case 38:
        evt.deltaY = this.options.keyStep;
        break;
      case 39:
      case 40:
        evt.deltaY = -this.options.keyStep;
        break;
      case 32:
        evt.deltaY = windowHeight * (e.shiftKey ? 1 : -1);
        break;
      default:
        return;
    }
    this._notify(e);
  };

  private _bind() {
    if (!support) return;
    if (support.hasWheelEvent) {
      this.el.addEventListener('wheel', this._onWheel, this.listenerOptions);
    }
    if (support.hasMouseWheelEvent) {
      this.el.addEventListener('mousewheel', this._onMouseWheel, this.listenerOptions);
    }
    if (support.hasTouch && this.options.useTouch) {
      this.el.addEventListener('touchstart', this._onTouchStart, this.listenerOptions);
      this.el.addEventListener('touchmove', this._onTouchMove, this.listenerOptions);
    }
    if (support.hasPointer && support.hasTouchWin) {
      this.bodyTouchAction = getBodyStyle().msTouchAction ?? null;
      getBodyStyle().msTouchAction = 'none';
      this.el.addEventListener('MSPointerDown', this._onTouchStart, true);
      this.el.addEventListener('MSPointerMove', this._onTouchMove, true);
    }
    if (support.hasKeyDown && this.options.useKeyboard) {
      document.addEventListener('keydown', this._onKeyDown);
    }
  }

  private _unbind() {
    if (!support) return;
    if (support.hasWheelEvent) {
      this.el.removeEventListener('wheel', this._onWheel);
    }
    if (support.hasMouseWheelEvent) {
      this.el.removeEventListener('mousewheel', this._onMouseWheel);
    }
    if (support.hasTouch) {
      this.el.removeEventListener('touchstart', this._onTouchStart);
      this.el.removeEventListener('touchmove', this._onTouchMove);
    }
    if (support.hasPointer && support.hasTouchWin) {
      getBodyStyle().msTouchAction = this.bodyTouchAction ?? '';
      this.el.removeEventListener('MSPointerDown', this._onTouchStart, true);
      this.el.removeEventListener('MSPointerMove', this._onTouchMove, true);
    }
    if (support.hasKeyDown && this.options.useKeyboard) {
      document.removeEventListener('keydown', this._onKeyDown);
    }
  }

  on(callback: (payload: VirtualScrollPayload) => void, ctx?: unknown) {
    this.emitter.on(EVENT_NAME, callback, ctx);
    const events = this.emitter.e;
    if (events && events[EVENT_NAME] && events[EVENT_NAME].length === 1) {
      this._bind();
    }
  }

  off(callback: (payload: VirtualScrollPayload) => void) {
    this.emitter.off(EVENT_NAME, callback);
    const events = this.emitter.e;
    if (!events[EVENT_NAME] || events[EVENT_NAME].length <= 0) {
      this._unbind();
    }
  }

  destroy() {
    this.emitter.off();
    this._unbind();
  }
}

function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function wrapCentered(value: number, length: number): number {
  let rem = value % length;
  if (Math.abs(rem) > length / 2) {
    rem = rem > 0 ? rem - length : rem + length;
  }
  return rem;
}

export interface CarouselViewport {
  itemWidth: number;
  wrapperWidth: number;
  totalWidth: number;
  itemHeight: number;
  wrapperHeight: number;
  totalHeight: number;
  vertical: boolean;
}

export interface CarouselConfig {
  infinite?: boolean;
  snap?: boolean;
  variableWidth?: boolean;
  vertical?: boolean;
  dragSensitivity?: number;
  lerpFactor?: number;
  scrollSensitivity?: number;
  snapStrength?: number;
  speedDecay?: number;
  bounceLimit?: number;
  virtualScroll?: VirtualScrollOptions;
  setOffset?: (viewport: CarouselViewport) => number;
  scrollInput?: boolean;
  onSlideChange?: (current: number, previous: number) => void;
  onResize?: (instance: GsapCarousel) => void;
  onUpdate?: (instance: GsapCarousel) => void;
}

const DEFAULT_CONFIG: Required<
  Omit<CarouselConfig, 'onSlideChange' | 'onResize' | 'onUpdate'>
> = {
  infinite: true,
  snap: true,
  variableWidth: false,
  vertical: false,
  dragSensitivity: 0.005,
  lerpFactor: 0.3,
  scrollSensitivity: 1,
  snapStrength: 0.1,
  speedDecay: 0.85,
  bounceLimit: 1,
  virtualScroll: {
    mouseMultiplier: 0.5,
    touchMultiplier: 2,
    firefoxMultiplier: 30,
    useKeyboard: false,
    passive: true,
  },
  setOffset: ({ itemWidth, itemHeight, vertical }) => (vertical ? itemHeight : itemWidth),
  scrollInput: false,
};

export class GsapCarousel {
  speed = 0;
  private smoothedSpeed = 0;
  private offsetValue = 0;
  private lastTime = 0;
  deltaTime = 0;
  private active = true;
  private isPaused = false;
  private activeSlideIndex = 0;
  private prevSlideIndex = 0;
  config: Required<Omit<CarouselConfig, 'onSlideChange' | 'onResize' | 'onUpdate'>>;
  wrapper: HTMLElement;
  items: HTMLElement[];
  viewport!: CarouselViewport;
  itemWidths: number[] = [];
  itemOffsets: number[] = [];
  itemHeights: number[] = [];
  itemHeightOffsets: number[] = [];
  isDragging = false;
  isTouching = false;
  dragStart = 0;
  dragStartTarget = 0;
  isVisible = false;
  current = 0;
  target = 0;
  maxScroll = 0;
  resizeTimeout?: ReturnType<typeof setTimeout>;
  virtualScroll?: VirtualScroll;
  observer?: IntersectionObserver;
  resizeObserver?: ResizeObserver;
  touchStartY = 0;
  touchStartX = 0;
  touchPreviousX?: number;
  touchPreviousY?: number;
  scrollDirection?: 'horizontal' | 'vertical';
  parallaxValues: number[] = [];
  webglValue = 0;
  onSlideChange?: (current: number, previous: number) => void;
  onResize?: (instance: GsapCarousel) => void;
  onUpdate?: (instance: GsapCarousel) => void;
  private tickerFn: () => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseUp: () => void;
  private boundTouchStart: (e: TouchEvent) => void;
  private boundTouchMove: (e: TouchEvent) => void;
  private boundTouchEnd: () => void;

  constructor(wrapper: HTMLElement, userConfig: CarouselConfig = {}) {
    const { onSlideChange, onResize, onUpdate, ...rest } = userConfig;
    this.config = { ...DEFAULT_CONFIG, ...rest };
    this.onSlideChange = onSlideChange;
    this.onResize = onResize;
    this.onUpdate = onUpdate;
    this.wrapper = wrapper;
    this.items = Array.from(wrapper.children) as HTMLElement[];
    this.current = 0;
    this.target = 0;
    this.isDragging = false;
    this.isTouching = false;
    this.dragStart = 0;
    this.dragStartTarget = 0;
    this.isVisible = false;
    this.activeSlideIndex = 0;
    this.prevSlideIndex = 0;

    this.boundMouseDown = (e: MouseEvent) => this.startDrag(e);
    this.boundMouseMove = (e: MouseEvent) => this.moveDrag(e);
    this.boundMouseUp = () => this.endDrag();
    this.boundTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      this.touchStartY = t.clientY;
      this.touchStartX = t.clientX;
      this.touchPreviousX = t.clientX;
      this.touchPreviousY = t.clientY;
      this.scrollDirection = undefined;
      this.isTouching = true;
      this.startDrag(t);
    };
    this.boundTouchMove = (e: TouchEvent) => {
      if (!this.isTouching || this.isPaused) return;
      const t = e.touches[0];
      const dy = Math.abs(t.clientY - this.touchStartY);
      const dx = Math.abs(t.clientX - this.touchStartX);
      if (!this.scrollDirection && (dx > 5 || dy > 5)) {
        this.scrollDirection = dx > dy ? 'horizontal' : 'vertical';
      }
      if (
        this.config.vertical
          ? this.scrollDirection === 'vertical'
          : this.scrollDirection === 'horizontal'
      ) {
        e.preventDefault();
        this.moveDrag(t);
        if (this.config.vertical) {
          this.touchPreviousY = t.clientY;
        } else {
          this.touchPreviousX = t.clientX;
        }
      }
    };
    this.boundTouchEnd = () => {
      this.isTouching = false;
      this.scrollDirection = undefined;
      this.touchPreviousX = undefined;
      this.touchPreviousY = undefined;
      this.endDrag();
    };

    this.measure();
    this.observeVisibility();
    this.bindEvents();
    this.wrapper.style.cursor = 'grab';
    this.measure();
    this.setupVirtualScroll();

    if (this.config.variableWidth && !this.config.infinite && this.items.length > 0) {
      const initial = this.getVariableTargetForIndex(0);
      this.target = initial;
      this.current = initial;
      this.applyVariableLinearTransforms();
    }

    this.tickerFn = this.update.bind(this);
    gsap.ticker.add(this.tickerFn);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isVisible) return;
    if (/^[0-9]$/.test(e.key)) {
      const idx = parseInt(e.key, 10);
      if (this.config.infinite) {
        this.goToIndex(idx);
      } else if (idx <= this.items.length - 1) {
        this.goToIndex(idx);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowLeft':
        this.goToPrev();
        break;
      case 'ArrowRight':
        this.goToNext();
        break;
      case ' ':
        if (
          document.activeElement &&
          ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(document.activeElement.tagName)
        ) {
          return;
        }
        e.preventDefault();
        this.goToNext();
        break;
    }
  };

  private observeVisibility() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
        });
      },
      { root: null, rootMargin: '50px', threshold: 0 }
    );
    this.observer.observe(this.wrapper);
  }

  private measure() {
    const widths = this.items.map((item) => item.getBoundingClientRect().width);
    const heights = this.items.map((item) => item.getBoundingClientRect().height);
    const wrapperWidth = this.wrapper.clientWidth;
    const wrapperHeight = this.wrapper.clientHeight;
    const totalWidth = widths.reduce((acc, w) => acc + w, 0);
    const totalHeight = heights.reduce((acc, h) => acc + h, 0);
    let wAcc = 0;
    this.itemOffsets = widths.map((w) => {
      const offset = wAcc;
      wAcc += w;
      return offset;
    });
    this.itemWidths = widths;

    let hAcc = 0;
    this.itemHeightOffsets = heights.map((h) => {
      const offset = hAcc;
      hAcc += h;
      return offset;
    });
    this.itemHeights = heights;

    this.viewport = {
      itemWidth: widths[0] ?? 0,
      wrapperWidth,
      totalWidth,
      itemHeight: heights[0] ?? 0,
      wrapperHeight,
      totalHeight,
      vertical: this.config.vertical,
    };

    this.offsetValue = this.config.setOffset(this.viewport);
    if (this.config.variableWidth) {
      this.maxScroll = this.config.vertical
        ? -(this.viewport.totalHeight - this.offsetValue)
        : -(this.viewport.totalWidth - this.offsetValue);
    } else {
      const unit = this.config.vertical
        ? this.viewport.itemHeight || 1
        : this.viewport.itemWidth || 1;
      const total = this.config.vertical
        ? this.viewport.totalHeight
        : this.viewport.totalWidth;
      this.maxScroll = -(total - this.offsetValue) / unit;
    }
    queueMicrotask(() => {
      this.onResize?.(this);
    });
  }

  private bindEvents() {
    this.wrapper.addEventListener('mousedown', this.boundMouseDown);
    window.addEventListener('mousemove', this.boundMouseMove);
    window.addEventListener('mouseup', this.boundMouseUp);
    this.wrapper.addEventListener('touchstart', this.boundTouchStart);
    window.addEventListener('touchmove', this.boundTouchMove, { passive: false });
    window.addEventListener('touchend', this.boundTouchEnd);

    this.resizeObserver = new ResizeObserver(() => {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.resize(), 10);
    });
    this.resizeObserver.observe(this.wrapper);
  }

  private clampBounce(val: number): number {
    if (!this.config.infinite) {
      const unit = this.config.vertical ? this.viewport.itemHeight : this.viewport.itemWidth;
      const limit =
        this.config.variableWidth && unit ? this.config.bounceLimit * unit : this.config.bounceLimit;
      if (val > limit) return limit;
      if (val < this.maxScroll - limit) return this.maxScroll - limit;
    }
    return val;
  }

  private setupVirtualScroll() {
    this.virtualScroll = new VirtualScroll({
      ...this.config.virtualScroll,
      el: this.wrapper,
    });
    this.virtualScroll.on((e) => {
      if (!this.isDragging && !this.isPaused) {
        if (e.touchDevice) {
          const dy = Math.abs(e.deltaY);
          const dx = Math.abs(e.deltaX);
          if (dy < 5 && dx < 5) return;
          if (this.config.vertical) {
            if (dx > dy) return;
          } else if (dy > dx) {
            return;
          }
        }
        const rawDelta = this.config.vertical
          ? this.config.scrollInput
            ? Math.abs(e.deltaY) > Math.abs(e.deltaX)
              ? e.deltaY
              : e.deltaX
            : e.deltaY
          : this.config.scrollInput
          ? Math.abs(e.deltaX) > Math.abs(e.deltaY)
            ? e.deltaX
            : e.deltaY
          : e.deltaX;

        const delta =
          rawDelta *
          (this.config.variableWidth
            ? this.config.scrollSensitivity
            : 0.001 * this.config.scrollSensitivity);
        let nextTarget = this.target + delta;
        if (!this.config.infinite) {
          if (nextTarget > 0) nextTarget = 0;
          else if (nextTarget < this.maxScroll) nextTarget = this.maxScroll;
        }
        this.target = this.clampBounce(nextTarget);
        this.speed = -delta * (this.config.variableWidth ? 0.1 : 10);
      }
    });
  }

  private startDrag(e: { clientX: number; clientY: number }) {
    if (this.isPaused) return;
    this.isDragging = true;
    this.dragStart = this.config.vertical ? e.clientY : e.clientX;
    this.dragStartTarget = this.target;
    this.wrapper.style.cursor = 'grabbing';
  }

  private moveDrag(e: { clientX: number; clientY: number; movementX?: number; movementY?: number }) {
    if (!this.isDragging || this.isPaused) return;
    const delta = this.config.vertical ? e.clientY - this.dragStart : e.clientX - this.dragStart;
    const sens = this.config.variableWidth ? 1 : this.config.dragSensitivity;
    const next = this.dragStartTarget + delta * sens;
    this.target = this.clampBounce(next);
    if ('movementX' in e && typeof e.movementX === 'number') {
      const mv = this.config.vertical ? (e.movementY ?? 0) : e.movementX;
      this.speed += 0.01 * mv;
    } else {
      const cur = this.config.vertical ? e.clientY : e.clientX;
      const prev = this.config.vertical
        ? this.touchPreviousY || cur
        : this.touchPreviousX || cur;
      this.speed += 0.01 * (cur - prev);
    }
  }

  private endDrag() {
    this.isDragging = false;
    this.wrapper.style.cursor = 'grab';
    if (this.config.variableWidth) {
      if (!this.config.infinite) {
        if (this.target > 0) this.target = 0;
        else if (this.target < this.maxScroll) this.target = this.maxScroll;
      }
      if (this.config.snap) {
        this.target = this.getVariableSnapTarget(this.target);
      }
    } else if (this.config.infinite) {
      if (this.config.snap) {
        this.target = Math.round(this.target);
      }
    } else if (this.target > 0) {
      this.target = 0;
    } else if (this.target < this.maxScroll) {
      this.target = this.maxScroll;
    } else if (this.config.snap) {
      const snapped = Math.round(this.target);
      this.target = Math.min(0, Math.max(this.maxScroll, snapped));
    }
  }

  update() {
    if (!this.isVisible || !this.active) return;
    const now = performance.now();
    this.deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (this.config.snap && !this.isDragging) {
      if (this.config.variableWidth) {
        const diff = this.getVariableSnapTarget(this.target) - this.target;
        this.target += diff * this.config.snapStrength;
      } else {
        const diff = Math.round(this.target) - this.target;
        this.target += diff * this.config.snapStrength;
      }
    }

    this.current = damp(this.current, this.target, 1 / this.config.lerpFactor, this.deltaTime);

    if (this.config.infinite) {
      if (this.config.variableWidth) {
        const half = this.config.vertical
          ? this.viewport.wrapperHeight / 2
          : this.viewport.wrapperWidth / 2;
        const wrapped = this.wrapTotalSize(-this.current + half);
        const idx = this.findClosestItemIndex(wrapped);
        this.setSlideIndex(idx);
        this.applyVariableInfiniteTransforms();
      } else {
        const rounded = Math.round(-this.current);
        const len = this.items.length;
        this.setSlideIndex(((rounded % len) + len) % len);
        this.applyFixedInfiniteTransforms();
      }
    } else if (this.config.variableWidth) {
      const half = this.config.vertical
        ? this.viewport.wrapperHeight / 2
        : this.viewport.wrapperWidth / 2;
      const total = this.config.vertical ? this.viewport.totalHeight : this.viewport.totalWidth;
      const clamped = Math.max(0, Math.min(-this.current + half, total));
      this.setSlideIndex(this.findClosestItemIndex(clamped));
      this.applyVariableLinearTransforms();
    } else {
      this.setSlideIndex(Math.round(Math.abs(this.current)));
      this.applyFixedLinearTransforms();
    }

    this.smoothedSpeed = damp(
      this.smoothedSpeed,
      this.speed,
      1 / this.config.lerpFactor,
      this.deltaTime
    );
    this.speed *= this.config.speedDecay;
    this.onUpdate?.(this);
  }

  private applyFixedLinearTransforms() {
    this.parallaxValues = this.items.map((item) => {
      const px = this.config.vertical
        ? this.current * this.viewport.itemHeight
        : this.current * this.viewport.itemWidth;
      const transform = this.config.vertical ? `translateY(${px}px)` : `translateX(${px}px)`;
      item.style.transform = transform;
      return px;
    });
  }

  private applyFixedInfiniteTransforms() {
    this.parallaxValues = this.items.map((item, idx) => {
      const pos = this.current + idx;
      const px =
        (wrapCentered(pos, this.items.length) - idx) *
        (this.config.vertical ? this.viewport.itemHeight : this.viewport.itemWidth);
      const transform = this.config.vertical ? `translateY(${px}px)` : `translateX(${px}px)`;
      item.style.transform = transform;
      return wrapCentered(pos, this.items.length);
    });
  }

  private getItemCenter(idx: number): number {
    if (this.config.vertical) {
      const h = this.itemHeights[idx] ?? this.viewport.itemHeight ?? 0;
      return (this.itemHeightOffsets[idx] ?? 0) + h / 2;
    }
    const w = this.itemWidths[idx] ?? this.viewport.itemWidth ?? 0;
    return (this.itemOffsets[idx] ?? 0) + w / 2;
  }

  private getVariableTargetForIndex(idx: number): number {
    const total = this.config.vertical
      ? this.viewport.totalHeight || 1
      : this.viewport.totalWidth || 1;
    const half = this.config.vertical
      ? this.viewport.wrapperHeight / 2
      : this.viewport.wrapperWidth / 2;
    let targetVal = -(this.getItemCenter(idx) - half);
    if (this.config.infinite) {
      const loops = Math.round((this.target - targetVal) / total);
      targetVal += loops * total;
    } else {
      targetVal = Math.min(0, Math.max(this.maxScroll, targetVal));
    }
    return targetVal;
  }

  private wrapTotalSize(val: number): number {
    const total = this.config.vertical
      ? this.viewport.totalHeight || 1
      : this.viewport.totalWidth || 1;
    return ((val % total) + total) % total;
  }

  private findClosestItemIndex(pos: number): number {
    const offsets = this.config.vertical ? this.itemHeightOffsets : this.itemOffsets;
    if (!offsets.length) return 0;
    const total = this.config.vertical
      ? this.viewport.totalHeight || 1
      : this.viewport.totalWidth || 1;
    const normalized = this.config.infinite
      ? this.wrapTotalSize(pos)
      : Math.max(0, Math.min(pos, total));
    let bestIdx = 0;
    let bestDist = Infinity;
    offsets.forEach((_, idx) => {
      const dist = Math.abs(normalized - this.getItemCenter(idx));
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });
    return bestIdx;
  }

  private getVariableSnapTarget(val: number): number {
    const offsets = this.config.vertical ? this.itemHeightOffsets : this.itemOffsets;
    if (!offsets.length) return val;
    const total = this.config.vertical
      ? this.viewport.totalHeight || 1
      : this.viewport.totalWidth || 1;
    const half = this.config.vertical
      ? this.viewport.wrapperHeight / 2
      : this.viewport.wrapperWidth / 2;
    const pos = this.config.infinite
      ? this.wrapTotalSize(-val + half)
      : Math.max(0, Math.min(-val + half, total));
    const idx = this.findClosestItemIndex(pos);
    return this.getVariableTargetForIndex(idx);
  }

  private applyVariableLinearTransforms() {
    const offsets = this.config.vertical ? this.itemHeightOffsets : this.itemOffsets;
    this.parallaxValues = this.items.map((item, idx) => {
      const px = this.current;
      const transform = this.config.vertical ? `translateY(${px}px)` : `translateX(${px}px)`;
      item.style.transform = transform;
      return px + offsets[idx];
    });
  }

  private applyVariableInfiniteTransforms() {
    const total = this.config.vertical
      ? this.viewport.totalHeight || 1
      : this.viewport.totalWidth || 1;
    const offsets = this.config.vertical ? this.itemHeightOffsets : this.itemOffsets;
    this.parallaxValues = this.items.map((item, idx) => {
      const offset = offsets[idx] ?? 0;
      const px = wrapCentered(this.current + offset, total) - offset;
      const transform = this.config.vertical ? `translateY(${px}px)` : `translateX(${px}px)`;
      item.style.transform = transform;
      return wrapCentered(this.current + offset, total);
    });
  }

  goToNext() {
    if (this.config.variableWidth) {
      const nextIdx = this.config.infinite
        ? (this.currentSlide + 1) % this.items.length
        : Math.min(this.currentSlide + 1, this.items.length - 1);
      this.target = this.getVariableTargetForIndex(nextIdx);
    } else if (this.config.infinite) {
      this.target = Math.round(this.target - 1);
    } else {
      this.target = Math.max(this.maxScroll, Math.round(this.target - 1));
    }
  }

  goToPrev() {
    if (this.config.variableWidth) {
      const prevIdx = this.config.infinite
        ? (this.currentSlide - 1 + this.items.length) % this.items.length
        : Math.max(this.currentSlide - 1, 0);
      this.target = this.getVariableTargetForIndex(prevIdx);
    } else if (this.config.infinite) {
      this.target = Math.round(this.target + 1);
    } else {
      this.target = Math.min(0, Math.round(this.target + 1));
    }
  }

  goToIndex(idx: number) {
    if (this.config.variableWidth) {
      const targetIdx = this.config.infinite
        ? ((idx % this.items.length) + this.items.length) % this.items.length
        : Math.min(Math.max(idx, 0), this.items.length - 1);
      this.target = this.getVariableTargetForIndex(targetIdx);
    } else {
      this.target = -idx;
    }
  }

  get currentSlide() {
    return this.activeSlideIndex;
  }

  private setSlideIndex(idx: number) {
    if (this.activeSlideIndex !== idx) {
      this.prevSlideIndex = this.activeSlideIndex;
      this.activeSlideIndex = idx;
      this.onSlideChange?.(this.activeSlideIndex, this.prevSlideIndex);
    }
  }

  get progress(): number {
    if (this.config.variableWidth) {
      const total = this.config.vertical
        ? this.viewport.totalHeight || 1
        : this.viewport.totalWidth || 1;
      const pos = -this.target;
      return this.config.infinite
        ? (((pos % total) + total) % total) / total
        : Math.max(0, Math.min(pos, total)) / total;
    }
    if (this.config.infinite) {
      const pos = -this.target;
      const len = this.items.length;
      return (((pos % len) + len) % len) / (len - 1);
    }
    const maxAbs = Math.abs(this.maxScroll) || 1;
    return Math.max(0, Math.min(1, Math.abs(this.current) / maxAbs));
  }

  resize() {
    this.measure();
    if (this.config.variableWidth && !this.config.infinite && this.items.length > 0) {
      const idx = this.currentSlide;
      const targetVal = this.getVariableTargetForIndex(idx);
      this.target = targetVal;
      if (Math.abs(this.current - this.target) < 1) {
        this.current = targetVal;
      }
    }
    const wasActive = this.active;
    const wasVisible = this.isVisible;
    this.active = true;
    this.isVisible = true;
    this.update();
    this.active = wasActive;
    this.isVisible = wasVisible;
  }

  kill() {
    this.active = false;
    this.items.forEach((item) => {
      item.style.transform = '';
    });
    this.current = 0;
    this.target = 0;
    this.speed = 0;
    this.smoothedSpeed = 0;
    this.touchPreviousX = undefined;
    this.touchPreviousY = undefined;
    this.isTouching = false;
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    gsap.ticker.remove(this.tickerFn);
    this.kill();
    window.removeEventListener('mousemove', this.boundMouseMove);
    window.removeEventListener('mouseup', this.boundMouseUp);
    window.removeEventListener('touchmove', this.boundTouchMove);
    window.removeEventListener('touchend', this.boundTouchEnd);
    this.wrapper.removeEventListener('mousedown', this.boundMouseDown);
    this.wrapper.removeEventListener('touchstart', this.boundTouchStart);
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    if (this.virtualScroll) this.virtualScroll.destroy();
    if (this.observer) this.observer.disconnect();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}

interface HorizontalDragCarouselProps {
  children: React.ReactNode;
  config?: CarouselConfig;
  className?: string;
  wrapperClassName?: string;
  itemClassName?: string;
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  onReady?: (instance: GsapCarousel) => void;
}

export default function HorizontalDragCarousel({
  children,
  config,
  className = '',
  wrapperClassName = '',
  itemClassName = '',
  style = {},
  wrapperStyle = {},
  onReady,
}: HorizontalDragCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<GsapCarousel | null>(null);
  const onReadyRef = useRef(onReady);
  const childArray = React.Children.toArray(children).filter(Boolean);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (!wrapperRef.current || childArray.length === 0) return;
    const instance = new GsapCarousel(wrapperRef.current, {
      infinite: true,
      snap: true,
      variableWidth: false,
      dragSensitivity: 0.005,
      lerpFactor: 0.12,
      scrollSensitivity: 1,
      snapStrength: 0.1,
      ...config,
    });
    instanceRef.current = instance;
    onReadyRef.current?.(instance);
    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, [childArray.length, config]);

  return (
    <div className={`w-full overflow-hidden ${className}`} style={style}>
      <div
        ref={wrapperRef}
        className={`flex w-full select-none cursor-grab active:cursor-grabbing ${wrapperClassName}`}
        style={{ touchAction: 'pan-y', ...wrapperStyle }}
      >
        {childArray.map((child, idx) => (
          <div key={idx} className={`shrink-0 ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
