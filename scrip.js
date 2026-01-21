AOS.init({
  duration: 1200,
  easing: 'ease-in-out',
  once: true
});

const weddingDate = new Date("2026-09-30T18:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff <= 0) return;

  document.getElementById("days").textContent =
    Math.floor(diff / (1000 * 60 * 60 * 24));

  document.getElementById("hours").textContent =
    Math.floor((diff / (1000 * 60 * 60)) % 24);

  document.getElementById("minutes").textContent =
    Math.floor((diff / (1000 * 60)) % 60);

  document.getElementById("seconds").textContent =
    Math.floor((diff / 1000) % 60);
}

setInterval(updateCountdown, 1000);
updateCountdown();
