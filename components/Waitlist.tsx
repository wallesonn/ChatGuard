"use client";

/*
 * Lista de espera — modal de cadastro acionado pelos CTAs da página
 * (header, hero e mensagem final). Versão de TESTE: nenhum dado é enviado
 * ou armazenado; "Enviar" apenas apresenta a confirmação do fluxo.
 * Integrações reais (armazenamento e mensagem de WhatsApp) serão feitas
 * em versão futura, fora do escopo estático atual.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { PRIVACY_NOTICE_VERSION } from "./privacy-notice-version";

type OpenWaitlist = (trigger: HTMLElement | null) => void;

const WaitlistContext = createContext<OpenWaitlist>(() => {});

export function WaitlistButton({
  className,
  children,
  describedBy,
}: {
  className?: string;
  children: ReactNode;
  describedBy?: string;
}) {
  const openWaitlist = useContext(WaitlistContext);
  return (
    <button
      type="button"
      className={className}
      aria-describedby={describedBy}
      onClick={(event) => openWaitlist(event.currentTarget)}
    >
      {children}
    </button>
  );
}

const PHONE_MIN_DIGITS = 10;

/* Máscara brasileira: (11) 91234-5678 ou (11) 3456-7890. */
function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function WaitlistProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const consentRef = useRef<HTMLInputElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const close = () => {
    setOpen(false);
    setSent(false);
    setConsent(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  const openWaitlist: OpenWaitlist = (trigger) => {
    triggerRef.current = trigger;
    setError("");
    setSent(false);
    setConsent(false);
    setOpen(true);
  };

  /* Bloqueia a rolagem e leva o foco ao primeiro controle (ou ao botão
     "Fechar", na confirmação) enquanto o diálogo estiver aberto. */
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("is-waitlist-open");
    const focusTimer = window.setTimeout(() => {
      const focusTarget = sent ? closeRef.current : nameRef.current;
      focusTarget?.focus({ preventScroll: true });
    }, 40);
    return () => {
      window.clearTimeout(focusTimer);
      document.documentElement.classList.remove("is-waitlist-open");
    };
  }, [open, sent]);

  /* ESC fecha o diálogo; Tab permanece dentro dele — o foco não foge
     para a página escurecida ao fundo. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.getClientRects().length > 0);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // O diálogo é a única interação ativa enquanto aberto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Informe seu nome para continuar.");
      nameRef.current?.focus({ preventScroll: true });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Informe um e-mail válido.");
      emailRef.current?.focus({ preventScroll: true });
      return;
    }
    if (phone.replace(/\D/g, "").length < PHONE_MIN_DIGITS) {
      setError("Informe um telefone válido com DDD, por exemplo: (11) 91234-5678.");
      phoneRef.current?.focus({ preventScroll: true });
      return;
    }
    if (!consent) {
      setError("É necessário aceitar o aviso de privacidade para continuar.");
      consentRef.current?.focus({ preventScroll: true });
      return;
    }
    setError("");
    setSent(true);
    /* Teste: nada é enviado — a confirmação apenas simula o fluxo futuro. */
  };

  return (
    <WaitlistContext.Provider value={openWaitlist}>
      {children}

      {open && (
        <div
          className="waitlist-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            className="waitlist-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-title"
            ref={dialogRef}
          >
            <button
              className="waitlist-close"
              type="button"
              aria-label="Fechar cadastro"
              onClick={close}
            >
              ✕
            </button>

            <img
              className="waitlist-logo"
              src="/heroguard-logo-alpha.png"
              alt="HeroGuard"
              width={924}
              height={939}
            />

            {sent ? (
              <div className="waitlist-success">
                <span className="waitlist-success-icon" aria-hidden="true">✓</span>
                <h3 id="waitlist-title">Simulação concluída</h3>
                <p>
                  Este formulário é apenas demonstrativo. Seus dados não foram
                  enviados nem armazenados. Na versão real, os próximos passos
                  serão enviados pelo WhatsApp.
                </p>
                <button className="waitlist-submit" type="button" ref={closeRef} onClick={close}>
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <h3 id="waitlist-title">Vamos começar</h3>
                <p className="waitlist-intro">
                  Informe seus dados para registrar seu interesse. Os próximos
                  passos serão enviados somente pelo WhatsApp.
                </p>

                <div className="waitlist-field">
                  <label htmlFor="waitlist-name">Seu nome</label>
                  <input
                    id="waitlist-name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    required
                    placeholder="Ex.: Ana Silva"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>

                <div className="waitlist-field">
                  <label htmlFor="waitlist-email">E-mail</label>
                  <span className="waitlist-field-hint">
                    Usado como identificador do cadastro; não enviaremos
                    mensagens por e-mail.
                  </span>
                  <input
                    id="waitlist-email"
                    ref={emailRef}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="waitlist-field">
                  <label htmlFor="waitlist-phone">Telefone (WhatsApp)</label>
                  <input
                    id="waitlist-phone"
                    ref={phoneRef}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="(11) 91234-5678"
                    value={phone}
                    onChange={(event) => setPhone(maskPhone(event.target.value))}
                  />
                </div>

                <div className="waitlist-consent">
                  <input
                    id="waitlist-consent"
                    ref={consentRef}
                    type="checkbox"
                    checked={consent}
                    required
                    onChange={(event) => setConsent(event.target.checked)}
                    aria-describedby="waitlist-consent-copy"
                  />
                  <label htmlFor="waitlist-consent">
                    Li o Aviso de Privacidade (versão{" "}
                    {PRIVACY_NOTICE_VERSION}) e autorizo o uso dos meus dados
                    para este cadastro e para receber os próximos passos pelo
                    WhatsApp.
                  </label>
                </div>
                <p className="waitlist-consent-copy" id="waitlist-consent-copy">
                  <a href="/privacidade" target="_blank" rel="noreferrer">
                    Leia o aviso completo (versão {PRIVACY_NOTICE_VERSION})
                  </a>
                  . Você pode retirar seu consentimento pelo contato indicado
                  no aviso. Esta versão de teste não envia nem armazena os
                  dados.
                </p>

                {error && (
                  <p className="waitlist-error" role="alert">
                    {error}
                  </p>
                )}

                <button className="waitlist-submit" type="submit">Enviar</button>
              </form>
            )}
          </div>
        </div>
      )}
    </WaitlistContext.Provider>
  );
}
