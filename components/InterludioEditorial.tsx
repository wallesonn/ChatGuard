"use client";

/**
 * Interlúdio editorial — caso noticiado (docs/landing-page.md, 8.4).
 * Bloco editorial, não é demonstração do produto nem CTA.
 * Motion Graphics de entrada única (sem loop): três cartões abstratos
 * que sobem uma vez e permanecem estáveis. A entrada é one-shot por
 * carregamento de página: quando o bloco entra na viewport pela primeira
 * vez, a animação inicia e o estado "played" fica pegajoso — sair e
 * voltar a rolar nunca a repete. Sem mapa, rota, flashes, personagens,
 * mensagens reconstituídas ou identificação da adolescente.
 * Sem JS ou prefers-reduced-motion: estado estático completo (a animação
 * só é aplicada com data-motion="play"; o estado-base é o estado final).
 * Depois de tocada, o bloco permanece estático mesmo que a preferência
 * de movimento mude — a animação nunca reinicia.
 */

import { useEffect, useRef, useState } from "react";

const steps = [
  { id: "caso-passo-1", label: "Contato online conhecido pela família" },
  { id: "caso-passo-2", label: "Viagem sozinha a Portugal" },
  { id: "caso-passo-3", label: "Localizada em segurança; investigação em curso" },
];

export default function InterludioEditorial() {
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
      className="editorial-motion"
      data-motion={motion}
      data-inview={inview ? "true" : "false"}
    >
      <svg
        className="editorial-motion-svg"
        viewBox="0 0 720 150"
        aria-hidden="true"
        focusable="false"
      >
        {steps.map((step, index) => (
          <g key={step.id} className="editorial-step" data-step={index + 1}>
            <rect className="editorial-card" x={30 + index * 240} y={35} width={180} height={80} rx={14} />
            {index < steps.length - 1 && (
              <line
                className="editorial-link"
                x1={30 + index * 240 + 180}
                y1={75}
                x2={30 + (index + 1) * 240}
                y2={75}
              />
            )}
          </g>
        ))}
      </svg>
      <ul className="editorial-steps-list">
        {steps.map((step) => (
          <li key={step.id}>{step.label}</li>
        ))}
      </ul>
    </div>
  );
}
