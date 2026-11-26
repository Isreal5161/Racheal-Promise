(function () {
  "use strict";

  // Edit this one section to personalize the website.
  const wedding = {
    couple: {
      groom: "RACHEAL",
      bride: "PROMISE"
    },
    dateLabel: "5th DECEMBER 2026",
    // ISO format with local wedding time, for example: "2027-06-12T14:00:00"
    dateTime: "2026-12-05T14:00:00",
    rsvpEndpoint: "" // Paste a Formspree, Google Apps Script or other HTTPS endpoint here.
  };

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });

  document.querySelectorAll("[data-wedding-date-label]").forEach((element) => {
    element.textContent = wedding.dateLabel;
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".reveal-up, .reveal-image").forEach((element) => {
    revealObserver.observe(element);
  });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const parallaxItems = document.querySelectorAll("[data-parallax]");

    function updateParallax() {
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const offset = (progress - 0.5) * 28;
          item.querySelector("img").style.transform = `translateY(${offset}px) scale(1.02)`;
        }
      });
    }

    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    updateParallax();
  }

  const countdown = document.querySelector(".countdown");
  const target = Date.parse(wedding.dateTime);

  function updateCountdown() {
    if (!Number.isFinite(target)) {
      document.querySelector("#days").textContent = "000";
      document.querySelector("#hours").textContent = "00";
      document.querySelector("#minutes").textContent = "00";
      document.querySelector("#seconds").textContent = "00";
      return;
    }

    const remaining = target - Date.now();
    if (remaining <= 0) {
      countdown.innerHTML = '<strong class="countdown-celebration">THE CELEBRATION HAS BEGUN</strong>';
      countdown.style.display = "block";
      return;
    }

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining / 3600000) % 24);
    const minutes = Math.floor((remaining / 60000) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);
    document.querySelector("#days").textContent = String(days).padStart(3, "0");
    document.querySelector("#hours").textContent = String(hours).padStart(2, "0");
    document.querySelector("#minutes").textContent = String(minutes).padStart(2, "0");
    document.querySelector("#seconds").textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox.querySelector("img");
  const lightboxClose = document.querySelector(".lightbox-close");
  let lightboxTrigger = null;

  function openLightbox(trigger) {
    lightboxTrigger = trigger;
    lightboxImage.src = trigger.dataset.full;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxImage.src = "";
    if (lightboxTrigger) lightboxTrigger.focus();
  }

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });

  const musicToggle = document.querySelector(".music-toggle");
  const music = document.querySelector("#background-music");

  musicToggle.addEventListener("click", async () => {
    try {
      if (music.paused) {
        await music.play();
        musicToggle.classList.add("playing");
        musicToggle.setAttribute("aria-pressed", "true");
        musicToggle.setAttribute("aria-label", "Pause background music");
      } else {
        music.pause();
        musicToggle.classList.remove("playing");
        musicToggle.setAttribute("aria-pressed", "false");
        musicToggle.setAttribute("aria-label", "Resume background music");
      }
    } catch (error) {
      console.warn("Background music could not be played:", error);
    }
  });

  const accountNumber = document.querySelector("#account-number");
  const copyAccountButton = document.querySelector("#copy-account-button");
  const copyAccountStatus = document.querySelector("#copy-account-status");

  function fallbackCopyText(text) {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = text;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } finally {
      temporaryInput.remove();
    }
    return copied;
  }

  copyAccountButton.addEventListener("click", async () => {
    const value = accountNumber.textContent.trim();
    copyAccountStatus.textContent = "";

    try {
      if (window.isSecureContext && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(value);
          copyAccountStatus.textContent = "Account number copied.";
          return;
        } catch {
          // Use the selection-based fallback when clipboard permissions are unavailable.
        }
      }

      if (fallbackCopyText(value)) {
        copyAccountStatus.textContent = "Account number copied.";
      } else {
        copyAccountStatus.textContent = "Copy unavailable. Please select and copy the account number.";
      }
    } catch {
      copyAccountStatus.textContent = "Copy unavailable. Please select and copy the account number.";
    }
  });

  const form = document.querySelector("#rsvp-form");
  const formStatus = document.querySelector("#form-status");
  const submitButton = form.querySelector(".submit-button");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    if (!form.checkValidity()) {
      formStatus.textContent = "Please complete the required fields before submitting.";
      form.reportValidity();
      return;
    }

    if (!wedding.rsvpEndpoint) {
      formStatus.textContent = "RSVP submission is not configured yet. Please contact the couple directly.";
      return;
    }

    submitButton.disabled = true;
    submitButton.querySelector("span").textContent = "Sending...";

    try {
      const response = await fetch(wedding.rsvpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });

      if (!response.ok) throw new Error(`Submission failed (${response.status})`);

      form.reset();
      formStatus.textContent = "Thank you. Your response has been received.";
      submitButton.querySelector("span").textContent = "Response Sent";
    } catch (error) {
      console.error("RSVP submission error:", error);
      formStatus.textContent = "We could not receive your response. Please try again or contact the couple.";
      submitButton.querySelector("span").textContent = "Send RSVP";
    } finally {
      submitButton.disabled = false;
    }
  });
})();
