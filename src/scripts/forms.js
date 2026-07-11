const MIN_SUBMIT_MS = 3000;

export function isLikelySpam({ honeypot, elapsedMs }) {
  if (honeypot && honeypot.trim() !== '') return true;
  if (elapsedMs < MIN_SUBMIT_MS) return true;
  return false;
}

export function initForm(formEl, endpoint) {
  if (!formEl) return;
  const loadedAt = Date.now();

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const statusEl = formEl.querySelector('.form-status');
    const honeypot = formEl.querySelector('input[name="website"]')?.value ?? '';
    const elapsedMs = Date.now() - loadedAt;

    if (isLikelySpam({ honeypot, elapsedMs })) {
      if (statusEl) statusEl.textContent = 'Não foi possível enviar. Tente novamente.';
      return;
    }

    const formData = new FormData(formEl);
    try {
      const res = await fetch(endpoint, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('request failed');
      if (statusEl) statusEl.textContent = 'Enviado com sucesso! Entraremos em contato em breve.';
      formEl.reset();
    } catch {
      if (statusEl) statusEl.textContent = 'Erro ao enviar. Tente novamente em instantes.';
    }
  });
}
