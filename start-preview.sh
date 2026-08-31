#!/bin/bash
# Inicia o servidor standalone do Photoon (branch reestruturacao) em :3101
# sem tocar o Docker que serve a master em :3000.
#
# Carrega o .env do projeto (NEXT_PUBLIC_*), define PORT=3101 e roda o
# `server.js` que o `next build` deixou em .next/standalone.

set -e

cd /root/photoon

# Mata um eventual preview anterior.
pkill -f 'PORT=3101.*server.js' 2>/dev/null || true
sleep 0.5

# Carrega o .env em modo export.
set -a
. ./.env
set +a

export PORT=3101
export HOSTNAME=0.0.0.0

# Garante que public/ e .next/static/ estao dentro do standalone (sao
# dependencias que o output: 'standalone' nao copia sozinho).
mkdir -p .next/standalone/.next
cp -rn public .next/standalone/ 2>/dev/null || true
cp -rn .next/static .next/standalone/.next/ 2>/dev/null || true

cd .next/standalone

# Roda em background. Log em /tmp/photoon-preview.log.
nohup env PORT=3101 HOSTNAME=0.0.0.0 \
  NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  NEXT_PUBLIC_ROOT_DOMAIN="$NEXT_PUBLIC_ROOT_DOMAIN" \
  NEXT_PUBLIC_PROTOCOL="$NEXT_PUBLIC_PROTOCOL" \
  node server.js > /tmp/photoon-preview.log 2>&1 &

PID=$!
echo "Preview PID: $PID"
sleep 2
echo "---"
echo "Log (primeiras 20 linhas):"
head -20 /tmp/photoon-preview.log
echo "---"
echo "Para parar: kill $PID"
echo "URL: http://srv1934934.hstgr.cloud:3101 (ou :3101 via IP)"
