(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Curly404 = factory().Curly404;
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class Curly404 {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          target: null,
          title: '404',
          headline: 'Looks like you reached an unhandled exception.',
          homeUrl: '/',
          homeText: 'Back to Dashboard',
          docsUrl: '#docs',
          docsText: 'Documentation',
          onAction: null
        },
        options
      );

      this.container = null;
      this.isEmbedded = Boolean(this.options.target);
      this._eventListeners = [];
      this._intervals = [];
      this._timeouts = [];

      this.isAngry = false;
      this._clickTimes = [];
      this._angryTimer = null;
      this._rumbleTimer = null;

      this._init();
    }

    _init() {
      if (this.isEmbedded) {
        if (typeof this.options.target === 'string') {
          this.container = document.querySelector(this.options.target);
        } else if (this.options.target instanceof HTMLElement) {
          this.container = this.options.target;
        }
      }

      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'curly-404-root-wrapper';
        document.body.appendChild(this.container);
      }

      this.container.classList.add('curly-404-host');
      this.container.innerHTML = this._getTemplate();

      this.faceContainer = this.container.querySelector('.c404-face-container');
      this.characterWrapper = this.container.querySelector('.c404-character-wrapper');
      this.pupilLeft = this.container.querySelector('#c404-pupil-left');
      this.pupilRight = this.container.querySelector('#c404-pupil-right');
      this.mouth = this.container.querySelector('#c404-mouth');
      this.steamLeft = this.container.querySelector('#c404-steam-left');
      this.steamRight = this.container.querySelector('#c404-steam-right');

      this._setupEyeTracking();
      this._setupBlinking();
      this._setupMouthOrganicMovement();
      this._setupFaceClickShakeAndAnger();
    }

    _getTemplate() {
      const {
        title,
        headline,
        homeUrl,
        homeText,
        docsUrl,
        docsText
      } = this.options;

      return `
        <div class="c404-layout">
          <div class="c404-bg-grid" aria-hidden="true"></div>
          <div class="c404-bg-vignette" aria-hidden="true"></div>
          <div class="c404-ambient-glow" aria-hidden="true"></div>

          <div class="c404-content">
            <!-- Hero Status Code -->
            <h1 class="c404-hero-number" data-text="${title}">
              4<span class="c404-num-accent">0</span>4
            </h1>

            <!-- THE CURLY BRACKET CHARACTER -->
            <div 
              class="c404-face-container" 
              role="button" 
              tabindex="0" 
              aria-label="Interactive bracket face mascot: Click to interact"
              title="Click repeatedly to poke parser!">
              
              <div class="c404-rage-aura" aria-hidden="true"></div>

              <div class="c404-character-wrapper">
                <div class="c404-steam-element c404-steam-right" id="c404-steam-right" aria-hidden="true">
                  <span class="c404-steam-symbol">💢</span>
                </div>
                <div class="c404-steam-element c404-steam-left" id="c404-steam-left" aria-hidden="true">
                  <span class="c404-steam-symbol">💢</span>
                </div>

                <div class="c404-eyes-row">
                  <div class="c404-eye-unit">
                    <span class="c404-bracket-glyph">{</span>
                    <div class="c404-eye-socket" id="c404-socket-left">
                      <div class="c404-eyelid c404-eyelid-left"></div>
                      <div class="c404-pupil" id="c404-pupil-left"></div>
                    </div>
                    <span class="c404-bracket-glyph">}</span>
                  </div>

                  <div class="c404-eye-unit">
                    <span class="c404-bracket-glyph">{</span>
                    <div class="c404-eye-socket" id="c404-socket-right">
                      <div class="c404-eyelid c404-eyelid-right"></div>
                      <div class="c404-pupil" id="c404-pupil-right"></div>
                    </div>
                    <span class="c404-bracket-glyph">}</span>
                  </div>
                </div>

                <div class="c404-mouth-wrap">
                  <div class="c404-mouth-bracket" id="c404-mouth">
                    <svg 
                      class="c404-mouth-svg" 
                      viewBox="0 0 160 60" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true">
                      <path 
                        d="M 14 46 C 14 34, 28 28, 50 28 C 68 28, 73 18, 80 8 C 87 18, 92 28, 110 28 C 132 28, 146 34, 146 46" 
                        stroke="currentColor" 
                        stroke-width="12" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Headline & Explanatory Text -->
            <div class="c404-text-block">
              <h2 class="c404-headline">${headline}</h2>
            </div>

            <!-- Action Buttons Group -->
            <div class="c404-actions-group">
              <a href="${homeUrl}" class="c404-btn c404-btn-primary" data-action="home">
                <svg class="c404-btn-icon" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>${homeText}</span>
              </a>

              <a href="${docsUrl}" class="c404-btn c404-btn-secondary" data-action="docs">
                <svg class="c404-btn-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <span>${docsText}</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }

    _setupEyeTracking() {
      const MAX_OFFSET_X = 11;
      const MAX_OFFSET_Y = 15;

      const onMouseMove = (e) => {
        if (!this.pupilLeft || !this.pupilRight) return;

        const clientX = e.clientX;
        const clientY = e.clientY;

        [this.pupilLeft, this.pupilRight].forEach((pupil) => {
          if (!pupil || !pupil.parentElement) return;
          const rect = pupil.parentElement.getBoundingClientRect();
          const eyeCenterX = rect.left + rect.width / 2;
          const eyeCenterY = rect.top + rect.height / 2;

          const deltaX = clientX - eyeCenterX;
          const deltaY = clientY - eyeCenterY;

          const distance = Math.hypot(deltaX, deltaY);
          const angle = Math.atan2(deltaY, deltaX);

          const clampedDist = Math.min(distance / 24, 1);

          const offsetX = Math.cos(angle) * (MAX_OFFSET_X * clampedDist);
          const offsetY = Math.sin(angle) * (MAX_OFFSET_Y * clampedDist);

          pupil.style.transform = `translate(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px)`;
        });
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      this._eventListeners.push({ target: window, type: 'mousemove', handler: onMouseMove });
    }

    _setupBlinking() {
      const sockets = this.container.querySelectorAll('.c404-eye-socket');

      const triggerBlink = () => {
        if (!this.isAngry) {
          sockets.forEach((s) => s.classList.add('c404-blink'));
          const timeout1 = setTimeout(() => {
            sockets.forEach((s) => s.classList.remove('c404-blink'));
          }, 150);
          this._timeouts.push(timeout1);
        }

        const nextDelay = Math.random() * 3500 + 2500;
        const timeout2 = setTimeout(triggerBlink, nextDelay);
        this._timeouts.push(timeout2);
      };

      const initialTimeout = setTimeout(triggerBlink, 1800);
      this._timeouts.push(initialTimeout);
    }

    _setupMouthOrganicMovement() {
      const mouthVariations = [
        'scale(1) rotate(0deg)',
        'scale(1.08, 0.94) rotate(-3deg)',
        'scale(0.95, 1.05) rotate(3.5deg)',
        'scale(1.12, 1) rotate(0deg) translateY(2px)',
        'scale(0.92, 0.92) rotate(-1.5deg) translateY(-2px)',
        'scale(1.05, 1.08) rotate(1deg)',
        'scale(1.15, 0.88) rotate(0deg) translateY(3px)'
      ];

      const triggerMouthShift = () => {
        if (!this.mouth || this.isAngry) return;
        const randomStyle = mouthVariations[Math.floor(Math.random() * mouthVariations.length)];
        this.mouth.style.transform = randomStyle;

        const resetTimeout = setTimeout(() => {
          if (this.mouth && !this.isAngry) this.mouth.style.transform = 'scale(1) rotate(0deg)';
        }, 1200);
        this._timeouts.push(resetTimeout);

        const nextShift = Math.random() * 2600 + 3000;
        const nextTimeout = setTimeout(triggerMouthShift, nextShift);
        this._timeouts.push(nextTimeout);
      };

      const startTimeout = setTimeout(triggerMouthShift, 3200);
      this._timeouts.push(startTimeout);
    }

    _setupFaceClickShakeAndAnger() {
      if (!this.faceContainer || !this.characterWrapper) return;

      const triggerAngryState = () => {
        this.isAngry = true;
        this.faceContainer.classList.add('is-angry');

        this.characterWrapper.classList.remove('c404-shake-active');
        this.characterWrapper.classList.add('c404-angry-rumble');

        if (this._rumbleTimer) clearTimeout(this._rumbleTimer);
        this._rumbleTimer = setTimeout(() => {
          this.characterWrapper.classList.remove('c404-angry-rumble');
        }, 1200);
        this._timeouts.push(this._rumbleTimer);

        if (this.options.onAction) {
          this.options.onAction({ type: 'angry-state', angry: true });
        }

        if (this._angryTimer) clearTimeout(this._angryTimer);
        this._angryTimer = setTimeout(() => {
          this._coolDownFromAngryState();
        }, 4200);
        this._timeouts.push(this._angryTimer);
      };

      const onFaceClick = () => {
        const now = Date.now();
        this._clickTimes = this._clickTimes.filter((t) => now - t <= 2500);
        this._clickTimes.push(now);

        if (this._clickTimes.length >= 5) {
          this._clickTimes = [];
          triggerAngryState();
          return;
        }

        if (!this.isAngry) {
          this.characterWrapper.classList.remove('c404-shake-active');
          void this.characterWrapper.offsetWidth;
          this.characterWrapper.classList.add('c404-shake-active');

          if (this.mouth) {
            this.mouth.style.transform = 'scale(1.28, 1.25) translateY(4px) rotate(4deg)';
          }

          if (this.options.onAction) {
            this.options.onAction({ type: 'face-click', clickCount: this._clickTimes.length });
          }

          const timeout = setTimeout(() => {
            this.characterWrapper.classList.remove('c404-shake-active');
            if (this.mouth && !this.isAngry) {
              this.mouth.style.transform = 'scale(1) rotate(0deg)';
            }
          }, 420);
          this._timeouts.push(timeout);
        }
      };

      this.faceContainer.addEventListener('click', onFaceClick);
      this._eventListeners.push({ target: this.faceContainer, type: 'click', handler: onFaceClick });

      const onFaceKey = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFaceClick();
        }
      };
      this.faceContainer.addEventListener('keydown', onFaceKey);
      this._eventListeners.push({ target: this.faceContainer, type: 'keydown', handler: onFaceKey });
    }

    _coolDownFromAngryState() {
      this.isAngry = false;
      this.faceContainer.classList.remove('is-angry');
      this.characterWrapper.classList.remove('c404-angry-rumble');

      if (this.mouth) {
        this.mouth.style.transform = 'scale(1) rotate(0deg)';
      }

      if (this.options.onAction) {
        this.options.onAction({ type: 'angry-state', angry: false });
      }

      const sockets = this.container.querySelectorAll('.c404-eye-socket');
      sockets.forEach((s) => s.classList.add('c404-blink'));
      const timeout = setTimeout(() => {
        sockets.forEach((s) => s.classList.remove('c404-blink'));
      }, 220);
      this._timeouts.push(timeout);
    }

    destroy() {
      this._eventListeners.forEach(({ target, type, handler }) => {
        target.removeEventListener(type, handler);
      });
      this._eventListeners = [];

      this._timeouts.forEach(clearTimeout);
      this._timeouts = [];

      this._intervals.forEach(clearInterval);
      this._intervals = [];

      if (this.container) {
        this.container.innerHTML = '';
        if (!this.isEmbedded && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
      }
    }
  }

  return { Curly404 };
});
