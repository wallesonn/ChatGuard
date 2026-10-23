import {
  PRIVACY_NOTICE_UPDATED_AT,
  PRIVACY_NOTICE_VERSION,
} from "@/components/privacy-notice-version";

export const metadata = {
  title: "Aviso de Privacidade — HeroGuard",
  description:
    "Aviso de privacidade da lista de espera do HeroGuard e informações sobre o tratamento de dados pessoais.",
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <article className="privacy-document">
        <a className="privacy-back" href="/">
          ← Voltar ao HeroGuard
        </a>
        <p className="privacy-eyebrow">HeroGuard · Lista de espera</p>
        <h1>Aviso de Privacidade</h1>
        <p className="privacy-updated">
          Versão {PRIVACY_NOTICE_VERSION} · Atualizado em{" "}
          {PRIVACY_NOTICE_UPDATED_AT}
        </p>

        <aside className="privacy-test-notice">
          <strong>Formulário em modo de teste.</strong> Nesta versão, os dados
          digitados não são enviados nem armazenados. Este aviso descreve o
          tratamento planejado para quando a lista de espera for ativada. A
          análise de conversas também não está implementada: nenhuma conversa
          real é coletada ou enviada para processamento.
        </aside>

        <section>
          <h2>1. Quem é responsável pelos dados</h2>
          <p>
            O responsável pelo HeroGuard e controlador dos dados pessoais da
            lista de espera é Walleson Nonato de Sousa Ferreira. Para dúvidas
            ou solicitações relacionadas a privacidade, escreva para{" "}
            <a href="mailto:walesonnn@gmail.com">walesonnn@gmail.com</a>.
            Atualmente, não há encarregado de dados formalmente nomeado.
          </p>
        </section>

        <section>
          <h2>2. Quem pode se cadastrar e quais dados são solicitados</h2>
          <p>
            A lista é destinada somente a pessoas adultas responsáveis por
            crianças ou adolescentes. O formulário solicita o nome, o e-mail e
            o telefone com WhatsApp do próprio responsável. O e-mail será usado
            como identificador do cadastro e para evitar duplicidades; não será
            usado para enviar mensagens. Não solicitamos dados das crianças ou
            adolescentes.
          </p>
        </section>

        <section>
          <h2>3. Finalidade e base legal</h2>
          <p>
            Com o consentimento da pessoa cadastrada, os dados serão usados
            para registrar o interesse na lista de espera e enviar, somente
            pelo WhatsApp, os próximos passos para conhecer o HeroGuard. Não
            serão usados para publicidade ou mensagens promocionais. O
            tratamento do cadastro terá como base legal o consentimento, nos
            termos da LGPD.
          </p>
        </section>

        <section>
          <h2>4. Onde e com quem os dados poderão ser compartilhados</h2>
          <p>
            A aplicação e o n8n serão hospedados na VPS da Hostinger, em
            servidor no Brasil. O n8n será usado para automatizar o envio dos
            próximos passos. Para entregar as mensagens, o telefone e os dados
            necessários ao envio serão encaminhados à Uazapi, fornecedora
            externa hospedada pela própria Uazapi.
          </p>
          <p>
            A localização dos sistemas da Uazapi, seus eventuais
            suboperadores e a possibilidade de tratamento internacional devem
            ser confirmadas na documentação e nas condições do fornecedor
            antes da ativação da coleta real. Se houver transferência
            internacional, as informações e garantias aplicáveis serão
            incluídas nesta página antes do início desse tratamento.
          </p>
        </section>

        <section>
          <h2>5. Análise de conversas — funcionalidade futura</h2>
          <p>
            A análise de mensagens de WhatsApp não está implementada. Hoje, o
            HeroGuard não coleta conversas reais nem as envia à Uazapi, ao n8n
            ou a um modelo de inteligência artificial. A arquitetura
            considerada para uma versão futura é Uazapi → n8n → API externa de
            inteligência artificial. O provedor do modelo ainda não foi
            definido.
          </p>
          <p>
            O consentimento da lista de espera não autoriza a coleta ou análise
            de conversas. Antes de disponibilizar essa funcionalidade, será
            necessário publicar informações específicas sobre os dados
            processados, fornecedores, localização e transferência de dados,
            retenção, finalidade e salvaguardas, além de obter as autorizações
            aplicáveis.
          </p>
        </section>

        <section>
          <h2>6. Retenção e exclusão</h2>
          <p>
            Os dados da lista de espera serão mantidos até que a pessoa retire
            o consentimento ou solicite a exclusão, salvo quando a conservação
            for necessária para cumprir obrigação legal. Registros técnicos de
            acesso ao servidor, que podem conter endereço IP, serão eliminados
            quando tiverem mais de seis meses.
          </p>
        </section>

        <section>
          <h2>7. Registros técnicos e cookies</h2>
          <p>
            A aplicação não utiliza ferramentas de analytics nem cookies de
            rastreamento. Para operação e segurança, a infraestrutura do
            servidor pode gerar registros técnicos de acesso, incluindo
            endereço IP, com a retenção descrita acima.
          </p>
        </section>

        <section>
          <h2>8. Seus direitos</h2>
          <p>
            Você pode solicitar confirmação da existência de tratamento,
            acesso aos dados, correção de dados incompletos ou incorretos,
            informações sobre compartilhamento, exclusão quando aplicável e
            revogação do consentimento. Para exercer esses direitos, escreva
            para{" "}
            <a href="mailto:walesonnn@gmail.com">walesonnn@gmail.com</a>.
            A retirada do consentimento não afeta o tratamento realizado
            anteriormente, e a exclusão poderá estar sujeita às hipóteses
            legais de conservação.
          </p>
        </section>

        <section>
          <h2>9. Segurança</h2>
          <p>
            São previstas medidas técnicas e administrativas razoáveis para
            proteger os dados contra acesso não autorizado, perda ou alteração.
            Nenhuma transmissão ou armazenamento na internet pode ser
            considerado absolutamente seguro.
          </p>
        </section>

        <section>
          <h2>10. Alterações neste aviso</h2>
          <p>
            Este aviso poderá ser atualizado se o funcionamento da lista ou os
            serviços utilizados mudarem. A versão vigente ficará disponível
            nesta página.
          </p>
        </section>
      </article>
    </main>
  );
}
