"use client";

/*
 * Experiência de abertura do vídeo (docs/landing-page.md, 8.2).
 * Não existe arquivo de vídeo: o espaço reservado executa uma simulação
 * claramente identificada (contador de 10 s), nunca alegando reprodução real.
 * O componente já está pronto para receber um ativo de vídeo local depois.
 *
 * Estados:
 * - opening: o espaço reservado fica em primeiro plano numa camada fixa; a
 *   página fica visível atrás, escurecida e translúcida; rolagem bloqueada
 *   (sem prender foco nem leitores de tela).
 * - revealed: camada encerrada; o espaço reservado fica no hero, antes do
 *   título, em pausa, com o botão "assistir novamente".
 */

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 10000;
const LEAVE_MS = 450;

type Phase = "opening" | "leaving" | "revealed";
type ReleaseReason = "end" | "skip" | "focus" | "anchor";

const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
  "Spacebar",
]);

function formatRemaining(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `00:${String(seconds).padStart(2, "0")}`;
}

export default function OpeningVideo() {
  const [phase, setPhase] = useState<Phase>("opening");
  const countRef = useRef<HTMLSpanElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const replayRef = useRef<HTMLButtonElement | null>(null);
  const statusRef = useRef<HTMLParagraphElement | null>(null);
  // Ações expostas para fora do efeito (JSX) apontam para a rotina viva.
  const startRef = useRef<(() => void) | null>(null);
  const skipActionRef = useRef<(() => void) | null>(null);
  const skipBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const hero = document.querySelector(".hero");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let startedAt = 0;
    let rafId = 0;
    let tickId = 0;
    let endId = 0;
    let leaveId = 0;
    let focusId = 0;
    let released = false;
    let disposed = false;

    const isInteractive = (el: EventTarget | null): boolean =>
      el instanceof Element &&
      el.closest(
        "button, a, input, select, textarea, [contenteditable], [tabindex]",
      ) !== null;

    const render = (elapsed: number) => {
      const clamped = Math.min(DURATION_MS, Math.max(0, elapsed));
      if (countRef.current) {
        countRef.current.textContent = formatRemaining(DURATION_MS - clamped);
      }
      if (fillRef.current) {
        // Com movimento reduzido, a barra avança em degraus de 1 s.
        const ratio = reducedMotion.matches
          ? Math.floor(clamped / 1000) / (DURATION_MS / 1000)
          : clamped / DURATION_MS;
        fillRef.current.style.transform = `scaleX(${ratio})`;
      }
    };

    const elapsedNow = () => performance.now() - startedAt;

    const loop = () => {
      render(elapsedNow());
      rafId = window.requestAnimationFrame(loop);
    };

    const blockWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) event.preventDefault();
    };
    // Bloqueia só arraste com um dedo; pinça para zoom continua livre.
    const blockTouch = (event: TouchEvent) => {
      if (event.touches.length === 1) event.preventDefault();
    };
    const blockKeys = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      if ((event.key === " " || event.key === "Spacebar") && isInteractive(event.target)) return;
      event.preventDefault();
    };

    // Foco que sai do hero (teclado/leitor de tela) libera a página em vez de
    // deixar o foco preso atrás da camada de abertura.
    const releaseOnFocusAway = (event: FocusEvent) => {
      const el = event.target;
      if (
        !(el instanceof Element) ||
        (hero && hero.contains(el)) ||
        el.closest(".site-header, .skip-link, .intro-overlay")
      ) {
        return;
      }
      release("focus");
    };

    // Ativar âncora interna para fora do hero é navegação explícita: libera.
    const releaseOnAnchor = (event: MouseEvent) => {
      const link =
        event.target instanceof Element &&
        event.target.closest('a[href^="#"]');
      if (!link || !(link instanceof HTMLAnchorElement)) return;
      const target = document.getElementById(
        decodeURIComponent(link.hash.slice(1)),
      );
      if (target && (!hero || !hero.contains(target))) release("anchor");
    };

    const lock = () => {
      root.classList.add("is-scroll-locked");
      window.addEventListener("wheel", blockWheel, { passive: false });
      window.addEventListener("touchmove", blockTouch, { passive: false });
      window.addEventListener("keydown", blockKeys);
      document.addEventListener("focusin", releaseOnFocusAway);
      document.addEventListener("click", releaseOnAnchor, true);
    };

    const unlock = () => {
      root.classList.remove("is-scroll-locked");
      window.removeEventListener("wheel", blockWheel);
      window.removeEventListener("touchmove", blockTouch);
      window.removeEventListener("keydown", blockKeys);
      document.removeEventListener("focusin", releaseOnFocusAway);
      document.removeEventListener("click", releaseOnAnchor, true);
    };

    function release(reason: ReleaseReason) {
      if (released || disposed) return;
      released = true;
      window.cancelAnimationFrame(rafId);
      window.clearInterval(tickId);
      window.clearTimeout(endId);
      render(reason === "end" ? DURATION_MS : elapsedNow());
      unlock();
      setPhase("leaving");
      if (statusRef.current) {
        statusRef.current.textContent =
          "Navegação liberada. Role para continuar a história.";
      }
      leaveId = window.setTimeout(() => {
        if (disposed) return;
        setPhase("revealed");
        if (reason === "skip" || reason === "end") {
          // O botão "assistir novamente" só existe depois da renderização.
          focusId = window.setTimeout(() => {
            if (!disposed) {
              replayRef.current?.focus({ preventScroll: true });
            }
          }, 60);
        }
      }, LEAVE_MS);
    }

    const startOpening = () => {
      released = false;
      window.cancelAnimationFrame(rafId);
      window.clearInterval(tickId);
      window.clearTimeout(endId);
      window.clearTimeout(leaveId);
      window.clearTimeout(focusId);
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      lock();
      startedAt = performance.now();
      render(0);
      setPhase("opening");
      if (statusRef.current) {
        statusRef.current.textContent =
          "Simulação visual de 10 segundos, sem vídeo. A rolagem é liberada ao final ou pelo botão ir para a pagina.";
      }
      if (reducedMotion.matches) {
        tickId = window.setInterval(() => render(elapsedNow()), 250);
      } else {
        rafId = window.requestAnimationFrame(loop);
      }
      endId = window.setTimeout(() => release("end"), DURATION_MS);
      // O botão de pular é o controle principal da camada: recebe o foco.
      // O atraso espera o React montar a camada (no replay ela ainda não existe).
      focusId = window.setTimeout(() => {
        if (!disposed && !released) {
          skipBtnRef.current?.focus({ preventScroll: true });
        }
      }, 60);
    };

    startRef.current = startOpening;
    skipActionRef.current = () => release("skip");

    // Abrir/recarregar com âncora na URL não bloqueia: página liberada,
    // espaço reservado pausado. A liberação nunca é desfeita.
    if (window.location.hash.length > 1) {
      released = true;
      setPhase("revealed");
      if (statusRef.current) {
        statusRef.current.textContent =
          "Simulação pausada. Use assistir novamente para rever a abertura.";
      }
    } else {
      startOpening();
    }

    return () => {
      disposed = true;
      released = true;
      window.cancelAnimationFrame(rafId);
      window.clearInterval(tickId);
      window.clearTimeout(endId);
      window.clearTimeout(leaveId);
      window.clearTimeout(focusId);
      unlock();
    };
    // Executa uma vez por carga da página; replay passa por startOpening via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opening = phase === "opening" || phase === "leaving";

  return (
    <>
      <div
        className="hero-screen"
        data-intro-sim
        role="group"
        aria-label="Espaço reservado para o vídeo de apresentação"
        aria-hidden={opening}
      >
        <div className="screen-vignette" aria-hidden="true"></div>
        <div className="screen-signal" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="screen-caption">
          <span className="caption-line"></span>
          <span>Uma história sobre estar por perto</span>
        </div>
        <p className="screen-placeholder">
          <span className="placeholder-icon" aria-hidden="true">
            ▶
          </span>
          <span>Espaço reservado para o vídeo</span>
        </p>
        <span className="screen-index" aria-hidden="true">
          01 / 06
        </span>
        {phase === "revealed" && (
          <>
            <div className="sim-timer">
              <span className="sim-state">Simulação pausada</span>
              <span className="sim-count">00:10</span>
            </div>
            <div className="sim-progress">
              <span style={{ transform: "scaleX(0)" }}></span>
            </div>
            <button
              className="sim-replay"
              type="button"
              ref={replayRef}
              onClick={() => startRef.current?.()}
            >
              assistir novamente
            </button>
          </>
        )}
      </div>

      <p
        ref={statusRef}
        className="visually-hidden"
        data-sim-status
        aria-live="polite"
      ></p>

      {opening && (
        <div className={`intro-overlay${phase === "leaving" ? " is-leaving" : ""}`}>
          <div
            className="hero-screen intro-foreground"
            role="group"
            aria-label="Abertura: simulação visual do vídeo de apresentação, sem vídeo real"
          >
            <p className="intro-tag" aria-hidden="true">
              Simulação · sem vídeo
            </p>
            <div className="screen-vignette" aria-hidden="true"></div>
            <div className="screen-signal" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="screen-caption">
              <span className="caption-line"></span>
              <span>Uma história sobre estar por perto</span>
            </div>
            <p className="screen-placeholder">
              <span className="placeholder-icon" aria-hidden="true">
                ▶
              </span>
              <span>Espaço reservado para o vídeo</span>
            </p>
            <span className="screen-index" aria-hidden="true">
              01 / 06
            </span>
            <div className="sim-timer">
              <span className="sim-state">Reprodução simulada</span>
              <span className="sim-count" ref={countRef}>
                00:10
              </span>
            </div>
            <div className="sim-progress">
              <span ref={fillRef}></span>
            </div>
            <button
              className="sim-skip"
              type="button"
              ref={skipBtnRef}
              onClick={() => skipActionRef.current?.()}
            >
              ir para a pagina
            </button>
          </div>
        </div>
      )}
    </>
  );
}
