// ----------------------------------------------------------------
// 0. Styles (Inline Injection)
// ----------------------------------------------------------------

const COOKIE_BANNER_STYLES = `
#cookieConsent-wrapper {
  --focus: 0 0 0 2px #fff, 0 0 0 4px #000, 0 0 0 6px #fff;
  --boxShadow: -5px 5px 10px 0 #00000012, 0 0 50px 0 #0000001a;
  --fontFamily: helvetica neue, segoe ui, arial, sans-serif;
  --primaryColor: #121e68;
  --backgroundColor: #fff;
  --textColor: #4b494b;
  --backdropBackgroundColor: #0003;
  --backdropBackgroundBlur: 0;

  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  pointer-events: none;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

#cookieConsent-backdrop-global {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  border: 0;
  display: none;
}

#cookieConsent-wrapper a {
  all: unset;
  display: inline-block;
  color: var(--primaryColor);
  text-decoration: underline;
}

#cookieConsent-wrapper a:hover {
  cursor: pointer;
  color: var(--textColor);
}

#cookieConsent-wrapper a:focus,
#cookieConsent-wrapper #cookieConsent-banner button:focus,
#cookieConsent-wrapper #cookieConsent-modal button:focus {
  outline: none;
  box-shadow: var(--focus);
  border-radius: 5px;
}

#cookieConsent-wrapper .st-button {
  color: var(--backgroundColor);
  background-color: var(--primaryColor);
  border: 1px solid var(--primaryColor);
  padding: 10px 20px;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  border-radius: 5px;
}

#cookieConsent-wrapper .st-button--secondary {
  background-color: var(--backgroundColor);
  color: var(--primaryColor);
}

#cookieConsent-wrapper .st-button--secondary:hover {
  background-color: var(--primaryColor);
  color: var(--backgroundColor);
}

#cookieConsent-banner {
  font-family: var(--fontFamily);
  color: var(--textColor);
  background-color: var(--backgroundColor);
  box-sizing: border-box;
  padding: 32px;
  border-radius: 5px;
  pointer-events: auto;
  border: 0;
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 600px;
  overflow: auto;
  max-width: calc(100% - 32px);
  max-height: calc(100vh - 32px);
  transform: translate(0, -20px);
  opacity: 0;
  animation: cookieConsent-slideInDown 350ms ease-out forwards;
  animation-delay: 0.3s;
  box-shadow: -5px 5px 10px 0 #00000012, 0 0 50px 0 #0000001a;
}

#cookieConsent-banner.center {
  top: 50%;
  left: 50%;
  bottom: auto;
  right: auto;
  position: fixed;
  transform: translate(-50%, calc(-50% - 20px));
  animation: cookieConsent-slideInDown-center 350ms ease-out forwards;
}

#cookieConsent-banner.bottomLeft { bottom: 16px; left: 16px; position: fixed; }

#cookieConsent-banner.bottomCenter {
  bottom: 16px;
  left: 50%;
  position: fixed;
  transform: translate(-50%, -20px);
  animation: cookieConsent-slideInDown-bottomCenter 350ms ease-out forwards;
}

#cookieConsent-banner .preferences {
  display: flex;
  gap: 5px;
  border: none;
  padding: 15px 0;
  background-color: transparent;
  color: var(--primaryColor);
  cursor: pointer;
  font-size: 16px;
}

#cookieConsent-banner .preferences span {
  display: block;
  white-space: nowrap;
  text-decoration: underline;
}

#cookieConsent-banner .preferences span:hover { color: var(--textColor); }

#cookieConsent-banner .preferences::after {
  display: block;
  content: '>';
  text-decoration: none;
}

#cookieConsent-banner p { font-size: 16px; line-height: 24px; margin: 0 0 15px; }

#cookieConsent-banner a {
  display: inline-block;
  color: var(--primaryColor);
  text-decoration: underline;
  background-color: var(--backgroundColor);
}

#cookieConsent-banner a:hover { color: var(--textColor); }

#cookieConsent-banner a.cookieConsent-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  fill: var(--primaryColor);
  margin-left: auto;
  width: 48px;
  height: 48px;
}

#cookieConsent-banner .actions {
  display: flex;
  gap: 16px;
  flex-direction: column;
  margin-top: 24px;
}

@media (min-width: 600px) {
  #cookieConsent-banner .actions { flex-direction: row; align-items: center; }
}

#cookieConsent-banner .actions-row {
  display: flex;
  gap: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  flex-grow: 1;
}

#cookieConsent-modal {
  display: none;
  pointer-events: auto;
  overflow: auto;
  width: 800px;
  max-width: 100%;
  max-height: 100%;
  border: 0;
  transform: translate(0, -20px);
  opacity: 0;
  animation: cookieConsent-slideInUp-center 350ms ease-out forwards;
  box-shadow: -5px 5px 10px 0 #00000012, 0 0 50px 0 #0000001a;
  font-family: var(--fontFamily);
  color: var(--textColor);
  flex-direction: column;
  padding: 30px;
  background-color: var(--backgroundColor);
  border-radius: 5px;
  box-sizing: border-box;
}

#cookieConsent-modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

#cookieConsent-modal h1 {
  font-family: var(--fontFamily);
  color: var(--textColor);
  font-size: 24px;
  font-weight: 500;
  margin: 0;
}

#cookieConsent-modal .modal-close {
  display: inline-flex;
  padding: 13px;
  border: 0;
  cursor: pointer;
  background: var(--backgroundColor);
  color: var(--primaryColor);
}

#cookieConsent-modal .modal-close svg { fill: var(--primaryColor); }

#cookieConsent-modal section { flex: 1; margin-top: 32px; }

#cookieConsent-modal section::-webkit-scrollbar { display: block; width: 5px; }

#cookieConsent-modal section::-webkit-scrollbar-thumb {
  background-color: var(--textColor);
  border-radius: 10px;
}

#cookieConsent-modal p { font-size: 16px; line-height: 24px; color: var(--textColor); margin: 0 0 15px; }

#cookieConsent-modal fieldset { padding: 0; border: none; margin: 0 0 32px; }

#cookieConsent-modal legend {
  padding: 0;
  margin: 0 0 10px;
  font-weight: 700;
  color: var(--textColor);
  font-size: 16px;
}

#cookieConsent-modal .cookie-type-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

#cookieConsent-modal .switch {
  flex-shrink: 0;
  position: relative;
  display: inline-block;
  height: 34px;
  width: 74px;
  cursor: pointer;
}

#cookieConsent-modal .switch:focus-within {
  outline: none;
  box-shadow: var(--focus);
  border-radius: 25px;
}

#cookieConsent-modal .switch input { opacity: 0; position: absolute; }

#cookieConsent-modal .switch__pill {
  position: relative;
  display: block;
  height: 34px;
  width: 74px;
  background: var(--textColor);
  border-radius: 25px;
}

#cookieConsent-modal .switch__dot {
  position: absolute;
  top: 2px;
  left: 2px;
  display: block;
  height: 30px;
  width: 30px;
  background: var(--backgroundColor);
  border-radius: 50%;
  transition: left 150ms ease-out;
}

#cookieConsent-modal .switch__off,
#cookieConsent-modal .switch__on {
  text-transform: uppercase;
  font-size: 15px;
  font-weight: 500;
  color: var(--backgroundColor);
  position: absolute;
  top: 7px;
  right: 8px;
  transition: right 150ms ease-out, opacity 150ms ease-out;
}

#cookieConsent-modal .switch__off { opacity: 1; }
#cookieConsent-modal .switch__on { opacity: 0; }

#cookieConsent-modal .switch input:checked + .switch__pill { background: var(--primaryColor); }
#cookieConsent-modal .switch input:checked ~ .switch__dot { left: calc(100% - 32px); }
#cookieConsent-modal .switch input:checked ~ .switch__off { right: calc(100% - 32px); opacity: 0; }
#cookieConsent-modal .switch input:checked ~ .switch__on { right: calc(100% - 34px); opacity: 1; }

#cookieConsent-modal .switch input:disabled + .switch__pill { opacity: 0.65; cursor: not-allowed; }

#cookieConsent-modal footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

@media (min-width: 600px) {
  #cookieConsent-modal footer { flex-direction: row; align-items: center; }
}

#cookieConsent-modal footer a { margin-left: auto; padding: 14px 0; }

#cookieConsent-backdrop {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--backdropBackgroundColor);
  backdrop-filter: blur(var(--backdropBackgroundBlur));
  pointer-events: all;
}

@keyframes cookieConsent-fadeIn { from { opacity: 0; } to { opacity: 1; } }

@keyframes cookieConsent-slideInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes cookieConsent-slideInDown-center {
  from { opacity: 0; transform: translate(-50%, calc(-50% - 20px)); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}

@keyframes cookieConsent-slideInDown-bottomCenter {
  from { opacity: 0; transform: translate(-50%, -20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

@keyframes cookieConsent-slideInUp-center {
  from { opacity: 0; transform: translate(0, 20px); }
  to { opacity: 1; transform: translate(0, 0); }
}
`;

