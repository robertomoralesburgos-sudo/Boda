// Starter preview: horizontal panels + nav dots + RSVP (local, no storage)
// Behavior:
// - Dots reflect panels, clicking moves to panel
// - Hero RSVP button scrolls to RSVP panel
// - Submit validates and shows a preview-only confirmation overlay (no network / no storage)

document.addEventListener('DOMContentLoaded', () => {
  const panelContainer = document.getElementById('panels');
  const panels = Array.from(document.querySelectorAll('.panel'));
  const dots = document.getElementById('dots');
  const btnRsvp = document.getElementById('btn-rsvp');
  const form = document.getElementById('rsvp-form');
  const formStatus = document.getElementById('form-status');
  const confirm = document.getElementById('confirm');
  const confirmClose = document.getElementById('confirm-close');
  const btnReset = document.getElementById('btn-reset');

  // Build dots
  panels.forEach((p, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir a sección ${i + 1}`);
    b.addEventListener('click', () => {
      p.scrollIntoView({behavior: 'smooth', inline: 'center'});
      setActiveDot(i);
      p.focus();
    });
    dots.appendChild(b);
  });

  function setActiveDot(index) {
    const btns = Array.from(dots.children);
    btns.forEach((b, i) => {
      if (i === index) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  // Update active dot while scrolling
  let ticking = false;
  panelContainer.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const centerX = panelContainer.scrollLeft + panelContainer.clientWidth / 2;
        let idx = 0;
        let minDist = Infinity;
        panels.forEach((p, i) => {
          const rect = p.getBoundingClientRect();
          const pCenter = rect.left + rect.width / 2 + panelContainer.scrollLeft - panelContainer.getBoundingClientRect().left;
          const dist = Math.abs(pCenter - centerX);
          if (dist < minDist) { minDist = dist; idx = i; }
        });
        setActiveDot(idx);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial active dot
  setActiveDot(0);

  // Hero RSVP scroll
  btnRsvp?.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('panel-rsvp');
    target?.scrollIntoView({behavior: 'smooth', inline: 'center'});
    // focus name input after scroll
    setTimeout(() => {
      document.getElementById('name')?.focus();
    }, 500);
  });

  // Form submit (preview only)
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.hidden = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();

    if (!name) {
      formStatus.textContent = 'Por favor indica tu nombre.';
      formStatus.hidden = false;
      return;
    }
    // Show confirmation overlay (no network)
    confirm.setAttribute('aria-hidden', 'false');
    form.reset();
  });

  confirmClose?.addEventListener('click', () => {
    confirm.setAttribute('aria-hidden', 'true');
    // Return focus to RSVP panel
    document.getElementById('panel-rsvp')?.focus();
  });

  // Reset button (form)
  btnReset?.addEventListener('click', () => {
    form.reset();
    formStatus.hidden = true;
  });

  // Keyboard navigation: left/right between panels
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
      ev.preventDefault();
      const centerX = panelContainer.scrollLeft + panelContainer.clientWidth / 2;
      let idx = 0;
      let minDist = Infinity;
      panels.forEach((p, i) => {
        const rect = p.getBoundingClientRect();
        const pCenter = rect.left + rect.width / 2 + panelContainer.scrollLeft - panelContainer.getBoundingClientRect().left;
        const dist = Math.abs(pCenter - centerX);
        if (dist < minDist) { minDist = dist; idx = i; }
      });
      if (ev.key === 'ArrowRight' && idx < panels.length - 1) idx++;
      if (ev.key === 'ArrowLeft' && idx > 0) idx--;
      panels[idx].scrollIntoView({behavior: 'smooth', inline: 'center'});
      panels[idx].focus();
      setActiveDot(idx);
    }
  });
});
