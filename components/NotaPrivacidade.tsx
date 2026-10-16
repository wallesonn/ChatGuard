"use client";

/**
 * Bloco conceitual de privacidade (docs/landing-page.md, 8.6).
 * Motion Graphics de entrada única (sem loop): cartões abstratos que
 * sobem uma vez e permanecem estáveis. A entrada é one-shot por
 * carregamento de página: quando o bloco entra na viewport pela primeira
 * vez, a animação inicia e o estado "played" fica pegajoso — sair e
 * voltar a rolar nunca a repete. Sem cadeado, selo "protegido", texto
 * virando código ou qualquer fluxo que simule criptografia em operação.
 * Sem JS ou prefers-reduced-motion: estado estático completo.
 * Depois de tocada, o bloco permanece estático mesmo que a preferência
 * de movimento mude — a animação nunca reinicia.
 */

import { useEffect, useRef, useState } from "react";

export default function NotaPrivacidade() {
  const root = useRef<HTMLDivElement | null>(null);
  const [motion, setMotion] = useState<"static" | "play">("static");
  const [inview, setInview] = useState(false);
  // Sticky: uma vez true, nunca volta a false — a animação não repete.
  const played = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => {
      // Antes da primeira entrada: "play" habilita a animação quando ela
      // entrar na viewport; "static" cobre reduced motion. Depois de
      // tocada: sempre "static" — nada reinicia.
      setMotion(!played.current && !reduce.matches ? "play" : "static");
    };
    applyMotion();
    reduce.addEventListener("change", applyMotion);

    let disconnectObserver: (() => void) | null = null;
    if ("IntersectionObserver" in window && root.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || played.current) continue;
            played.current = true;
            setInview(true);
            setMotion(reduce.matches ? "static" : "play");
            // One-shot: para de observar — reentrar na viewport é irrelevante.
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.2 },
      );
      observer.observe(root.current);
      disconnectObserver = () => observer.disconnect();
    } else {
      // Sem IntersectionObserver: sem animação nunca — conteúdo visível
      // e estático, independentemente de prefers-reduced-motion.
      played.current = true;
      setInview(true);
      setMotion("static");
    }

    return () => {
      reduce.removeEventListener("change", applyMotion);
      disconnectObserver?.();
    };
  }, []);

  return (
    <div
      ref={root}
      className="privacy-motion"
      data-motion={motion}
      data-inview={inview ? "true" : "false"}
    >
      <svg
        className="privacy-motion-svg"
        viewBox="0 0 640 170"
        aria-hidden="true"
        focusable="false"
      >
        <rect className="privacy-card" data-card="1" x={30} y={40} width={160} height={90} rx={14} />
        <rect className="privacy-card" data-card="2" x={240} y={40} width={160} height={90} rx={14} />
        <rect className="privacy-card" data-card="3" x={450} y={40} width={160} height={90} rx={14} />
        <line className="privacy-link" x1={190} y1={85} x2={240} y2={85} />
        <line className="privacy-link" x1={400} y1={85} x2={450} y2={85} />
      </svg>
      <span className="privacy-motion-badge">conceito — recurso não implementado</span>
    </div>
  );
}
