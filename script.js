(() => {
  const root = document.documentElement;
  const progress = document.querySelector('.reading-progress span');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealItems = document.querySelectorAll('[data-reveal]');

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    root.classList.add('js-enabled');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });

    revealItems.forEach((item) => observer.observe(item));
  }

  let scheduled = false;
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, percentage))})`;
    scheduled = false;
  };

  window.addEventListener('scroll', () => {
    if (!scheduled) {
      window.requestAnimationFrame(updateProgress);
      scheduled = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  initIntroSimulation(root, reducedMotion);
})();

/*
 * Simulação do vídeo de abertura (docs/landing-page.md, 8.2, v0.1).
 * Não há vídeo: só um contador visual de 10 s. A rolagem fica bloqueada até o
 * contador zerar ou o visitante acionar "ir para a pagina". O bloqueio usa só
 * overflow no documento: nada recebe inert/aria-hidden, então teclado e
 * leitores de tela continuam alcançando todo o conteúdo.
 */
function initIntroSimulation(root, reducedMotion) {
  const DURATION_MS = 10000;
  const screen = document.querySelector('[data-intro-sim]');
  if (!screen) return;

  const hero = screen.closest('.hero') || screen;
  const timer = screen.querySelector('.sim-timer');
  const stateLabel = screen.querySelector('.sim-state');
  const count = screen.querySelector('.sim-count');
  const bar = screen.querySelector('.sim-progress');
  const barFill = bar.querySelector('span');
  const skip = screen.querySelector('.sim-skip');
  const status = screen.querySelector('[data-sim-status]');
  const continueLink = document.querySelector('.scroll-cue');

  let released = false;
  let startedAt = 0;
  let frameId = 0;
  let tickId = 0;
  let endId = 0;

  const formatRemaining = (ms) => {
    const seconds = Math.max(0, Math.ceil(ms / 1000));
    return `00:${String(seconds).padStart(2, '0')}`;
  };

  const render = (elapsed) => {
    const clamped = Math.min(DURATION_MS, Math.max(0, elapsed));
    count.textContent = formatRemaining(DURATION_MS - clamped);
    // Com movimento reduzido a barra avança em degraus de 1 s, sem animação contínua.
    const ratio = reducedMotion.matches
      ? Math.floor(clamped / 1000) / (DURATION_MS / 1000)
      : clamped / DURATION_MS;
    barFill.style.transform = `scaleX(${ratio})`;
  };

  const elapsedNow = () => performance.now() - startedAt;

  const loop = () => {
    render(elapsedNow());
    if (!released) frameId = window.requestAnimationFrame(loop);
  };

  // Controles (contador, barra e botão) ficam no topo da área. Se a área começar
  // abaixo da dobra, desloca só o necessário para essa faixa ficar visível,
  // sem esconder a pergunta do hero mais que o preciso.
  const CONTROLS_BAND = 150;
  const keepScreenInView = () => {
    if (released) return;
    const rect = screen.getBoundingClientRect();
    const margin = 16;
    const band = Math.min(rect.height, CONTROLS_BAND);
    let delta = 0;
    if (rect.top + band > window.innerHeight - margin) delta = rect.top + band - window.innerHeight + margin;
    if (rect.top - delta < margin) delta = rect.top - margin;
    const target = Math.max(0, Math.round(window.scrollY + delta));
    if (target !== Math.round(window.scrollY)) window.scrollTo({ top: target, left: 0, behavior: 'instant' });
  };

  const scrollKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar']);
  const isInteractive = (el) => el instanceof Element && el.closest('button, a, input, select, textarea, [contenteditable], [tabindex]');

  const blockWheel = (event) => { if (!event.ctrlKey) event.preventDefault(); };
  // Só bloqueia arraste com um dedo: pinça para zoom continua livre.
  const blockTouch = (event) => { if (event.touches.length === 1) event.preventDefault(); };
  const blockKeys = (event) => {
    if (!scrollKeys.has(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
    if ((event.key === ' ' || event.key === 'Spacebar') && isInteractive(event.target)) return;
    event.preventDefault();
  };

  // Teclado/leitor de tela que leve o foco para além do hero (ex.: footer)
  // libera a página em vez de deixar o foco preso numa área que não rola.
  const releaseOnFocusAway = (event) => {
    const el = event.target;
    if (!(el instanceof Element) || hero.contains(el) || el.closest('.site-header, .skip-link')) return;
    release('focus');
  };

  // Ativar uma âncora interna para fora do hero durante a contagem é navegação explícita: libera.
  const releaseOnAnchor = (event) => {
    const link = event.target instanceof Element && event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (target && target !== hero && !hero.contains(target)) release('anchor');
  };

  const lock = () => {
    root.classList.add('is-scroll-locked');
    window.addEventListener('wheel', blockWheel, { passive: false });
    window.addEventListener('touchmove', blockTouch, { passive: false });
    window.addEventListener('keydown', blockKeys);
    window.addEventListener('resize', keepScreenInView, { passive: true });
    document.addEventListener('focusin', releaseOnFocusAway);
    document.addEventListener('click', releaseOnAnchor, true);
  };

  const unlock = () => {
    root.classList.remove('is-scroll-locked');
    window.removeEventListener('wheel', blockWheel);
    window.removeEventListener('touchmove', blockTouch);
    window.removeEventListener('keydown', blockKeys);
    window.removeEventListener('resize', keepScreenInView);
    document.removeEventListener('focusin', releaseOnFocusAway);
    document.removeEventListener('click', releaseOnAnchor, true);
  };

  const pause = () => {
    screen.classList.add('is-sim-paused');
    stateLabel.textContent = 'Simulação pausada';
  };

  function release(reason) {
    if (released) return;
    released = true;
    window.cancelAnimationFrame(frameId);
    window.clearInterval(tickId);
    window.clearTimeout(endId);
    render(reason === 'end' ? DURATION_MS : elapsedNow());
    pause();
    unlock();

    const skipHadFocus = document.activeElement === skip;
    skip.hidden = true;
    if (skipHadFocus && continueLink) continueLink.focus({ preventScroll: true });

    status.textContent = 'Navegação liberada. Role para continuar a história.';
    root.dataset.introSim = 'released';
    root.dataset.introSimReason = reason;
  }

  timer.hidden = false;
  bar.hidden = false;

  // Abrir/recarregar com âncora na URL (ex.: #visao, ou #inicio depois de
  // "Voltar ao início") não bloqueia: a simulação aparece pausada e a página
  // rola normalmente. A liberação nunca é desfeita, então navegar por âncoras
  // na mesma carga também não bloqueia de novo.
  if (location.hash.length > 1) {
    released = true;
    render(0);
    pause();
    root.dataset.introSim = 'released';
    root.dataset.introSimReason = 'hash';
    return;
  }

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  skip.hidden = false;
  skip.addEventListener('click', () => release('skip'));
  status.textContent = 'Simulação visual de 10 segundos, sem vídeo. A rolagem é liberada ao final ou pelo botão ir para a pagina.';
  root.dataset.introSim = 'running';

  lock();
  keepScreenInView();
  startedAt = performance.now();
  render(0);

  if (reducedMotion.matches) {
    tickId = window.setInterval(() => render(elapsedNow()), 250);
  } else {
    frameId = window.requestAnimationFrame(loop);
  }
  endId = window.setTimeout(() => release('end'), DURATION_MS);
}
