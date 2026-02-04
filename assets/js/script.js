function initReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -42px 0px" }
  );

  revealElements.forEach((item) => observer.observe(item));
}

function initSectionFlow() {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("section-live", entry.isIntersecting));
    },
    { threshold: 0.32 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initHeaderState() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 18);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initAdaptiveHeaderTheme() {
  const header = document.getElementById("site-header");
  const logo = document.getElementById("site-logo");
  if (!header) return;

  const lightLogo = logo?.dataset?.logoLight || logo?.getAttribute("src") || "";
  const darkLogo = logo?.dataset?.logoDark || lightLogo;
  const sections = Array.from(document.querySelectorAll("section[data-surface]"));
  if (!sections.length) return;

  const applyTheme = (theme) => {
    const isLight = theme === "light";
    const wasLight = header.classList.contains("header-light");
    header.classList.toggle("header-light", isLight);
    header.classList.toggle("header-dark", !isLight);
    if (logo) logo.src = isLight ? darkLogo : lightLogo;
    if (wasLight !== isLight) {
      header.classList.remove("theme-switch");
      // Reflow for replaying animation on each theme change.
      void header.offsetWidth;
      header.classList.add("theme-switch");
    }
  };

  const resolveTheme = () => {
    const probeY = Math.max(86, header.getBoundingClientRect().height + 10);
    const active = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= probeY && rect.bottom >= probeY;
    });
    const surface = active?.dataset?.surface || "dark";
    applyTheme(surface === "dark" ? "light" : "dark");
  };

  resolveTheme();
  window.addEventListener("scroll", resolveTheme, { passive: true });
  window.addEventListener("resize", resolveTheme);
}

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initHeroBackgroundSwap() {
  if (document.getElementById("hero-video")) return;
  const heroBg = document.getElementById("hero-bg");
  if (!heroBg) return;

  const images = [
    "assets/img/styles/geosideal/kalipso-real.jpg",
    "assets/img/styles/geosideal/astra-real.jpg",
    "assets/img/styles/geosideal/marinara-real.jpg",
    "assets/img/factories/zov-real-1.webp"
  ];

  let index = 0;
  const setImage = () => {
    heroBg.style.backgroundImage = `url('${images[index]}')`;
    heroBg.animate([{ transform: "scale(1)" }, { transform: "scale(1.06)" }], {
      duration: 5400,
      easing: "linear",
      fill: "forwards"
    });
  };

  setImage();
  setInterval(() => {
    index = (index + 1) % images.length;
    setImage();
  }, 5600);
}

function initHeroVideoFreeze() {
  const heroVideo = document.getElementById("hero-video");
  if (!heroVideo) return;
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.volume = 0;

  heroVideo.addEventListener("ended", () => {
    const stopAt = Math.max(0, heroVideo.duration - 0.04);
    heroVideo.currentTime = stopAt;
    heroVideo.pause();
  });
}

function initCursorOrb() {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const orb = document.createElement("div");
  orb.className = "cursor-orb";
  document.body.appendChild(orb);

  let rafId = null;
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  const update = () => {
    orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    rafId = null;
  };

  window.addEventListener("mousemove", (event) => {
    x = event.clientX;
    y = event.clientY;
    if (!rafId) rafId = window.requestAnimationFrame(update);
  });

  const interactive = "a, button, .btn, .style-card, .factory-card, .slot-btn";
  document.querySelectorAll(interactive).forEach((el) => {
    el.addEventListener("mouseenter", () => orb.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => orb.classList.remove("is-hover"));
  });

  document.addEventListener("mouseleave", () => orb.classList.add("is-hidden"));
  document.addEventListener("mouseenter", () => orb.classList.remove("is-hidden"));
}

function initFloatingConsult() {
  if (document.querySelector(".floating-consult")) return;
  const btn = document.createElement("a");
  btn.className = "floating-consult";
  btn.href = "https://wa.me/77077432888";
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.innerHTML = `
    <span class="icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.51 4.51 0 0 0 12 12zm0 2.2c-3.1 0-8 1.55-8 4.65V21h16v-2.15c0-3.1-4.9-4.65-8-4.65z"/></svg>
    </span>
    <span>Запись в WhatsApp</span>
  `;
  document.body.appendChild(btn);
}

function getStarSvg(isActive) {
  return `<svg class="${isActive ? "active" : ""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.57 6.1 20.67l1.12-6.57L2.45 9.44l6.6-.96L12 2.5z"/></svg>`;
}

function renderStars(rating) {
  const full = Math.round(rating);
  let html = `<div class="stars" aria-label="Рейтинг ${rating} из 5">`;
  for (let i = 1; i <= 5; i += 1) html += getStarSvg(i <= full);
  html += "</div>";
  return html;
}

function renderReviewCard(review, isFeatured) {
  const extraClass = isFeatured ? " review-card-3d" : "";
  const role = review.role ? `<div class="review-date">${review.role}</div>` : `<div class="review-date">${review.date || ""}</div>`;
  const note = review.note ? `<div class="review-date">${review.note}</div>` : "";
  return `
    <article class="review-card${extraClass} reveal show">
      <div class="review-top">
        <div>
          <div class="review-name">${review.name || "Клиент"}</div>
          ${role}
          ${note}
        </div>
        ${renderStars(review.rating || 5)}
      </div>
      <p>${review.text}</p>
    </article>
  `;
}

