# HeroGuard — App

Landing page institucional do **HeroGuard** — plataforma de inteligência e
proteção digital para pais e responsáveis ("Menos ruído. Mais contexto.").

**Status:** v0.2 em produção — <https://chatguard.life>

> **Marca e infraestrutura:** o produto passou a se chamar **HeroGuard**. Os
> identificadores técnicos publicados continuam com o nome antigo até uma
> migração dedicada: domínio `chatguard.life`, imagem
> `wallesonnn/chatguard-app`, containers `chatguard-*`, rede/labels do Traefik
> e repositórios `chatguard-app` / `chatguard-docker`.

A versão atual é uma página de apresentação e conversão: sem backend, sem
banco em uso, sem funcionalidades de produto. O CTA abre um modal de
interesse (nome + telefone) ainda sem persistência. Todas as demonstrações
usam dados fictícios.

## Stack

- **Next.js 16.4.0** (App Router, `output: 'export'`), React 19.1.0,
  TypeScript — a página é pré-renderizada como HTML estático em `out/`.
- **Fontes:** Fraunces (títulos) e DM Sans (interface) via `next/font`
  (arquivos locais, sem chamada ao Google Fonts).
- **Docker:** imagem multi-stage (`node:22-alpine` → `nginx:1.27-alpine`)
  servindo o estático; publicada como `wallesonnn/chatguard-app`.
- **Deploy:** VPS com Traefik externo (rede `web`, entrypoint `websecure`,
  certresolver `lets-encrypt`) via stack no **Portainer** — config no repo
  aninhado [`chatguard-docker/`](chatguard-docker/) (remote próprio:
  `github.com/wallesonn/chatguard-docker`).
- **Postgres 17** provisionado na stack para o backend futuro (rede interna
  `db:5432`, volume `pgdata`); a landing ainda não o utiliza.

## Comandos

```bash
npm run dev                 # desenvolvimento em http://localhost:3000
npm run build               # export estático em out/
./build.sh vX.Y.Z           # build + push da imagem no Docker Hub (linux/amd64)
node scripts/generate-mundo-em-movimento.mjs   # regenera o infográfico animado
```

Após publicar a imagem, a atualização em produção é manual no Portainer:
**Pull and redeploy** (seguindo `latest`) ou `DOCKER_IMAGE` travada +
**Update the stack**.

## Documentação

- [`docs/landing-page.md`](docs/landing-page.md) — especificação da página
- [`docs/platform-concept.md`](docs/platform-concept.md) — conceito do produto
- [`docs/implementation-progress.md`](docs/implementation-progress.md) —
  registro de implementação, verificações e do deploy de 2026-10-19
- [`chatguard-docker/README.md`](chatguard-docker/README.md) — stack Docker,
  deploy no Portainer e lições do primeiro deploy
- [`AGENTS.md`](AGENTS.md) — regras de trabalho (commits são manuais, feitos
  pelo usuário)

## Observações

- `public/videos/` fica fora do Git mas **entra na imagem** quando presente
  no build local (ver `.gitignore` vs `.dockerignore`).
- Vídeo de abertura: ainda é uma simulação de 10 s; nenhum arquivo de vídeo
  existe ainda.
