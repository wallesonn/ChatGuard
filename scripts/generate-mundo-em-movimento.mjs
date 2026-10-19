/*
 * Gera o componente animado do infográfico "Um mundo em movimento" a partir
 * do SVG-mestre aprovado (public/mundo-em-movimento-vetor-master-01.svg).
 *
 * Saídas:
 *   - components/MundoEmMovimento.tsx  (SVG inline em JSX, grupos internos animáveis)
 *   - app/mundo-em-movimento.css       (loop de 6,4 s em CSS puro, sincronizado)
 *
 * Princípios (parecer de motion aprovado):
 *   - fundo (#fundo) nunca anima; sem filtros/blur/flash; movimento suave;
 *   - grupos com transform autoral recebem wrapper <g data-mmv-w="id"> — o CSS
 *     anima o wrapper, preservando o transform authorado do grupo interno;
 *   - um só relógio: todos os keyframes têm duração de 6,4 s, então entrada,
 *     conexões, logo, pausa narrativa e reinício ficam sempre em fase;
 *   - sem atributo data-motion="play" no raiz, a composição fica completa e
 *     estática (sem JS, prefers-reduced-motion ou pré-hidratação).
 *
 * Uso: node scripts/generate-mundo-em-movimento.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const MASTER = join(repoRoot, "public/mundo-em-movimento-vetor-master-01.svg");
const OUT_TSX = join(repoRoot, "components/MundoEmMovimento.tsx");
const OUT_CSS = join(repoRoot, "app/mundo-em-movimento.css");

const svg = readFileSync(MASTER, "utf8");

/* ---------- extração do corpo e da raiz ---------- */
const openTagEnd = svg.indexOf(">", svg.indexOf("<svg"));
const closeTag = svg.lastIndexOf("</svg>");
const guts = svg.slice(openTagEnd + 1, closeTag);

/* ---------- grupos com transform autoral -> wrapper externo ---------- */
const WRAP = new Set([
  "logo-mark",
  "avatar-conversas-oi",
  "avatar-conversas-vamos",
  "avatar-audio-teal",
  "avatar-audio-gold",
  "avatar-audio-sage",
  "paisagem-cartao",
  "musica-cartao",
  "pintura-cartao",
  "avatar-cotidiano-teal",
  "avatar-cotidiano-gold",
  "avatar-cotidiano-sage",
]);

/* balões com microflutuação discreta durante a pausa narrativa */
const FLOAT = new Set(["balao-vamos", "balao-dia"]);

/* ---------- timeline (segundos; ciclo de 6,4 s) ---------- */
const CYCLE = 6.4;
const ENTRANCE = 0.22; // duração de cada entrada (rise + fade)
const HOLD_END = 5.75; // fim da pausa narrativa
const FADE_END = 6.2; // fim do cross-fade de saída
const RISE = 16; // deslocamento de entrada em unidades do viewBox
const CONNECTOR_DRAWS = [
  { id: "conector-conversas", start: 3.45, len: 141 },
  { id: "conector-audio", start: 3.62, len: 119 },
  { id: "conector-criatividade", start: 3.8, len: 81 },
  { id: "conector-cotidiano", start: 3.98, len: 92 },
];
const CLUSTERS = [
  {
    base: 0.15, step: 0.09,
    ids: ["conversas-cartao-fundo", "conversas-cartao-oi", "avatar-conversas-oi", "balao-oi",
      "conversas-cartao-vamos", "balao-vamos", "avatar-conversas-vamos", "conversas-tracos"],
  },
  {
    base: 0.95, step: 0.09,
    ids: ["audio-cartao-amigos", "avatar-audio-teal", "avatar-audio-gold", "avatar-audio-sage",
      "audio-painel", "audio-play", "audio-ondas", "balao-bora", "audio-tracos"],
  },
  {
    base: 1.8, step: 0.1,
    ids: ["criatividade-cartao-fundo", "paisagem-cartao", "musica-cartao", "pintura-cartao",
      "balao-musica", "criatividade-tracos"],
  },
  {
    base: 2.45, step: 0.09,
    ids: ["casa-cartao", "casa-cena", "avatar-cotidiano-teal", "avatar-cotidiano-gold",
      "avatar-cotidiano-sage", "balao-dia", "balao-tudo", "cotidiano-tracos"],
  },
];
const LOGO = { mark: 4.6, word: 4.78 };

const pct = (s) => Number(((s / CYCLE) * 100).toFixed(2));
const P = { holdEnd: pct(HOLD_END), fadeEnd: pct(FADE_END), fadeStart: pct(HOLD_END) };

/* ---------- inserção dos wrappers ---------- */
// Encontra, na string dada, o índice do </g> que fecha o grupo aberto em startTagIdx.
function findGroupEnd(str, startTagIdx) {
  const re = /<g\b[^>]*?\/?>|<\/g>/g;
  re.lastIndex = startTagIdx;
  let depth = 0;
  for (const m of str.matchAll(re)) {
    if (m.index < startTagIdx) continue;
    if (m[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) return m.index + m[0].length;
    } else if (!m[0].endsWith("/>")) {
      depth += 1;
    }
  }
  throw new Error("fecho do grupo não encontrado");
}

