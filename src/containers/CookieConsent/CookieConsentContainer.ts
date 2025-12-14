// ----------------------------------------------------------------
// 1. Types & Interfaces (Exported so they can be imported elsewhere)
// ----------------------------------------------------------------

export type LanguageCode = 'en' | 'lt' | 'ru' | string;

export interface LocalizedString {
    [lang: string]: string;
}

export interface CookieType {
    id: string;
    required?: boolean;
    defaultValue?: boolean;
    name: string | LocalizedString;
    description: string | LocalizedString;
    onAccept?: () => void;
    onReject?: () => void;
}

export interface TextConfig {
    banner?: {
        description?: string;
        acceptAllButtonText?: string;
        acceptAllButtonAccessibleLabel?: string;
        rejectNonEssentialButtonText?: string;
        rejectNonEssentialButtonAccessibleLabel?: string;
        preferencesButtonText?: string;
        preferencesButtonAccessibleLabel?: string;
    };
    preferences?: {
        title?: string;
        description?: string;
        saveButtonText?: string;
    };
}

export interface ConsentConfig {
    language?: LanguageCode;
    bannerSuffix?: string;
    mode?: 'wizard' | 'default';
    showBanner?: boolean;
    position?: {
        banner?: string;
    };
    background?: {
        showBackground?: boolean;
    };
    text?: {
        [lang: string]: TextConfig;
    };
    cookieTypes?: CookieType[];
    onBackdropOpen?: () => void;
    onBackdropClose?: () => void;
    onBannerOpen?: () => void;
    onBannerClose?: () => void;
    onPreferencesOpen?: () => void;
    onPreferencesClose?: () => void;
    onAcceptAll?: () => void;
    onRejectAll?: () => void;
}

interface State {
    config: ConsentConfig;
    elements: {
        wrapper: HTMLElement | null;
        banner: HTMLElement | null;
        modal: HTMLElement | null;
        backdrop: HTMLElement | null;
    };
}

// Global Window Augmentation
declare global {
    interface Window {
        cookieConsentCookieBannerManager: {
            initCookieBanner: () => void;
            updateCookieBannerConfig: (config: Partial<ConsentConfig>) => void;
            injectScript: (url: string, loadOption?: 'async' | 'defer') => void;
        };
    }
}

// ----------------------------------------------------------------
// 2. State Management
// ----------------------------------------------------------------

const state: State = {
    config: {},
    elements: {
        wrapper: null,
        banner: null,
        modal: null,
        backdrop: null,
    },
};

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
    window.localStorage.setItem(`cookieConsentCookieBanner_InitialChoice${getBannerSuffix()}`, '1');
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

const createWrapperChild = (htmlContent: string | null, id: string): HTMLElement => {
    const child = document.createElement('div');

    child.id = id;
    if (htmlContent) child.innerHTML = htmlContent;

    if (!state.elements.wrapper || !document.body.contains(state.elements.wrapper)) {
        createWrapper();
    }
    state.elements.wrapper?.appendChild(child);

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

const destroyCookieBanner = (): void => {
    if (state.elements.wrapper && state.elements.wrapper.parentNode) {
        state.elements.wrapper.remove();
    }
    allowBodyScroll();
    state.elements = { wrapper: null, banner: null, modal: null, backdrop: null };
};

const initCookieBanner = (): void => {
    if (typeof window === 'undefined') return;

    if (state.elements.wrapper) return;
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
    if (typeof window === 'undefined') return;
    state.config = { ...state.config, ...userConfig };
    destroyCookieBanner();
    if (document.body) initCookieBanner();
    else document.addEventListener('DOMContentLoaded', initCookieBanner, { once: true });
};

const injectScript = (url: string, loadOption?: 'async' | 'defer'): void => {
    if (typeof window === 'undefined') return;

    const existingScript = document.querySelector(`script[src="${url}"]`);

    if (existingScript) return;
    const script = document.createElement('script');

    script.src = url;
    if (loadOption === 'async') script.async = true;
    if (loadOption === 'defer') script.defer = true;
    document.head.append(script);
};

if (typeof window !== 'undefined') {
    window.cookieConsentCookieBannerManager = { initCookieBanner, updateCookieBannerConfig, injectScript };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner, { once: true });
    } else {
        initCookieBanner();
    }
}

export {};
