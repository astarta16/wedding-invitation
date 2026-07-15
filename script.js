const weddingDate = new Date("2026-08-28T15:00:00+04:00");

const countdownElements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const difference = weddingDate.getTime() - Date.now();

  if (difference <= 0) {
    Object.values(countdownElements).forEach((element) => {
      element.textContent = "00";
    });
    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  countdownElements.days.textContent = pad(Math.floor(difference / day));
  countdownElements.hours.textContent = pad(
    Math.floor((difference % day) / hour)
  );
  countdownElements.minutes.textContent = pad(
    Math.floor((difference % hour) / minute)
  );
  countdownElements.seconds.textContent = pad(
    Math.floor((difference % minute) / 1000)
  );
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealElements = document.querySelectorAll(".reveal:not(.visible)");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -24px 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let activeSlideIndex = 0;

function showNextHeroSlide() {
  heroSlides[activeSlideIndex].classList.remove("is-active");
  activeSlideIndex = (activeSlideIndex + 1) % heroSlides.length;
  heroSlides[activeSlideIndex].classList.add("is-active");
}

if (heroSlides.length > 1 && !prefersReducedMotion) {
  setInterval(showNextHeroSlide, 4800);
}

const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const backgroundMusic = document.getElementById("backgroundMusic");

let isMusicPlaying = false;

musicButton.addEventListener("click", async () => {
  try {
    if (isMusicPlaying) {
      backgroundMusic.pause();
      musicButton.classList.remove("is-playing");
      musicIcon.textContent = "♫";
      musicButton.setAttribute("aria-label", "მუსიკის ჩართვა");
    } else {
      await backgroundMusic.play();
      musicButton.classList.add("is-playing");
      musicIcon.textContent = "❚❚";
      musicButton.setAttribute("aria-label", "მუსიკის გამორთვა");
    }

    isMusicPlaying = !isMusicPlaying;
  } catch (error) {
    console.warn("მუსიკის ფაილი ჯერ არ არის დამატებული.", error);
  }
});

const lightbox = document.getElementById("photoLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const memoryPhotos = document.querySelectorAll(".memory-photo");

let lastFocusedPhoto = null;

function openLightbox(photoButton) {
  const imagePath = photoButton.dataset.photo;

  if (!imagePath) {
    return;
  }

  lastFocusedPhoto = photoButton;
  lightboxImage.src = imagePath;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("lightbox-open");

  if (lastFocusedPhoto) {
    lastFocusedPhoto.focus();
  }
}

memoryPhotos.forEach((photoButton) => {
  photoButton.addEventListener("click", () => openLightbox(photoButton));
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});