/* O wrapping e a conversão operam sobre o CORPO interno (guts): o prolog XML
 * e a tag <svg> raiz não entram no componente — a raiz é recriada em JSX. */
let wrapped = guts;
for (const id of WRAP) {
  const idAt = wrapped.indexOf(`id="${id}"`);
  if (idAt === -1) throw new Error(`id não encontrado no mestre: ${id}`);
  const tagStart = wrapped.lastIndexOf("<g", idAt);
  const end = findGroupEnd(wrapped, tagStart);
  const open = `<g data-mmv-w="${id}">`;
  const close = "</g>";
  wrapped = wrapped.slice(0, tagStart) + open + wrapped.slice(tagStart, end) + close + wrapped.slice(end);
}

/* ---------- conversão para JSX ---------- */
if (guts.includes("&") || /<!--/.test(guts)) throw new Error("conteúdo requer escape manual");
const renamed = wrapped.replace(/<[^>]+>/g, (tag) =>
  tag
    .replace(/ xml:lang="[^"]*"/g, "")
    .replace(/([a-zA-Z][a-zA-Z0-9]*(?:-[a-zA-Z][a-zA-Z0-9]*)*)="([^"]*)"/g, (m, name, val) => {
      if (!name.includes("-")) return m;
      if (name.startsWith("data-") || name.startsWith("aria-")) return m;
      const camel = name.replace(/-([a-zA-Z])/g, (_, c) => c.toUpperCase());
      return `${camel}="${val}"`;
    })
    .replace(/\s+>/g, ">")
    .replace(/<g /, "<g ")
);

/* ---------- CSS ---------- */
function itemKeyframes(id, startS) {
  const s = pct(startS);
  const e = Number((pct(startS + ENTRANCE)).toFixed(2));
  const sel = WRAP.has(id) ? `[data-mmv-w="${id}"]` : `#${id}`;
  const lines = [];
  if (FLOAT.has(id)) {
    // opacidade e transform em keyframes separados (a flutuação é contínua)
    lines.push(
      `.mmv[data-motion="play"] ${sel} {`,
      `  animation: mmv-in-${id} ${CYCLE}s infinite, mmv-float-${id} ${CYCLE}s infinite;`,
      `}`,
      `@keyframes mmv-in-${id} {`,
      `  0%, ${s}% { opacity: 0; }`,
      `  ${e}% { opacity: 1; }`,
      `  ${P.holdEnd}% { opacity: 1; }`,
      `  ${P.fadeEnd}%, 100% { opacity: 0; }`,
      `}`,
      `@keyframes mmv-float-${id} {`,
      `  0%, ${s}% { transform: translateY(var(--mmv-rise)); }`,
      `  ${e}% { transform: translateY(0); }`,
      `  70% { transform: translateY(0); }`,
      `  74% { transform: translateY(calc(var(--mmv-float) * -1)); }`,
      `  78% { transform: translateY(0); }`,
      `  82% { transform: translateY(calc(var(--mmv-float) * -1)); }`,
      `  86%, 100% { transform: translateY(0); }`,
      `}`,
    );
  } else {
    lines.push(
      `.mmv[data-motion="play"] ${sel} {`,
      `  animation: mmv-in-${id} ${CYCLE}s infinite;`,
      `}`,
      `@keyframes mmv-in-${id} {`,
      `  0%, ${s}% { opacity: 0; transform: translateY(var(--mmv-rise)); }`,
      `  ${e}% { opacity: 1; transform: translateY(0); }`,
      `  ${P.holdEnd}% { opacity: 1; transform: translateY(0); }`,
      `  ${P.fadeEnd}%, 100% { opacity: 0; transform: translateY(0); }`,
      `}`,
    );
  }
  return lines.join("\n");
}

function connectorCss(c) {
  const s = pct(c.start);
  const e = pct(c.start + 0.85);
  return [
    `.mmv[data-motion="play"] #${c.id} path {`,
    `  stroke-dasharray: ${c.len};`,
    `  animation: mmv-draw-${c.id} ${CYCLE}s infinite;`,
    `}`,
    `@keyframes mmv-draw-${c.id} {`,
    `  0%, ${s}% { stroke-dashoffset: ${c.len}; opacity: 1; }`,
    `  ${e}% { stroke-dashoffset: 0; opacity: 1; }`,
    `  ${P.holdEnd}% { stroke-dashoffset: 0; opacity: 1; }`,
    `  ${P.fadeEnd}%, 100% { stroke-dashoffset: 0; opacity: 0; }`,
    `}`,
  ].join("\n");
}

