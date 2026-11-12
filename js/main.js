(() => {
  "use strict";

  const STORAGE_KEY = "nest-bed-lang";

  const copy = {
    en: {
      eyebrow: "NEST COLLECTION",
      title: "Nest Bed",
      description:
        "A thoughtfully designed multifunctional bed that combines elegant aesthetics, smart storage, and everyday comfort.",
      cabinet: "Cabinet",
      sleepingArea: "Sleeping Area",
      cta: "Pre-order",
      tagline: "Designed for modern living.",
      imageAlt: "Nest Bed multifunctional oak cabinet bed",
      modalTitle: "Pre-order received",
      modalText:
        "Thank you for your interest in Nest Bed. We will contact you shortly with pre-order details.",
      modalClose: "Close",
      close: "Close",
      langGroup: "Language",
      price: "Price",
      documentTitle: "Nest Bed | Nest Collection",
    },
    tr: {
      eyebrow: "NEST KOLEKSİYONU",
      title: "Nest Yatak",
      description:
        "Zarif estetik, akıllı depolama ve günlük konforu bir araya getiren özenle tasarlanmış çok işlevli bir yatak.",
      cabinet: "Dolap",
      sleepingArea: "Yatak Alanı",
      cta: "Ön Sipariş Ver",
      tagline: "Modern yaşam için tasarlandı.",
      imageAlt: "Nest Yatak çok işlevli meşe dolap yatağı",
      modalTitle: "Ön sipariş alındı",
      modalText:
        "Nest Yatak’a gösterdiğiniz ilgi için teşekkür ederiz. Ön sipariş detayları için kısa süre içinde sizinle iletişime geçeceğiz.",
      modalClose: "Kapat",
      close: "Kapat",
      langGroup: "Dil",
      price: "Fiyat",
      documentTitle: "Nest Yatak | Nest Koleksiyonu",
    },
  };

  const langButtons = document.querySelectorAll(".lang-switcher__btn");
  const langGroup = document.querySelector(".lang-switcher");
  const preorderBtn = document.querySelector(".btn-preorder:not([data-modal-close])");
  const modal = document.getElementById("preorder-modal");
  const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");
  let activeLang = "en";
  let fadeTimer = null;
  let lastFocus = null;

  function getStoredLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "tr") return saved;
    } catch (_) {
      /* ignore */
    }
    return null;
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      /* ignore */
    }
  }

  function applyCopy(lang) {
    const strings = copy[lang];
    if (!strings) return;

    document.documentElement.lang = lang;
    document.title = strings.documentTitle;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && strings[key] != null) {
        el.textContent = strings[key];
      }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (key && strings[key] != null) {
        el.setAttribute("alt", strings[key]);
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key && strings[key] != null) {
        el.setAttribute("aria-label", strings[key]);
      }
    });

    if (langGroup && strings.langGroup) {
      langGroup.setAttribute("aria-label", strings.langGroup);
    }

    langButtons.forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    activeLang = lang;
    storeLang(lang);
  }

  function setLanguage(lang, { animate = true } = {}) {
    if (!copy[lang] || lang === activeLang) {
      applyCopy(lang);
      return;
    }

    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyCopy(lang);
      return;
    }

    document.body.classList.add("is-fading");
    window.clearTimeout(fadeTimer);
    fadeTimer = window.setTimeout(() => {
      applyCopy(lang);
      document.body.classList.remove("is-fading");
    }, 180);
  }

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const focusTarget =
      modal.querySelector(".btn-preorder--compact") ||
      modal.querySelector(".modal__close");
    if (focusTarget) focusTarget.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (lang) setLanguage(lang);
    });
  });

  if (preorderBtn) {
    preorderBtn.addEventListener("click", openModal);
  }

  modalCloseTriggers.forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  const initial = getStoredLang() || "en";
  applyCopy(initial);
})();
