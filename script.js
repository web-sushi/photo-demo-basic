// Nav scroll effect
const nav = document.querySelector(".nav");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Prevent booking past dates
const dateInput = document.getElementById("sessionDate");
if (dateInput) {
  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);

  // Optional: Set maximum date (e.g., 6 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  dateInput.setAttribute("max", maxDate.toISOString().split("T")[0]);
}

// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (toggle && mobileMenu) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!expanded));

    if (!expanded) {
      // OPEN
      mobileMenu.hidden = false;
      requestAnimationFrame(() => {
        mobileMenu.classList.add("is-open");
      });
    } else {
      // CLOSE
      mobileMenu.classList.remove("is-open");
      setTimeout(() => {
        mobileMenu.hidden = true;
      }, 250); // match CSS transition
    }
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      setTimeout(() => {
        mobileMenu.hidden = true;
      }, 250);
    });
  });
}

// Gallery filtering + lightbox
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const cards = Array.from(document.querySelectorAll(".gallery .card"));

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    // aria-selected (nice touch)
    filterButtons.forEach((b) => b.setAttribute("aria-selected", "false"));
    btn.setAttribute("aria-selected", "true");

    cards.forEach((card) => {
      const category = card.dataset.category;
      const show = filter === "all" || category === filter;
      card.style.display = show ? "" : "none";
    });
  });
});

// Lightbox elements
const lightbox = document.querySelector(".lightbox");
const lbImg = document.querySelector(".lightbox-img");
const lbCap = document.querySelector(".lightbox-cap");
const lbClose = document.querySelector(".lightbox-close");
const lbPrev = document.querySelector(".lightbox-prev");
const lbNext = document.querySelector(".lightbox-next");

// Build a list of currently visible images for next/prev
function getVisibleButtons() {
  const visibleCards = cards.filter((c) => c.style.display !== "none");
  return visibleCards
    .map((c) => c.querySelector(".card-media"))
    .filter(Boolean);
}

let currentIndex = 0;

function openLightbox(buttonEl) {
  if (!lightbox) return;

  const visibleButtons = getVisibleButtons();
  currentIndex = visibleButtons.indexOf(buttonEl);

  const full = buttonEl.getAttribute("data-full");
  const caption = buttonEl.getAttribute("data-caption") || "";

  // Set image source and alt text
  lbImg.src = full;
  lbImg.alt = caption || "Expanded photo";
  lbCap.textContent = caption;

  // Show lightbox after setting the image
  lightbox.removeAttribute("hidden");
  lightbox.style.display = "grid";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  lightbox.style.display = "none";
  document.body.style.overflow = "";
}

function stepLightbox(dir) {
  const visibleButtons = getVisibleButtons();
  if (visibleButtons.length === 0) return;

  currentIndex =
    (currentIndex + dir + visibleButtons.length) % visibleButtons.length;

  const btn = visibleButtons[currentIndex];
  const full = btn.getAttribute("data-full");
  const caption = btn.getAttribute("data-caption") || "";

  lbImg.src = full;
  lbImg.alt = caption || "Expanded photo";
  lbCap.textContent = caption;
}

// Click-to-open
document.querySelectorAll(".card-media").forEach((btn) => {
  btn.addEventListener("click", () => openLightbox(btn));
});

// Controls - with e.stopPropagation() to prevent event bubbling
if (lbClose) {
  lbClose.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("Close button clicked!");
    closeLightbox();
  });
}

if (lbPrev) {
  lbPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("Previous button clicked!");
    stepLightbox(-1);
  });
}

if (lbNext) {
  lbNext.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("Next button clicked!");
    stepLightbox(1);
  });
}

// Close on backdrop click
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      console.log("Backdrop clicked!");
      closeLightbox();
    }
  });
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (!lightbox || lightbox.hidden) return;
  if (e.key === "Escape") {
    console.log("Escape pressed!");
    closeLightbox();
  }
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});
