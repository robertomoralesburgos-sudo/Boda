// script.js - comportamiento: intro pulsable, reveal main, carousel dots, modal RSVP (preview), lightbox, copy IBAN
document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const mainWrap = document.getElementById('main');
  const carousel = document.getElementById('carousel');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = document.getElementById('dots');

  // Build dots
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir a sección ${i+1}`);
    b.addEventListener('click', () => {
      s.scrollIntoView({behavior:'smooth', inline:'center'});
      setActiveDot(i);
      s.focus();
    });
    dots.appendChild(b);
  });
  function setActiveDot(i){
    Array.from(dots.children).forEach((btn, idx) => {
      if(idx===i) btn.setAttribute('aria-current','true'); else btn.removeAttribute('aria-current');
    });
  }
  setActiveDot(0);

  // While hidden, clicking intro reveals main
  function openInvitation() {
    intro.style.display = 'none';
    mainWrap.classList.remove('hidden');
    // focus first slide
    setTimeout(() => {
      slides[0].scrollIntoView({behavior:'smooth', inline:'center'});
      slides[0].focus();
    }, 60);
  }
  intro.addEventListener('click', openInvitation);
  intro.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') openInvitation(); });

  // Update active dot on scroll
  let ticking = false;
  carousel.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const center = carousel.scrollLeft + carousel.clientWidth / 2;
        let best = 0; let minDist = Infinity;
        slides.forEach((s, idx) => {
          const rect = s.getBoundingClientRect();
          const sCenter = rect.left + rect.width/2 + carousel.scrollLeft - carousel.getBoundingClientRect().left;
          const dist = Math.abs(sCenter - center);
          if(dist < minDist){ minDist = dist; best = idx; }
        });
        setActiveDot(best);
        ticking = false;
      });
      ticking = true;
    }
  });

  // RSVP modal handling (preview-only)
  const openEnvelope = document.getElementById('open-envelope');
  const rsvpModal = document.getElementById('rsvp-modal');
  const closeRsvp = document.getElementById('close-rsvp');
  const rCancel = document.getElementById('r-cancel');
  const rForm = document.getElementById('rsvp-form');
  const rStatus = document.getElementById('r-status');

  function showModal(){ rsvpModal.setAttribute('aria-hidden','false'); setTimeout(()=>document.getElementById('r-name')?.focus(), 120); }
  function hideModal(){ rsvpModal.setAttribute('aria-hidden','true'); openEnvelope?.focus(); }

  openEnvelope?.addEventListener('click', (e)=>{ e.preventDefault(); showModal(); });
  closeRsvp?.addEventListener('click', hideModal);
  rCancel?.addEventListener('click', hideModal);
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && rsvpModal.getAttribute('aria-hidden') === 'false') hideModal(); });

  rForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    rStatus.hidden = true;
    const name = rForm.name.value.trim();
    if(!name){ rStatus.textContent = 'Por favor indica tu nombre.'; rStatus.hidden = false; return; }
    rStatus.textContent = 'Gracias — (vista previa).';
    rStatus.hidden = false;
    rForm.reset();
    setTimeout(hideModal, 900);
  });

  // Gallery lightbox
  const photos = Array.from(document.querySelectorAll('.photos img'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');

  photos.forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lightbox.setAttribute('aria-hidden','false');
      lbClose?.focus();
    });
  });
  lbClose?.addEventListener('click', () => lightbox.setAttribute('aria-hidden','true'));
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') lightbox.setAttribute('aria-hidden','true'); });
  lightbox?.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.setAttribute('aria-hidden','true'); });

  // Copy IBAN
  const copyBtn = document.getElementById('copy-iban');
  copyBtn?.addEventListener('click', async () => {
    const iban = document.querySelector('.iban')?.textContent || '';
    try {
      await navigator.clipboard.writeText(iban);
      copyBtn.textContent = 'Copiado ✓';
      setTimeout(()=> copyBtn.textContent = 'Copiar IBAN', 1400);
    } catch (err) {
      copyBtn.textContent = 'No disponible';
    }
  });

  // Keyboard navigation left/right
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
      ev.preventDefault();
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      let current = 0; let minDist = Infinity;
      slides.forEach((s, idx) => {
        const rect = s.getBoundingClientRect();
        const sCenter = rect.left + rect.width/2 + carousel.scrollLeft - carousel.getBoundingClientRect().left;
        const dist = Math.abs(sCenter - center);
        if (dist < minDist) { minDist = dist; current = idx; }
      });
      if (ev.key === 'ArrowRight' && current < slides.length - 1) current++;
      if (ev.key === 'ArrowLeft' && current > 0) current--;
      slides[current].scrollIntoView({behavior:'smooth', inline:'center'});
      slides[current].focus();
      setActiveDot(current);
    }
  });
});
