export function computeCounterFrames(target, frameCount = 30) {
  const steps = Math.min(frameCount, target) || 1;
  const frames = [];
  for (let i = 0; i <= steps; i++) {
    frames.push(Math.round((target / steps) * i));
  }
  return frames;
}

export function initCounters() {
  const els = document.querySelectorAll('.number-counter');
  els.forEach((el) => {
    const target = Number(el.dataset.target);
    const frames = computeCounterFrames(target);
    let i = 0;
    const timer = setInterval(() => {
      el.textContent = String(frames[i]);
      i++;
      if (i >= frames.length) clearInterval(timer);
    }, 40);
  });
}