const injectStyles = (): void => {
    if (typeof document === 'undefined') return;
    const id = '#cookie-consent-styles';

    if (document.querySelector(id)) return;
    const style = document.createElement('style');

    style.id = id;
    style.textContent = COOKIE_BANNER_STYLES;
    document.head.append(style);
};

// ----------------------------------------------------------------
// 1. Types & Interfaces
// ----------------------------------------------------------------

export interface ConsentConfig {
    background?: {
        showBackground?: boolean;
    };
    bannerSuffix?: string;
    cookieTypes?: CookieType[];
    language?: LanguageCode;
    mode?: 'default' | 'wizard';
    onAcceptAll?: () => void;
    onBackdropClose?: () => void;
    onBackdropOpen?: () => void;
    onBannerClose?: () => void;
    onBannerOpen?: () => void;
    onPreferencesClose?: () => void;
    onPreferencesOpen?: () => void;
    onRejectAll?: () => void;
    position?: {
        banner?: string;
    };
    showBanner?: boolean;
    text?: Record<string, TextConfig>;
}

export interface CookieType {
    defaultValue?: boolean;
    description: LocalizedString | string;
    id: string;
    name: LocalizedString | string;
    onAccept?: () => void;
    onReject?: () => void;
    required?: boolean;
}

export type LanguageCode = 'en' | 'lt' | 'ru' | string;

