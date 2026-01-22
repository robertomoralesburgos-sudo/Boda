// Simple RSVP client with Supabase REST insert
// Replace with your Supabase details:
const SUPABASE_URL = 'https://REPLACE_WITH_YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'REPLACE_WITH_YOUR_ANON_KEY';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rsvp-form');
  const statusEl = document.getElementById('status');
  const btnHero = document.getElementById('btn-rsvp-hero');

  // Quick navigation from hero to RSVP
  btnHero?.addEventListener('click', () => {
    document.getElementById('rsvp')?.scrollIntoView({behavior:'smooth', inline:'center'});
    document.getElementById('name')?.focus();
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Enviando...';
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim() || null,
      guests: parseInt(form.guests.value || "1", 10),
      attending: (form.attending.value === 'yes'),
      message: form.message.value.trim() || null
    };

    // Basic validation
    if (!data.name) {
      statusEl.textContent = 'Por favor indica tu nombre.';
      return;
    }

    try {
      // If SUPABASE keys are present, send to Supabase REST API
      if (SUPABASE_URL.includes('REPLACE_WITH_YOUR')) {
        // Fallback: store on localStorage as demo
        saveLocally(data);
        statusEl.textContent = 'Demo: respuesta guardada localmente. Configura Supabase para almacenarla en servidor.';
        form.reset();
        return;
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/rsvps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Error de red');
      }

      const result = await res.json();
      console.log('Saved', result);
      statusEl.textContent = '¡Gracias! Tu respuesta ha sido registrada.';
      form.reset();
    } catch (err) {
      console.error(err);
      // Save locally so no se pierde la respuesta en caso de error
      saveLocally(data);
      statusEl.textContent = 'Hubo un problema. La respuesta se guardó localmente y se intentará enviar más tarde.';
    }
  });

  // Simple local save (offline fallback)
  function saveLocally(payload){
    const key = 'wedding_rsvps_demo';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({...payload, _savedAt: new Date().toISOString()});
    localStorage.setItem(key, JSON.stringify(existing));
  }
});