function logoCss(id, sel, startS, rise) {
  const s = pct(startS);
  const e = pct(startS + 0.9);
  return [
    `.mmv[data-motion="play"] ${sel} {`,
    `  animation: mmv-in-${id} ${CYCLE}s infinite;`,
    `}`,
    `@keyframes mmv-in-${id} {`,
    `  0%, ${s}% { opacity: 0; transform: translateY(${rise}px); }`,
    `  ${e}% { opacity: 1; transform: translateY(0); }`,
    `  ${P.holdEnd}% { opacity: 1; transform: translateY(0); }`,
    `  ${P.fadeEnd}%, 100% { opacity: 0; transform: translateY(0); }`,
    `}`,
  ].join("\n");
}

const cssParts = [
  `/* ============================================================
 * Infográfico animado "Um mundo em movimento" — seção 01 (#vida-digital)
 * GERADO por scripts/generate-mundo-em-movimento.mjs a partir do SVG-mestre
 * aprovado (public/mundo-em-movimento-vetor-master-01.svg).
 * Não editar à mão: regenerar. Um único relógio de ${CYCLE.toFixed(1)} s mantém
 * entradas, conexões, logo, pausa narrativa e reinício sempre em fase.
 * Sem .mmv[data-motion="play"]: composição completa estática (sem JS,
 * prefers-reduced-motion ou pré-hidratação). O fundo (#fundo) nunca anima.
 * ============================================================ */

.mmv {
  --mmv-rise: ${RISE}px;
  --mmv-float: 2px;
}

.mmv-svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* Fora da viewport: o loop inteiro fica pausado e retoma do mesmo ponto. */
.mmv[data-motion="play"][data-inview="false"] .mmv-svg * {
  animation-play-state: paused !important;
}

@media (max-width: 650px) {
  .mmv {
    --mmv-rise: 8px; /* mobile: menos movimento decorativo */
    --mmv-float: 1px;
  }
}
`,
];
for (const cluster of CLUSTERS) {
  cluster.ids.forEach((id, i) => cssParts.push(itemKeyframes(id, cluster.base + i * cluster.step)));
}
for (const c of CONNECTOR_DRAWS) cssParts.push(connectorCss(c));
cssParts.push(logoCss("logo-mark", '[data-mmv-w="logo-mark"]', LOGO.mark, 20));
cssParts.push(logoCss("logo-wordmark", "#logo-wordmark", LOGO.word, 10));

writeFileSync(OUT_CSS, cssParts.join("\n") + "\n", "utf8");

/* ---------- TSX ---------- */
const tsx = `"use client";

/**
 * GERADO POR scripts/generate-mundo-em-movimento.mjs — não editar os grupos
 * internos à mão: regenere a partir do SVG-mestre aprovado
 * (public/mundo-em-movimento-vetor-master-01.svg, 4:3 — 1448×1086).
 *
 * Infográfico vetorial inline da seção 01 (#vida-digital): os grupos internos
 * ficam acessíveis a CSS/React (IDs e transforms autorais preservados; grupos
 * com transform autoral recebem wrapper <g data-mmv-w="...">).
 * A animação (loop de ${CYCLE.toFixed(1)} s em CSS puro) vive em
 * app/mundo-em-movimento.css; este componente só controla os estados:
 *   - prefers-reduced-motion: reduce (ou sem JS) -> composição estática completa;
 *   - loop ativo somente com movimento permitido; IntersectionObserver pausa
 *     fora da viewport e retoma do mesmo ponto ao voltar.
 */
import { useEffect, useRef, useState } from "react";

const art = (
  <>
${renamed.replace(/^/gm, "    ")}
  </>
);

export default function MundoEmMovimento() {
  const root = useRef<HTMLDivElement | null>(null);
  const [motion, setMotion] = useState<"static" | "play">("static");
  const [inview, setInview] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => setMotion(reduce.matches ? "static" : "play");
    applyMotion();
    reduce.addEventListener("change", applyMotion);

    let disconnectObserver: (() => void) | null = null;
    if ("IntersectionObserver" in window && root.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) setInview(entry.isIntersecting);
        },
        { threshold: 0.15 },
      );
      observer.observe(root.current);
      disconnectObserver = () => observer.disconnect();
    }

    return () => {
      reduce.removeEventListener("change", applyMotion);
      disconnectObserver?.();
    };
  }, []);

  return (
    <div
      ref={root}
      className="digital-art mmv"
      data-motion={motion}
      data-inview={inview ? "true" : "false"}
      data-reveal
    >
      <svg
        className="mmv-svg"
        viewBox="0 0 1448 1086"
        role="img"
        aria-labelledby="arte-title arte-desc"
        focusable="false"
      >
        {art}
      </svg>
    </div>
  );
}
`;

writeFileSync(OUT_TSX, tsx, "utf8");
console.log("gerado:", OUT_TSX);
console.log("gerado:", OUT_CSS);
console.log("wrappers inseridos:", WRAP.size, "| itens:", CLUSTERS.reduce((n, c) => n + c.ids.length, 0), "| conectores:", CONNECTOR_DRAWS.length);