export type LocalizedString = Record<string, string>;

export interface TextConfig {
    banner?: {
        acceptAllButtonAccessibleLabel?: string;
        acceptAllButtonText?: string;
        description?: string;
        preferencesButtonAccessibleLabel?: string;
        preferencesButtonText?: string;
        rejectNonEssentialButtonAccessibleLabel?: string;
        rejectNonEssentialButtonText?: string;
    };
    preferences?: {
        description?: string;
        saveButtonText?: string;
        title?: string;
    };
}

interface State {
    config: ConsentConfig;
    elements: {
        backdrop: HTMLElement | null;
        banner: HTMLElement | null;
        modal: HTMLElement | null;
        wrapper: HTMLElement | null;
    };
}

// Global Window Augmentation
declare global {
    interface Window {
        cookieConsentCookieBannerManager: {
            initCookieBanner: () => void;
            injectScript: (url: string, loadOption?: 'async' | 'defer') => void;
            updateCookieBannerConfig: (config: Partial<ConsentConfig>) => void;
        };
    }
}

// ----------------------------------------------------------------
// 2. State Management
// ----------------------------------------------------------------

const state: State = {
    config: {},
    elements: {
        backdrop: null,
        banner: null,
        modal: null,
        wrapper: null,
    },
};

let isInitialized = false;

// ----------------------------------------------------------------
// 3. Helpers
// ----------------------------------------------------------------

const getLanguage = (): string => {
    if (state.config.language) return state.config.language;
    const htmlLang = document.documentElement.lang;

    if (htmlLang) return htmlLang.slice(0, 2).toLowerCase();

    return 'lt';
};

const getText = (path: string, fallback: string): string => {
    const lang = getLanguage();
    const keys = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = state.config.text?.[lang];

    if (!current && state.config.text?.lt) {
        current = state.config.text.lt;
    }

    if (current) {
        for (const key of keys) {
            if (current[key] === undefined) {
                current = undefined;
                break;
            }
            current = current[key];
        }
    }

    return current || fallback;
};

const getBannerSuffix = (): string => {
    return state.config.bannerSuffix ? `_${state.config.bannerSuffix}` : '';
};

const preventBodyScroll = (): void => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
};

const allowBodyScroll = (): void => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
};

const hasSetInitialCookieChoices = (): boolean => {
    return !!localStorage.getItem(`cookieConsentCookieBanner_InitialChoice${getBannerSuffix()}`);
};

const setInitialCookieChoiceMade = (): void => {
    globalThis.localStorage.setItem(`cookieConsentCookieBanner_InitialChoice${getBannerSuffix()}`, '1');
};

