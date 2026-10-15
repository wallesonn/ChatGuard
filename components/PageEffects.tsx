"use client";

/*
 * Efeitos globais da página: barra de progresso de leitura e revelação
 * progressiva das seções durante a rolagem (respeitando movimento reduzido).
 * Conteúdo é estático; aqui só há comportamento visual de client.
 */

import { useEffect } from "react";

export default function PageEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const progress = document.querySelector<HTMLElement>(
      ".reading-progress span",
    );
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let disconnectObserver: (() => void) | null = null;
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      root.classList.add("js-enabled");
      const observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              currentObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -35px 0px" },
      );
      revealItems.forEach((item) => observer.observe(item));
      disconnectObserver = () => observer.disconnect();
    }

    let removeProgress: (() => void) | null = null;
    if (progress) {
      let scheduled = false;
      const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollable > 0 ? window.scrollY / scrollable : 0;
        progress.style.transform = `scaleX(${Math.min(1, Math.max(0, percentage))})`;
        scheduled = false;
      };
      const onScroll = () => {
        if (!scheduled) {
          window.requestAnimationFrame(updateProgress);
          scheduled = true;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", updateProgress, { passive: true });
      updateProgress();
      removeProgress = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", updateProgress);
      };
    }

    return () => {
      disconnectObserver?.();
      removeProgress?.();
    };
  }, []);

  return null;
}
