#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ] || [ -z "${1:-}" ]; then
  echo "❌ Uso: ./build.sh <version>"
  echo "   Exemplo: ./build.sh v1.0.0"
  exit 1
fi

VERSION=$1

DOCKER_IMAGE="${DOCKER_IMAGE:-wallesonnn/heroguard-app}"
DOCKER_PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"

echo "🔨 Building: ${DOCKER_IMAGE}:${VERSION} (${DOCKER_PLATFORM})"
docker buildx build --platform "${DOCKER_PLATFORM}" --no-cache --progress=plain \
  -f heroguard-docker/Dockerfile \
  -t "${DOCKER_IMAGE}:${VERSION}" \
  -t "${DOCKER_IMAGE}:latest" \
  --push \
  .

echo ""
echo "✅ Build + push concluídos com sucesso! A imagem foi enviada para o registry sem erros."
echo "   📦 Imagem : ${DOCKER_IMAGE}:${VERSION}"
echo "   🏷️  Latest : ${DOCKER_IMAGE}:latest"
echo "   🚀 Para atualizar a produção no Portainer, use a imagem: ${DOCKER_IMAGE}:${VERSION}"