const getAcceptedCookies = (): Record<string, boolean> => {
    // eslint-disable-next-line unicorn/no-array-reduce
    return (state.config.cookieTypes || []).reduce((acc, cookieType) => {
        const val = localStorage.getItem(`cookieConsentCookieChoice_${cookieType.id}${getBannerSuffix()}`);

        acc[cookieType.id] = val === 'true';

        return acc;
    }, {} as Record<string, boolean>);
};

// ----------------------------------------------------------------
// 4. DOM Creation & Logic
// ----------------------------------------------------------------

const createWrapper = (): void => {
    if (state.elements.wrapper) return;
    state.elements.wrapper = document.createElement('div');
    state.elements.wrapper.id = 'cookieConsent-wrapper';
    document.body.insertBefore(state.elements.wrapper, document.body.firstChild);
};

const createWrapperChild = (htmlContent: null | string, id: string): HTMLElement => {
    const child = document.createElement('div');

    child.id = id;
    if (htmlContent) child.innerHTML = htmlContent;

    if (!state.elements.wrapper || !document.body.contains(state.elements.wrapper)) {
        createWrapper();
    }
    state.elements.wrapper?.append(child);

    return child;
};

// --- Backdrop ---
const createBackdrop = (): void => {
    state.elements.backdrop = createWrapperChild(null, 'cookieConsent-backdrop');
};

const showBackdrop = (): void => {
    if (state.elements.backdrop) state.elements.backdrop.style.display = 'block';
    state.config.onBackdropOpen?.();
};

const hideBackdrop = (): void => {
    if (state.elements.backdrop) state.elements.backdrop.style.display = 'none';
    state.config.onBackdropClose?.();
};

// --- Checkbox Logic ---
const updateCheckboxState = (saveToStorage = false): void => {
    if (!state.elements.modal) return;
    const preferencesSection = state.elements.modal.querySelector('#cookie-preferences');

    if (!preferencesSection) return;
    const checkboxes = preferencesSection.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

    for (const checkbox of checkboxes) {
        const [, cookieId] = checkbox.id.split('cookies-');
        const cookieType = state.config.cookieTypes?.find((type) => type.id === cookieId);

        if (!cookieType) continue;

        if (saveToStorage) {
            const currentState = checkbox.checked;

            if (cookieType.required) {
                localStorage.setItem(`cookieConsentCookieChoice_${cookieId}${getBannerSuffix()}`, 'true');
            } else {
                localStorage.setItem(
                    `cookieConsentCookieChoice_${cookieId}${getBannerSuffix()}`,
                    currentState.toString()
                );
                if (currentState) cookieType.onAccept?.();
                else cookieType.onReject?.();
            }
        } else {
            if (cookieType.required) {
                checkbox.checked = true;
                checkbox.disabled = true;
            } else {
                const storedValue = localStorage.getItem(`cookieConsentCookieChoice_${cookieId}${getBannerSuffix()}`);

                checkbox.checked = storedValue === null ? !!cookieType.defaultValue : storedValue === 'true';
            }
        }
    }
};

const removeBanner = (): void => {
    if (state.elements.banner && state.elements.banner.parentNode) {
        state.elements.banner.remove();
        state.elements.banner = null;
        state.config.onBannerClose?.();
    }
};

const toggleModal = (show: boolean): void => {
    if (!state.elements.modal) return;
    state.elements.modal.style.display = show ? 'flex' : 'none';

    if (show) {
        showBackdrop();
        removeBanner();
        preventBodyScroll();
        const firstInput = state.elements.modal.querySelector<HTMLElement>('input, button');

        firstInput?.focus();
        state.config.onPreferencesOpen?.();
        updateCheckboxState(false);
    } else {
        setInitialCookieChoiceMade();
        updateCheckboxState(true);
        hideBackdrop();
        allowBodyScroll();
        state.config.onPreferencesClose?.();
    }
};

// --- Main Action Logic ---
const handleCookieChoice = (accepted: boolean): void => {
    setInitialCookieChoiceMade();
    removeBanner();
    hideBackdrop();
    toggleModal(false);

    if (state.config.cookieTypes)
        for (const type of state.config.cookieTypes) {
            if (type.required) {
                localStorage.setItem(`cookieConsentCookieChoice_${type.id}${getBannerSuffix()}`, 'true');
                type.onAccept?.();
            } else {
                localStorage.setItem(`cookieConsentCookieChoice_${type.id}${getBannerSuffix()}`, accepted.toString());
                if (accepted) type.onAccept?.();
                else type.onReject?.();
            }
        }

    if (accepted) state.config.onAcceptAll?.();
    else state.config.onRejectAll?.();

    updateCheckboxState();
};

