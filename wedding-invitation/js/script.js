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
    dateTime: "2026-12-05T14:00:00"
  };

  // WhatsApp RSVP contacts: use international numbers with digits only.
  const RSVP_CONFIG = {
    whatsappRecipients: [
      {
        name: "Wedding Contact 1",
        number: "2349031784836"
      },
      {
        name: "Wedding Contact 2",
        number: "2348142439835"
      }
    ]
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
    menuToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    nav.classList.toggle("open", !open);
    header.classList.toggle("nav-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      nav.classList.remove("open");
      header.classList.remove("nav-open");
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
  const confirmation = document.querySelector("#rsvp-confirmation");
  const confirmationMessage = document.querySelector("#rsvp-confirmation-message");
  const editResponseButton = document.querySelector("#edit-rsvp");

  function hideConfirmation() {
    confirmation.hidden = true;
    formStatus.textContent = "";
  }

  form.addEventListener("input", hideConfirmation);
  form.addEventListener("change", hideConfirmation);

  editResponseButton.addEventListener("click", () => {
    hideConfirmation();
    form.querySelector("#guest-name").focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    if (!form.checkValidity()) {
      const invalidField = form.querySelector(":invalid");
      if (invalidField.id === "guest-email") {
        formStatus.textContent = "Please enter a valid email address or leave the email field blank.";
      } else if (invalidField.id === "guest-phone") {
        formStatus.textContent = "Please enter your phone number before preparing your RSVP.";
      } else {
        formStatus.textContent = "Please enter your name before preparing your RSVP.";
      }
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const guestName = formData.get("name").trim();
    const email = formData.get("email").trim();
    const phone = formData.get("phone").trim();
    const attendance = formData.get("attendance") === "Joyfully Accept"
      ? "Attending"
      : "Unable to Attend";
    const guestCount = `${formData.get("guests")} ${formData.get("guests") === "1" ? "guest" : "guests"}`;
    const personalMessage = formData.get("message").trim();
    const weddingNames = `${wedding.couple.groom} & ${wedding.couple.bride}`;
    const attendanceMessage = attendance === "Attending"
      ? `My name is ${guestName}, and I am delighted to confirm that I will be attending the wedding celebration of ${weddingNames}. ❤️`
      : `I am sorry that I will not be able to attend the wedding celebration of ${weddingNames}. Please accept my warm wishes and congratulations.`;
    const detailLines = [
      `Full Name: ${guestName}`,
      email && `Email: ${email}`,
      `Phone Number: ${phone}`,
      `Attendance: ${attendance}`,
      `Number of Guests: ${guestCount}`,
      personalMessage && `Message: ${personalMessage}`
    ].filter(Boolean);
    const message = [
      "Good day!",
      "",
      attendanceMessage,
      "",
      "Here are my RSVP details:",
      "",
      ...detailLines,
      "",
      "Thank you for sharing this special moment with us. We look forward to celebrating with you!",
      "",
      "God bless you. ❤️"
    ].join("\n");

    RSVP_CONFIG.whatsappRecipients.forEach((recipient, index) => {
      const link = document.querySelector(`#whatsapp-contact-${index + 1}`);
      const contactLabel = `Contact ${index + 1}`;
      link.href = `https://wa.me/${recipient.number}?text=${encodeURIComponent(message)}`;
      link.textContent = `Send RSVP to ${contactLabel}`;
      link.setAttribute("aria-label", `Send RSVP to ${contactLabel} (${recipient.name})`);
    });

    confirmationMessage.textContent = "Your RSVP details are ready. Please send your response to our wedding contacts. Tap Send in WhatsApp to deliver it.";
    confirmation.hidden = false;
    confirmation.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center"
    });
  });
})();