async function renderReviews() {
  const listEl = document.getElementById("reviews-list");
  const overviewEl = document.getElementById("rating-overview");
  const featuredEl = document.getElementById("featured-reviews");
  if (!listEl && !overviewEl && !featuredEl) return;

  try {
    const response = await fetch("data/reviews.json");
    if (!response.ok) throw new Error("Не удалось загрузить отзывы");
    const payload = await response.json();

    if (overviewEl) {
      const { summary } = payload;
      overviewEl.innerHTML = `
        <span class="num">${summary.rating.toFixed(1)}</span>
        ${renderStars(summary.rating)}
        <span><strong>${summary.total}</strong> отзывов • <strong>${summary.satisfaction}%</strong> клиентов рекомендуют FABRIQ</span>
      `;
    }

    if (featuredEl) featuredEl.innerHTML = (payload.featured || []).map((item) => renderReviewCard(item, true)).join("");
    if (listEl) listEl.innerHTML = (payload.reviews || []).map((item) => renderReviewCard(item, false)).join("");
  } catch {
    if (overviewEl) overviewEl.textContent = "Отзывы временно недоступны.";
  }
}

function initBookingCalendar() {
  const app = document.getElementById("booking-app");
  if (!app) return;

  const monthEl = document.getElementById("booking-month");
  const daysEl = document.getElementById("booking-days");
  const slotsEl = document.getElementById("slot-list");
  const form = document.getElementById("booking-form");
  const submit = document.getElementById("booking-submit");
  const noteEl = document.getElementById("booking-note");
  const dateInput = document.getElementById("booking-date");
  const slotInput = document.getElementById("booking-slot");

  if (!monthEl || !daysEl || !slotsEl || !form || !submit || !noteEl || !dateInput || !slotInput) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = null;
  let selectedSlot = "";

  const slots = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];
  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  function toISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function getSlotState(date, slot) {
    const weekDay = date.getDay();
    const seed = date.getDate() + date.getMonth() * 3 + slot.length;
    if (weekDay === 0) return "booked";
    if (weekDay === 6 && (slot === "19:00" || slot === "17:30")) return "booked";
    if (seed % 5 === 0 || seed % 7 === 0) return "booked";
    return "available";
  }

  function updateSubmitState() {
    const enabled = Boolean(selectedDate && selectedSlot);
    submit.disabled = !enabled;
    submit.setAttribute("aria-disabled", String(!enabled));
  }

  function renderSlots() {
    slotsEl.innerHTML = "";
    selectedSlot = "";
    slotInput.value = "";
    updateSubmitState();

    if (!selectedDate) {
      slotsEl.innerHTML = `<p class="slot-empty">Выберите день в календаре, чтобы увидеть доступные слоты.</p>`;
      return;
    }

    slots.forEach((slot) => {
      const state = getSlotState(selectedDate, slot);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `slot-btn ${state}`;
      btn.textContent = state === "booked" ? `${slot} • занято` : `${slot} • свободно`;
      btn.disabled = state !== "available";

      if (state === "available") {
        btn.addEventListener("click", () => {
          slotsEl.querySelectorAll(".slot-btn.selected").forEach((item) => item.classList.remove("selected"));
          btn.classList.add("selected");
          selectedSlot = slot;
          slotInput.value = slot;
          updateSubmitState();
        });
      }
      slotsEl.appendChild(btn);
    });
  }

  function renderCalendar() {
    monthEl.textContent = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
    daysEl.innerHTML = "";

    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const totalDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const offset = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < offset; i += 1) {
      const empty = document.createElement("span");
      empty.className = "day-empty";
      daysEl.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-btn";
      btn.textContent = String(day);

      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isSelected = selectedDate && date.getTime() === selectedDate.getTime();

      if (isToday) btn.classList.add("today");
      if (isSelected) btn.classList.add("selected");
      if (isPast) {
        btn.disabled = true;
        btn.classList.add("past");
      } else {
        btn.addEventListener("click", () => {
          selectedDate = date;
          dateInput.value = toISO(date);
          renderCalendar();
          renderSlots();
          noteEl.textContent = `Вы выбрали ${date.toLocaleDateString("ru-RU")}. Теперь выберите свободный слот.`;
        });
      }

      daysEl.appendChild(btn);
    }
  }

  document.getElementById("booking-prev")?.addEventListener("click", () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    renderCalendar();
    renderSlots();
  });

  document.getElementById("booking-next")?.addEventListener("click", () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    renderCalendar();
    renderSlots();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    const name = document.getElementById("booking-name")?.value?.trim() || "Клиент";
    const phone = document.getElementById("booking-phone")?.value?.trim() || "";
    const dateText = selectedDate.toLocaleDateString("ru-RU");

    noteEl.textContent = `Слот ${selectedSlot}, ${dateText} выбран. Открываем WhatsApp для подтверждения.`;

    const message = encodeURIComponent(
      `Здравствуйте! Хочу записаться на консультацию FABRIQ.\nДата: ${dateText}\nВремя: ${selectedSlot}\nИмя: ${name}\nТелефон: ${phone}`
    );
    window.open(`https://wa.me/77077432888?text=${message}`, "_blank", "noopener");
    form.reset();
    selectedSlot = "";
    slotInput.value = "";
    updateSubmitState();
  });

  renderCalendar();
  renderSlots();
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

window.FabriqLanding = {
  initCalendar: initBookingCalendar,
  initTracker: () => console.log("Tracker integration point ready")
};

initReveal();
initSectionFlow();
initHeaderState();
initAdaptiveHeaderTheme();
initMobileMenu();
initHeroBackgroundSwap();
initHeroVideoFreeze();
initCursorOrb();
initFloatingConsult();
renderReviews();
initBookingCalendar();
setYear();