const loadRequiredCookies = (): void => {
    if (state.config.cookieTypes)
        for (const cookie of state.config.cookieTypes) {
            if (cookie.required) cookie.onAccept?.();
        }
};

const runAcceptedCookieCallbacks = (): void => {
    const acceptedCookies = getAcceptedCookies();

    if (state.config.cookieTypes)
        for (const type of state.config.cookieTypes) {
            if (type.required) continue;
            if (acceptedCookies[type.id]) type.onAccept?.();
        }
};

// ----------------------------------------------------------------
// 5. Banner Component
// ----------------------------------------------------------------

const getBannerContent = (): string => {
    const bannerDescription = getText(
        'banner.description',
        '<p>We use cookies on our site to enhance your user experience.</p>'
    );
    const acceptText = getText('banner.acceptAllButtonText', 'Accept all');
    const rejectText = getText('banner.rejectNonEssentialButtonText', 'Reject non-essential');
    const prefText = getText('banner.preferencesButtonText', 'Preferences');
    const acceptLabel = getText('banner.acceptAllButtonAccessibleLabel', acceptText);
    const rejectLabel = getText('banner.rejectNonEssentialButtonAccessibleLabel', rejectText);
    const prefLabel = getText('banner.preferencesButtonAccessibleLabel', prefText);

    return `
    ${bannerDescription}
    <div class="actions">                               
      <button class="accept-all st-button st-button--primary" aria-label="${acceptLabel}">${acceptText}</button>
      <button class="reject-all st-button st-button--secondary" aria-label="${rejectLabel}">${rejectText}</button>
      <div class="actions-row">
        <button class="preferences" aria-label="${prefLabel}"><span>${prefText}</span></button>
      </div>
    </div>
  `;
};

const createBanner = (): void => {
    state.elements.banner = createWrapperChild(getBannerContent(), 'cookieConsent-banner');
    if (state.config.position?.banner && state.elements.banner) {
        state.elements.banner.classList.add(state.config.position.banner);
    }
    if (state.elements.banner) {
        const acceptButton = state.elements.banner.querySelector('.accept-all');
        const rejectButton = state.elements.banner.querySelector('.reject-all');
        const preferencesButton = state.elements.banner.querySelector('.preferences');

        acceptButton?.addEventListener('click', () => handleCookieChoice(true));
        rejectButton?.addEventListener('click', () => handleCookieChoice(false));
        preferencesButton?.addEventListener('click', () => {
            showBackdrop();
            toggleModal(true);
        });
    }
    state.config.onBannerOpen?.();
};

const shouldShowBanner = (): boolean => {
    if (state.config.showBanner === false) return false;

    return !localStorage.getItem(`cookieConsentCookieBanner_InitialChoice${getBannerSuffix()}`);
};

// ----------------------------------------------------------------
// 6. Modal Component
// ----------------------------------------------------------------

const getModalContent = (): string => {
    const title = getText('preferences.title', 'Customize your cookie preferences');
    const description = getText('preferences.description', '<p>We respect your right to privacy.</p>');
    const saveText = getText('preferences.saveButtonText', 'Save settings');
    const rejectText = getText('banner.rejectNonEssentialButtonText', 'Reject non-essential');
    const cookieTypes = state.config.cookieTypes || [];
    const acceptedCookieMap = getAcceptedCookies();
    const currentLang = getLanguage();
    const hasChoice = hasSetInitialCookieChoices();

    return `
    <header>
      <h1>${title}</h1>                    
    </header>
    ${description}
    <section id="cookie-preferences">
      ${cookieTypes
          .map((type) => {
              const typeName =
                  typeof type.name === 'object' ? type.name[currentLang] || type.name.lt || 'Cookie' : type.name;
              const typeDesc =
                  typeof type.description === 'object'
                      ? type.description[currentLang] || type.description.lt || ''
                      : type.description;
              const accepted = acceptedCookieMap[type.id];
              let isChecked = false;

              if (accepted) isChecked = true;
              if (!accepted && !hasChoice) isChecked = !!type.defaultValue;

              return `
          <fieldset>
              <legend>${typeName}</legend>
              <div class="cookie-type-content">
                  <div class="cookie-type-description">${typeDesc}</div>
                  <label class="switch" for="cookies-${type.id}">
                      <input type="checkbox" id="cookies-${type.id}" ${
                  type.required ? 'checked disabled' : isChecked ? 'checked' : ''
              } />
                      <span class="switch__pill" aria-hidden="true"></span>
                      <span class="switch__dot" aria-hidden="true"></span>
                      <span class="switch__off" aria-hidden="true">Off</span>
                      <span class="switch__on" aria-hidden="true">On</span>
                  </label>
              </div>
          </fieldset>`;
        })
        .join('')}
    </section>
    <footer>
      <button class="preferences-accept-all st-button st-button--primary">${saveText}</button>
      <button class="preferences-reject-all st-button st-button--secondary">${rejectText}</button>
    </footer>
  `;
};

