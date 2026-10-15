import OpeningVideo from "@/components/OpeningVideo";
import MundoEmMovimento from "@/components/MundoEmMovimento";
import PageEffects from "@/components/PageEffects";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Pular para o conteúdo</a>
      <div className="reading-progress" aria-hidden="true"><span></span></div>
      <PageEffects />

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="ChatGuard — início">
          <svg className="brand-mark" viewBox="0 0 44 48" aria-hidden="true"><path d="M22 2 41 9v13c0 11-7.8 19.2-19 24C10.8 41.2 3 33 3 22V9L22 2Z"/><path d="M12.5 19.5a9.5 9.5 0 0 1 19 0c0 5.3-4.2 9.5-9.5 9.5-1.4 0-2.8-.3-4-.9l-5.5 2 .9-5.1a9.2 9.2 0 0 1-.9-5.5Z"/><circle cx="18.5" cy="19.5" r="1"/><circle cx="22" cy="19.5" r="1"/><circle cx="25.5" cy="19.5" r="1"/></svg>
          <span className="brand-wordmark"><span className="brand-chat">Chat</span><span className="brand-guard">Guard</span></span>
        </a>
        <nav className="primary-nav" aria-label="Navegação principal">
          <a href="#visao">A visão</a>
          <a href="#conceito">Como pensamos</a>
          <a href="#demonstracao">Demonstração</a>
        </nav>
        <button className="header-cta" type="button" disabled title="Ação visual, sem navegação nesta versão">Conheça a proposta</button>
      </header>

      <main id="main">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-backdrop" aria-hidden="true"><div className="hero-glow"></div><div className="hero-grain"></div></div>
          {/* Espaço reservado do vídeo: primeiro elemento do hero, antes do título. */}
          <OpeningVideo />
          <div className="hero-copy" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot"></span> Presença também é proteção</p>
            <h1 id="hero-title">Você sabe com quem seu filho <em>conversa todos os dias?</em></h1>
            <p className="hero-intro">A vida digital cresce depressa. Acompanhar com cuidado começa com contexto, confiança e diálogo.</p>
            <button className="button button-primary" type="button" disabled aria-describedby="waitlist-note-hero">Quero proteger meus filhos</button>
            <p className="button-note" id="waitlist-note-hero">Lista de espera ainda não disponível nesta versão.</p>
          </div>
          <a className="scroll-cue" href="#vida-digital"><span className="scroll-line" aria-hidden="true"></span><span>Continue a história</span><span aria-hidden="true">↓</span></a>
        </section>

        <section className="story-section digital" id="vida-digital" aria-labelledby="digital-title">
          <div className="section-shell digital-layout">
            <div className="section-copy" data-reveal>
              <p className="eyebrow">01 — Um mundo em movimento</p>
              <h2 id="digital-title">Uma vida inteira acontece <em>do outro lado da tela.</em></h2>
              <p>Amizades, conversas, descobertas. O cotidiano digital dos filhos se desdobra em muitas janelas — enquanto a vida real também pede atenção.</p>
            </div>
            {/* Arte aprovada (4:3), agora vetorial e animada: mesmo infográfico
                com logo central, conexões, grupos digitais e rótulos; loop de
                12,8 s que só roda com movimento permitido e na viewport.
                A descrição acessível vive no <title>/<desc> do componente. */}
            <MundoEmMovimento />
          </div>
          <div className="section-footnote"><span>O mundo digital não para.</span><span>Entender o contexto pode aproximar.</span></div>
        </section>

        <section className="statement-section" id="visao" aria-labelledby="statement-title">
          <div className="statement-wash" aria-hidden="true"></div>
          <div className="statement-inner" data-reveal>
            <p className="eyebrow">02 — Menos ruído. Mais contexto.</p>
            <h2 id="statement-title">Você não precisa <span>olhar tudo.</span><br/>Precisa saber <em>onde olhar.</em></h2>
            <p>Uma proposta para ajudar responsáveis a encontrar clareza no meio de tantas interações — sem transformar cuidado em vigilância constante.</p>
          </div>
          <span className="section-number" aria-hidden="true">02</span>
        </section>

        <section className="presence-section" aria-labelledby="presence-title">
          <div className="presence-image">
            {/* Imagem aprovada como referência (ficção editorial; personagens fictícios). */}
            <img className="presence-photo" src="/presenca-dialogo-familiar-01.png" alt="Ilustração editorial fictícia: um adulto escuta com atenção um adolescente que segura um celular, em ambiente doméstico acolhedor." />
          </div>
          <div className="presence-copy" data-reveal>
            <p className="eyebrow">03 — A virada</p>
            <h2 id="presence-title">Não é sobre controlar.<br/><em>É sobre estar presente.</em></h2>
            <p>Acompanhamento transparente pode abrir espaço para conversas melhores. O cuidado começa quando adultos e jovens sabem que estão do mesmo lado.</p>
            <div className="principle"><span className="principle-mark" aria-hidden="true">✳</span><span>Proteção com diálogo.<br/><strong>Confiança com responsabilidade.</strong></span></div>
          </div>
        </section>

        <section className="concept-section" id="conceito" aria-labelledby="concept-title">
          <div className="section-shell">
            <div className="concept-heading" data-reveal>
              <p className="eyebrow">04 — Conheça a proposta</p>
              <h2 id="concept-title"><span className="brand-wordmark"><span className="brand-chat">Chat</span><span className="brand-guard">Guard</span></span>.<br/><em>Uma nova forma de acompanhar.</em></h2>
              <p>Uma visão para reduzir o ruído e colocar o contexto em primeiro lugar. O produto ainda está em desenvolvimento — esta página apresenta apenas o conceito.</p>
            </div>
            <div className="concept-art" data-reveal>
              <div className="concept-halo" aria-hidden="true"></div>
              <div className="concept-card">
                <div className="mock-top"><div className="mock-brand"><span className="mock-shield">C</span> <span className="brand-wordmark"><span className="brand-chat">Chat</span><span className="brand-guard">Guard</span></span></div><span className="mock-status"><i></i> VISÃO CONCEITUAL</span></div>
                <div className="mock-welcome"><div><span className="mock-kicker">UM OLHAR MAIS CLARO</span><h3>O que merece<br/>sua atenção hoje?</h3></div><span className="mock-date">EXEMPLO ILUSTRATIVO</span></div>
                <div className="mock-summary"><div className="summary-block"><span>CONVERSAS</span><strong>12</strong><small>Dados fictícios</small></div><div className="summary-block"><span>CONTATOS</span><strong>08</strong><small>Dados fictícios</small></div><div className="summary-block summary-focus"><span>PARA CONVERSAR</span><strong>02</strong><small>Não é uma conclusão</small></div></div>
                <div className="mock-message"><div className="mock-avatar">L</div><div className="mock-message-copy"><strong>Lucas M. <span>• exemplo fictício</span></strong><p>“A gente conversa amanhã na escola?”</p><small>Mensagem ilustrativa · contexto importa</small></div></div>
                <div className="mock-message"><div className="mock-avatar avatar-alt">M</div><div className="mock-message-copy"><strong>Marina R. <span>• exemplo fictício</span></strong><p>“Obrigada por me ajudar com o trabalho!”</p><small>Mensagem ilustrativa · contexto importa</small></div></div>
                <div className="mock-disclaimer">Representação visual conceitual. Nenhuma conversa está sendo analisada.</div>
              </div>
              <div className="floating-note note-context"><span className="note-icon">✳</span><span><b>Contexto antes</b><small>de qualquer conclusão</small></span></div>
              <div className="floating-note note-quiet"><span className="quiet-wave" aria-hidden="true">≈</span><span><b>Menos ruído</b><small>mais clareza</small></span></div>
            </div>
          </div>
        </section>

        <section className="signals-section" aria-labelledby="signals-title">
          <div className="section-shell">
            <div className="signals-heading" data-reveal>
              <p className="eyebrow">05 — Sinais, não sentenças</p>
              <h2 id="signals-title">Uma indicação não conta<br/><em>a história inteira.</em></h2>
              <p>Na visão futura do <span className="brand-wordmark"><span className="brand-chat">Chat</span><span className="brand-guard">Guard</span></span>, diferentes níveis de atenção ajudariam a organizar conversas. Uma classificação jamais substitui contexto, diálogo ou avaliação humana.</p>
            </div>
            <div className="signals-grid" data-reveal>
              <article className="signal-card"><span className="signal-label"><i className="signal-dot green"></i> GREEN</span><h3>Sem atenção especial</h3><p>Nenhum sinal para destacar neste exemplo fictício.</p><span className="signal-foot">Demonstração conceitual</span></article>
              <article className="signal-card"><span className="signal-label"><i className="signal-dot yellow"></i> YELLOW</span><h3>Vale compreender</h3><p>Um sinal pode ser um convite para conversar e entender melhor.</p><span className="signal-foot">Demonstração conceitual</span></article>
              <article className="signal-card"><span className="signal-label"><i className="signal-dot red"></i> RED</span><h3>Prioridade de atenção</h3><p>Um alerta não é prova. O contexto continua sendo essencial.</p><span className="signal-foot">Demonstração conceitual</span></article>
            </div>
            <p className="signals-note"><span aria-hidden="true">ⓘ</span> As cores e exemplos acima são ilustrativos. Nesta versão não existe análise real, inteligência artificial ou classificação funcional.</p>
          </div>
        </section>

        <section className="pillars-section" aria-labelledby="pillars-title">
          <div className="section-shell pillars-layout">
            <div className="pillars-intro" data-reveal><p className="eyebrow">06 — O que importa</p><h2 id="pillars-title">Tecnologia a serviço<br/><em>da proximidade.</em></h2><p>Uma visão de produto orientada por princípios, não por mais notificações.</p></div>
            <div className="pillars-list" data-reveal>
              <article className="pillar"><span>01</span><div><h3>Conversas</h3><p>Uma visão organizada das interações.</p></div></article>
              <article className="pillar"><span>02</span><div><h3>Contatos</h3><p>Compreender relações com cuidado.</p></div></article>
              <article className="pillar"><span>03</span><div><h3>Alertas</h3><p>Sinais para apoiar atenção consciente.</p></div></article>
              <article className="pillar"><span>04</span><div><h3>Inteligência e contexto</h3><p>Uma visão futura, sempre com avaliação humana.</p></div></article>
            </div>
            <p className="pillars-disclaimer">Conceitos de uma plataforma futura. Nenhum destes recursos está funcional nesta página.</p>
          </div>
        </section>

        <section className="demo-section" id="demonstracao" aria-labelledby="demo-title">
          <div className="section-shell demo-layout">
            <div className="demo-copy" data-reveal><p className="eyebrow">07 — Uma ideia em imagens</p><h2 id="demo-title">Veja o conceito.<br/><em>Imagine a conversa.</em></h2><p>Este cenário usa nomes e mensagens inventados para ilustrar como uma interface futura poderia apresentar um sinal com contexto.</p><span className="demo-badge"><i></i> SIMULAÇÃO VISUAL · DADOS FICTÍCIOS</span></div>
            <div className="chat-demo" data-reveal role="group" aria-label="Simulação visual fictícia de uma conversa, sem processamento real">
              <div className="chat-head"><div className="demo-avatar">A</div><div><strong>Alex S. <span>exemplo fictício</span></strong><small>Contato ilustrativo · sem conexão</small></div></div>
              <div className="context-banner"><span className="context-symbol">i</span><span><strong>Sinal ilustrativo</strong><small>Um ponto de partida para compreender o contexto.</small></span><span className="context-tag">AMARELO</span></div>
              <div className="chat-date">EXEMPLO DE CONVERSA FICTÍCIA</div>
              <div className="chat-bubble bubble-in">Oi! Você vai participar do grupo do projeto?<time>16:42</time></div>
              <div className="chat-bubble bubble-out">Vou sim, ainda estou vendo os detalhes. 🙂<time>16:45</time></div>
              <div className="chat-bubble bubble-in">Tudo bem. A gente conversa amanhã na escola.<time>16:47</time></div>
              <div className="chat-context-note"><span aria-hidden="true">✳</span> Uma classificação não é conclusão. Conhecer o contexto vem primeiro.</div>
              <div className="chat-footer">Demonstração estática · mensagens inventadas · sem integração</div>
            </div>
          </div>
        </section>

        <section className="closing-section" id="mensagem-final" aria-labelledby="closing-title">
          <div className="closing-glow" aria-hidden="true"></div>
          <div className="closing-content" data-reveal><p className="eyebrow">Menos ruído. Mais contexto.</p><h2 id="closing-title">Proteção também<br/><em>é presença.</em></h2><p>Uma proposta para acompanhar com responsabilidade, ouvir com atenção e permanecer por perto.</p><button className="button button-primary" type="button" disabled aria-describedby="waitlist-note-final">Quero proteger meus filhos</button><p className="button-note" id="waitlist-note-final">Lista de espera ainda não disponível nesta versão.</p></div>
          <div className="closing-orbit" aria-hidden="true"></div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio" aria-label="ChatGuard — voltar ao início"><svg className="brand-mark" viewBox="0 0 44 48" aria-hidden="true"><path d="M22 2 41 9v13c0 11-7.8 19.2-19 24C10.8 41.2 3 33 3 22V9L22 2Z"/><path d="M12.5 19.5a9.5 9.5 0 0 1 19 0c0 5.3-4.2 9.5-9.5 9.5-1.4 0-2.8-.3-4-.9l-5.5 2 .9-5.1a9.2 9.2 0 0 1-.9-5.5Z"/><circle cx="18.5" cy="19.5" r="1"/><circle cx="22" cy="19.5" r="1"/><circle cx="25.5" cy="19.5" r="1"/></svg><span className="brand-wordmark"><span className="brand-chat">Chat</span><span className="brand-guard">Guard</span></span></a>
        <p>Menos ruído. Mais contexto.</p>
        <span className="footer-note">Apresentação conceitual · v0.2 · sem funcionalidades operacionais</span>
        <a className="back-top" href="#inicio">Voltar ao início <span aria-hidden="true">↑</span></a>
      </footer>
    </>
  );
}
