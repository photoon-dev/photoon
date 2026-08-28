#!/usr/bin/env bash
#
# Regenera os componentes transliterados a partir dos .dc.html do Claude Design.
#
# Os arquivos em src/components/design/ são GERADOS. Não edite à mão: edite o
# .dc.html correspondente (ou a config em tools/telas/) e rode este script.
#
#   ./tools/gerar.sh            regenera tudo
#   ./tools/gerar.sh editor     regenera só o editor
#
set -euo pipefail
cd "$(dirname "$0")/.."

D=design/extraido
S=src/components/design
T=tools/telas

gerar() {
  local arquivo="$1" componente="$2" config="$3"
  local cfg='{}'
  [ -n "$config" ] && cfg="$(cat "$T/$config")"
  echo "  $componente"
  python3 tools/dc2tsx.py "$D/$arquivo" "$componente" "$cfg" > "$S/$componente.tsx"
}

alvo="${1:-tudo}"

if [ "$alvo" = tudo ] || [ "$alvo" = editor ]; then
  gerar 'Cliente Editor.dc.html' EditorDesign editor.json
fi

if [ "$alvo" = tudo ] || [ "$alvo" = cliente ]; then
  gerar 'Cliente Meus projetos.dc.html' MeusProjetosDesign meus-projetos.json
fi

if [ "$alvo" = tudo ] || [ "$alvo" = lojista ]; then
  gerar 'Dashboard.dc.html' DashboardDesign dashboard.json
  gerar 'Dashboard.dc.html' ShellLojistaDesign shell-lojista.json
fi

echo "pronto. confira o diff antes de commitar."