const createModal = (): void => {
    state.elements.modal = createWrapperChild(getModalContent(), 'cookieConsent-modal');
    if (state.elements.modal) {
        const acceptAllButton = state.elements.modal.querySelector('.preferences-accept-all');
        const rejectAllButton = state.elements.modal.querySelector('.preferences-reject-all');

        acceptAllButton?.addEventListener('click', () => toggleModal(false));
        rejectAllButton?.addEventListener('click', () => handleCookieChoice(false));

        const focusableElements = state.elements.modal.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
            const first = focusableElements[0];
            // eslint-disable-next-line unicorn/prefer-at
            const last = focusableElements[focusableElements.length - 1];

            state.elements.modal.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === first) {
                            last.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === last) {
                            first.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        }
    }
};

// ----------------------------------------------------------------
// 7. Initialization & Exports
// ----------------------------------------------------------------

const initCookieBanner = (): void => {
    if (typeof globalThis === 'undefined') return;
    if (isInitialized) return;

    isInitialized = true;

    injectStyles();
    createWrapper();
    if (state.config.background?.showBackground) createBackdrop();
    createModal();

    if (shouldShowBanner()) {
        createBanner();
        showBackdrop();
        preventBodyScroll();
    }

    if (hasSetInitialCookieChoices()) {
        loadRequiredCookies();
        runAcceptedCookieCallbacks();
    }
};

export const updateCookieBannerConfig = (userConfig: Partial<ConsentConfig> = {}): void => {
    if (typeof globalThis === 'undefined') return;

    state.config = { ...state.config, ...userConfig };

    if (!isInitialized) {
        initCookieBanner();

        return;
    }

    if (state.elements.banner) {
        state.elements.banner.innerHTML = getBannerContent();

        const acceptButton = state.elements.banner.querySelector('.accept-all');
        const rejectButton = state.elements.banner.querySelector('.reject-all');
        const preferencesButton = state.elements.banner.querySelector('.preferences');

        acceptButton?.addEventListener('click', () => handleCookieChoice(true));
        rejectButton?.addEventListener('click', () => handleCookieChoice(false));
        preferencesButton?.addEventListener('click', () => {
            showBackdrop();
            toggleModal(true);
        });
    }

    if (state.elements.modal) {
        state.elements.modal.innerHTML = getModalContent();
        const acceptAllButton = state.elements.modal.querySelector('.preferences-accept-all');
        const rejectAllButton = state.elements.modal.querySelector('.preferences-reject-all');

        acceptAllButton?.addEventListener('click', () => toggleModal(false));
        rejectAllButton?.addEventListener('click', () => handleCookieChoice(false));
    }

    if (state.elements.banner && !shouldShowBanner()) {
        removeBanner();
        allowBodyScroll();
        hideBackdrop();
    }

    if (!state.elements.banner && shouldShowBanner()) {
        createBanner();
        showBackdrop();
        preventBodyScroll();
    }
};

const injectScript = (url: string, loadOption?: 'async' | 'defer'): void => {
    if (typeof globalThis === 'undefined') return;

    const existingScript = document.querySelector(`script[src="${url}"]`);

    if (existingScript) return;
    const script = document.createElement('script');

    script.src = url;
    if (loadOption === 'async') script.async = true;
    if (loadOption === 'defer') script.defer = true;
    document.head.append(script);
};

if (typeof globalThis !== 'undefined' && 'document' in globalThis) {
    // @ts-expect-error: typeof globalThis has no index signature.
    globalThis.cookieConsentCookieBannerManager = {
        initCookieBanner,
        injectScript,
        updateCookieBannerConfig,
    };
}

export {};
