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
  # A casca (cabeçalho, trilho e gaveta) é a mesma nas três; o zip trazia
  # "Julia Martins" e "Photoon" escritos à mão nela — a config troca por binding.
  gerar 'Cliente Minha conta.dc.html'      MinhaContaDesign cliente-casca.json
  gerar 'Cliente Ajuda.dc.html'            AjudaDesign      cliente-casca.json
  gerar 'Cliente Galeria de fotos.dc.html' GaleriaDesign    cliente-casca.json
fi

# Telas do painel do lojista.
#
# `conteudo.json` manda o gerador descartar a moldura: cada .dc.html trazia sua
# própria cópia da sidebar e da topbar — vinte e duas cópias do mesmo menu. A
# moldura de verdade é uma só (ShellLojistaDesign, abaixo) e o conteúdo de cada
# tela entra no slot dela.
if [ "$alvo" = tudo ] || [ "$alvo" = telas ]; then
  for par in \
    'Pedidos.dc.html:PedidosDesign' \
    'Pedido.dc.html:PedidoDesign' \
    'Producao.dc.html:ProducaoDesign' \
    'Expedicao.dc.html:ExpedicaoDesign' \
    'Catalogo.dc.html:CatalogoDesign' \
    'Precos.dc.html:PrecosDesign' \
    'Loja.dc.html:LojaDesign' \
    'CRM.dc.html:CRMDesign' \
    'Vendedores.dc.html:VendedoresDesign' \
    'Marketing.dc.html:MarketingDesign' \
    'Financeiro.dc.html:FinanceiroDesign' \
    'Carteira.dc.html:CarteiraDesign' \
    'Relatorios.dc.html:RelatoriosDesign' \
    'Integracoes.dc.html:IntegracoesDesign' \
    'Auditoria.dc.html:AuditoriaDesign' \
    'Suporte.dc.html:SuporteDesign' \
    'Temas.dc.html:TemasDesign' \
    'Configuracoes.dc.html:ConfiguracoesDesign' \
    'Clientes.dc.html:ClientesDesign'
  do
    gerar "${par%%:*}" "${par##*:}" conteudo.json
  done
fi

if [ "$alvo" = tudo ] || [ "$alvo" = lojista ]; then
  gerar 'Dashboard.dc.html' DashboardDesign dashboard.json
  gerar 'Dashboard.dc.html' ShellLojistaDesign shell-lojista.json
fi

echo "pronto. confira o diff antes de commitar."
