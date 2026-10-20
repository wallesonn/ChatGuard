# AGENTS.md

Instruções para agentes que trabalham neste repositório.

## Controle de versão (regra do usuário)

- **Não fazer commits nem push** — nem no repo do app (`chatguard-app`) nem no
  repo aninhado `chatguard-docker/` (que tem remote próprio no GitHub).
  O usuário faz os commits manualmente. Exceção: somente quando ele pedir
  explicitamente.
- Preparar alterações (edições, `git rm --cached`, stage) é permitido;
  `git commit` e `git push` não.

## Repo aninhado chatguard-docker/

- Remote próprio: `github.com/wallesonn/chatguard-docker` — padrão igual ao
  inlaudo (`inlaudo-web/inlaudo-docker`).
- O GitHub rastreia **somente** `README.md` e `docker-compose.yml`. Os demais
  arquivos (Dockerfile, nginx.conf, .dockerignore, .env.example) são apenas
  locais, ignorados pelo `.gitignore` da pasta.
- Não usar `git add .` no repo do app: a pasta `chatguard-docker/` é um repo
  aninhado e seria adicionada como "embedded repo" (gitlink).

## Produção / deploy

- Site no ar desde 2026-10-19: `https://chatguard.life` (certificado Let's
  Encrypt válido). Deploy manual via **Portainer**, método *Repository*
  apontando para `wallesonn/chatguard-docker`.
- Fluxo de atualização: `./build.sh vX.Y.Z` (build + push no Docker Hub,
  imagem `wallesonnn/chatguard-app`) → **Pull and redeploy** ou
  `DOCKER_IMAGE=<tag>` + **Update the stack** no Portainer.
- Infra da VPS (mesma do inlaudo): Traefik externo, rede `web`, entrypoint
  `websecure`, certresolver `lets-encrypt`. O compose de deploy **não** tem
  bloco `build:` — o Portainer clona só o repo de deploy, sem código-fonte.
- Postgres da stack: `db:5432` só na rede interna (o host da VPS já tem outro
  Postgres na 5432; o bloco `ports` do `db` está desabilitado no compose).
- Traefik com `exposedByDefault`: serviços não-públicos precisam da label
  `traefik.enable=false` (o `db` já tem) ou geram spam de erros no log.
- Let's Encrypt: rate limit de 5 validações falhas/hora por domínio —
  garanta o DNS propagado (`dig +short dominio`) antes de subir a stack.

## Comandos úteis

- Dev: `npm run dev` (fallback: `node node_modules/next/dist/bin/next dev`
  se o binário perder permissão de execução).
- Build: `npm run build` (Next.js 16, export estático em `out/`).
- Imagem Docker: `./build.sh vX.Y.Z` (build + push no Docker Hub,
  plataforma `linux/amd64`, vídeo de `public/videos/` entra na imagem).
- Infográfico animado: `node scripts/generate-mundo-em-movimento.mjs` após
  editar o script ou o SVG-mestre — nunca editar os arquivos gerados à mão.
- Verificação de tipos: `node node_modules/typescript/bin/tsc --noEmit`.